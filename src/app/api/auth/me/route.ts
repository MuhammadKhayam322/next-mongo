import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
    
    if (!token) {
      return NextResponse.json(
        
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch {
    
    return NextResponse.json(
     
      { status: 500 }
    );
  }
}