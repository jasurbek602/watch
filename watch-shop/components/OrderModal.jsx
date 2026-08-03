"use client";

import { useState } from "react";
import { formatPrice } from "./ProductCard";

export default function OrderModal({ product, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  if (!product) return null;

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          customerName: form.name,
          phone: form.phone,
          address: form.address,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Xatolik yuz berdi");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
          aria-label="Yopish"
        >
          &times;
        </button>

        {status === "success" ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-lg font-semibold text-primary">
              Buyurtmangiz qabul qilindi!
            </h3>
            <p className="text-gray-500 mt-2 text-sm">
              Tez orada operatorlarimiz siz bilan bog'lanishadi.
            </p>
            <button
              onClick={onClose}
              className="mt-5 bg-primary text-white px-5 py-2 rounded-xl text-sm"
            >
              Yopish
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-primary mb-4">
              Buyurtma berish
            </h3>

            {/* Tanlangan mahsulot preview */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.mainImage}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <p className="font-medium text-primary text-sm">
                  {product.title}
                </p>
                <p className="text-accent font-bold text-sm">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Ismi</label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ism Familiya"
                  className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Telefon raqami
                </label>
                <input
                  required
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+998 90 123 45 67"
                  className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Yetkazib berish manzili
                </label>
                <textarea
                  required
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Shahar, tuman, ko'cha..."
                  rows={2}
                  className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {status === "error" && (
                <p className="text-red-500 text-sm">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-primary text-white py-2.5 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Yuborilmoqda..." : "Tasdiqlash"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
