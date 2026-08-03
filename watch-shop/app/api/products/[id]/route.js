import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { getAdminSession } from "@/lib/auth";

// GET /api/products/:id
export async function GET(request, { params }) {
  await dbConnect();

  const product = await Product.findById(params.id).lean();

  if (!product) {
    return NextResponse.json(
      { success: false, message: "Mahsulot topilmadi" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: product });
}

// PUT /api/products/:id (faqat admin)
export async function PUT(request, { params }) {
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

    const updateData = {
      title: body.title,
      price: body.price,
      category: body.category,
      images: body.images,
      description: body.description,
      features: body.features || [],
      instructions: body.instructions || "",
    };

    if (body.images?.length) {
      updateData.mainImage = body.images[0];
    }

    const product = await Product.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Mahsulot topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// DELETE /api/products/:id (faqat admin)
export async function DELETE(request, { params }) {
  await dbConnect();

  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Ruxsat yo'q" },
      { status: 401 }
    );
  }

  const deleted = await Product.findByIdAndDelete(params.id);

  if (!deleted) {
    return NextResponse.json(
      { success: false, message: "Mahsulot topilmadi" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: {} });
}
