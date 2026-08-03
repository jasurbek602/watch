"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Gallery from "@/components/Gallery";
import OrderModal from "@/components/OrderModal";
import { formatPrice } from "@/components/ProductCard";
import { useRouter } from "next/navigation";

export default function ProductDetailClient({ product }) {
  const [showOrder, setShowOrder] = useState(false);
  const router = useRouter();

  return (
    <>
      <Header
        activeCategory="Barchasi"
        onCategoryChange={(cat) =>
          router.push(`/?category=${encodeURIComponent(cat)}`)
        }
        searchTerm=""
        onSearchChange={() => {}}
      />

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="grid md:grid-cols-2 gap-8">
          <Gallery images={product.images} title={product.title} />

          <div>
            <span className="inline-block text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full mb-2">
              {product.category}
            </span>
            <h1 className="text-2xl font-bold text-primary">
              {product.title}
            </h1>
            <p className="text-2xl font-bold text-accent mt-2">
              {formatPrice(product.price)}
            </p>

            <button
              onClick={() => setShowOrder(true)}
              className="mt-5 w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-black transition-colors"
            >
              Buyurtma berish
            </button>

            <div className="mt-8">
              <h2 className="font-semibold text-primary mb-2">
                Batafsil ta'rif
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {product.features?.length > 0 && (
              <div className="mt-6">
                <h2 className="font-semibold text-primary mb-2">
                  Afzalliklari
                </h2>
                <ul className="space-y-1">
                  {product.features.map((f, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-accent">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.instructions && (
              <div className="mt-6">
                <h2 className="font-semibold text-primary mb-2">
                  Foydalanish yo'riqnomasi
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.instructions}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showOrder && (
        <OrderModal product={product} onClose={() => setShowOrder(false)} />
      )}
    </>
  );
}
