import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import ProductForm from "@/components/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }) {
  await dbConnect();

  let product;
  try {
    product = await Product.findById(params.id).lean();
  } catch (e) {
    product = null;
  }

  if (!product) notFound();

  const serialized = JSON.parse(JSON.stringify(product));

  return (
    <div>
      <h1 className="text-xl font-bold text-primary mb-5">
        Mahsulotni tahrirlash
      </h1>
      <ProductForm initialData={serialized} productId={serialized._id} />
    </div>
  );
}
