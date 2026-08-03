"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/components/ProductCard";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    if (data.success) setProducts(data.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Ushbu mahsulotni o'chirishga ishonchingiz komilmi?")) return;

    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p._id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-primary">Mahsulotlar</h1>
        <Link
          href="/admin/products/new"
          className="bg-accent text-primary px-4 py-2 rounded-xl text-sm font-medium"
        >
          + Yangi soat qo'shish
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Yuklanmoqda...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400">Hozircha mahsulotlar yo'q.</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Rasm</th>
                <th className="px-4 py-3">Nomi</th>
                <th className="px-4 py-3">Kategoriya</th>
                <th className="px-4 py-3">Narxi</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.mainImage}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-primary">
                    {product.title}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-accent font-semibold">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Tahrirlash
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      O'chirish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
