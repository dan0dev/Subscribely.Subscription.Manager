import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Adatbázis kapcsolat létrehozása
    await connectDB();

    // Kérés adatainak kinyerése
    const { name, email, password } = await request.json();

    // Ellenőrizzük, hogy a felhasználó létezik-e már
    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Új felhasználó létrehozása
    const user = await User.create({
      name,
      email,
      password,
    });

    // Sikeres válasz küldése, jelszó nélkül
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
