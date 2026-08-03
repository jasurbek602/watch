import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import ProductDetailClient from "@/components/ProductDetailClient";
import { notFound } from "next/navigation";

// Server Component: SEO uchun ham qulay, ma'lumot to'g'ridan-to'g'ri DB'dan
export default async function ProductDetailPage({ params }) {
  await dbConnect();

  let product;
  try {
    product = await Product.findById(params.id).lean();
  } catch (e) {
    product = null;
  }

  if (!product) {
    notFound();
  }

  // Mongoose ObjectId / Date larni JSON-safe qilib berish
  const serialized = JSON.parse(JSON.stringify(product));

  return <ProductDetailClient product={serialized} />;
}
