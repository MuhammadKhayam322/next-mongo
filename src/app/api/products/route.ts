import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({});

    return NextResponse.json(
      { products },
      { status: 200 }
    );
  } catch {
    
    return NextResponse.json(
    
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(req as any);
    if (!userId) {
      return NextResponse.json(

        { status: 401 }
      );
    }

    const { name, description, price, category, inStock, } = await req.json();

    if (!name || !price || !category) {
      return NextResponse.json(

        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      inStock: inStock !== undefined ? inStock : true,

    });

    return NextResponse.json(
      {
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch {

    return NextResponse.json(

      { status: 500 }
    );
  }
}