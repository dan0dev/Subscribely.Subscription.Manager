import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import * as jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // A promise that rejects after 8 seconds
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Login request timed out after 8 seconds"));
      }, 8000);
    });

    // Promise that resolves the login process
    const loginPromise = (async (): Promise<NextResponse> => {
      await connectDB();

      const body = await request.json();
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
      }

      // Find user by email or username (name)
      const user = await User.findOne({
        $or: [{ email: email }, { name: email }],
      }).select("+password");

      // Check if user exists
      if (!user) {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
      }

      // Verify password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
      }

      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "2d",
      });

      // Create response
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          accountMoney: user.accountMoney,
        },
      });

      // Set cookie
      response.cookies.set("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60,
        path: "/",
        sameSite: "strict",
      });

      return response;
    })();

    // Race between login and timeout
    const response = await Promise.race([loginPromise, timeoutPromise]);

    // Mivel tudjuk, hogy a response egy NextResponse (Response), így biztonságosan visszaadhatjuk
    return response;
  } catch (error) {
    console.error("Login error:", error);

    // Handle timeout error
    if (error instanceof Error && error.message.includes("timed out")) {
      return NextResponse.json(
        {
          success: false,
          message: "Login request timed out. Please try again.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      },
      { status: 500 }
    );
  }
}
