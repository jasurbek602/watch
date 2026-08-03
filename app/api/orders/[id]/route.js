import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { getAdminSession } from "@/lib/auth";

// PUT /api/orders/:id  - status: "Yangi" | "Bajarildi" | "Bekor qilindi"
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
    const { status } = await request.json();

    const order = await Order.findByIdAndUpdate(
      params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Buyurtma topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// DELETE /api/orders/:id
export async function DELETE(request, { params }) {
  await dbConnect();

  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Ruxsat yo'q" },
      { status: 401 }
    );
  }

  const deleted = await Order.findByIdAndDelete(params.id);

  if (!deleted) {
    return NextResponse.json(
      { success: false, message: "Buyurtma topilmadi" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: {} });
}
