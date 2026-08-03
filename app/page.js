"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import OrderModal from "@/components/OrderModal";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Barchasi");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    if (data.success) setProducts(data.data);
    setLoading(false);
  }, [category, search]);

  useEffect(() => {
    // Qidiruvda ortiqcha so'rov yubormaslik uchun kichik debounce
    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [fetchProducts]);

  return (
    <>
      <Header
        activeCategory={category}
        onCategoryChange={setCategory}
        searchTerm={search}
        onSearchChange={setSearch}
      />

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Zamonaviy qo'l soatlari katalogi
        </h1>

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Yuklanmoqda...
          </div>
        ) : (
          <ProductGrid products={products} onQuickOrder={setSelectedProduct} />
        )}
      </main>

      <footer className="bg-primary text-white/70 text-center text-sm py-4">
        &copy; {new Date().getFullYear()} WatchShop. Barcha huquqlar
        himoyalangan.
      </footer>

      <OrderModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
