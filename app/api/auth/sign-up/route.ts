import connectDB from '@/lib/db';
import User from '@/lib/models/user';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get request body
    const body = await request.json();
    const { name, email, password } = body;

    // Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
      },
      { status: 500 }
    );
  }
}
