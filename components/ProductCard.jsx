"use client";

import Link from "next/link";

function formatPrice(price) {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}

export default function ProductCard({ product, onQuickOrder }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      <Link href={`/product/${product._id}`} className="block">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.mainImage}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${product._id}`}>
          <h3 className="font-semibold text-primary line-clamp-1 hover:text-accent">
            {product.title}
          </h3>
        </Link>
        <p className="text-lg font-bold text-accent mt-1">
          {formatPrice(product.price)}
        </p>

        <button
          onClick={() => onQuickOrder(product)}
          className="mt-auto pt-3 w-full bg-primary text-white text-sm font-medium py-2 rounded-xl hover:bg-black transition-colors"
        >
          Buyurtma berish
        </button>
      </div>
    </div>
  );
}

export { formatPrice };
