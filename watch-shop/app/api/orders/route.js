import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAdminSession } from "@/lib/auth";

// GET /api/orders (faqat admin panelda ro'yxatni ko'rish uchun)
export async function GET() {
  await dbConnect();

  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Ruxsat yo'q" },
      { status: 401 }
    );
  }

  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ success: true, data: orders });
}

// POST /api/orders (mijoz tomonidan, ochiq - login shart emas)
export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { productId, customerName, phone, address } = body;

    if (!productId || !customerName || !phone || !address) {
      return NextResponse.json(
        { success: false, message: "Barcha maydonlarni to'ldiring" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Mahsulot topilmadi" },
        { status: 404 }
      );
    }

    const order = await Order.create({
      product: product._id,
      productSnapshot: {
        title: product.title,
        price: product.price,
        image: product.mainImage,
      },
      customerName,
      phone,
      address,
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
