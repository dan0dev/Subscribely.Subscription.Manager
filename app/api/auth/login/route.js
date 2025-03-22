import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Adatbázis kapcsolat létrehozása
    await connectDB();

    // Kérés adatainak kinyerése
    const { email, password } = await request.json();

    // Felhasználó keresése
    const user = await User.findOne({ email }).select("+password");

    // Ellenőrizzük, hogy a felhasználó létezik-e
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Jelszó ellenőrzése
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Módosítva 30 napról 1 napra
    );

    // Cookie beállítása
    const cookieStore = cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 24 * 60 * 60, // 1 nap másodpercekben (módosítva 30 napról)
      path: "/",
      sameSite: "strict",
    });

    // Sikeres válasz küldése
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
