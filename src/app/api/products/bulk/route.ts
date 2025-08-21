import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { products } = await req.json();

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: "Products array is required" },
        { status: 400 }
      );
    }

    // Validate each product
    const validatedProducts = products.map(product => ({
      name: product.name || "Unnamed Product",
      description: product.description || "",
      price: Number(product.price) || 0,
      category: product.category || "Uncategorized",
      inStock: product.inStock !== undefined ? product.inStock : true,
      image: product.image || "",
    }));

    const createdProducts = await Product.insertMany(validatedProducts);

    return NextResponse.json(
      {
        message: `${createdProducts.length} products created successfully`,
        products: createdProducts,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Bulk create products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}