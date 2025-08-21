import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
      
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
       
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userWithoutPassword = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userWithoutPassword,
        token,
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  }
   catch  {
    return NextResponse.json( 
      { status: 500 }
    );
  }
}