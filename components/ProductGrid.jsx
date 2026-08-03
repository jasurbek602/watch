"use client";

import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onQuickOrder }) {
  if (!products?.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        Hech qanday mahsulot topilmadi.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onQuickOrder={onQuickOrder}
        />
      ))}
    </div>
  );
}
