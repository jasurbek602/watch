import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { getAdminSession } from "@/lib/auth";

// GET /api/products?category=Erkaklar%20uchun&search=rolex
export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const query = {};

  if (category && category !== "Barchasi") {
    query.category = category;
  }

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const products = await Product.find(query).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ success: true, data: products });
}

// POST /api/products  (faqat admin uchun)
export async function POST(request) {
  await dbConnect();

  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Ruxsat yo'q" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const product = await Product.create({
      title: body.title,
      price: body.price,
      category: body.category,
      images: body.images,
      mainImage: body.images?.[0],
      description: body.description,
      features: body.features || [],
      instructions: body.instructions || "",
    });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
