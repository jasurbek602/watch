"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Rasm faylini base64 (data URL) ko'rinishiga o'tkazish.
// Eslatma: Cloudinary ulanganda bu funksiya o'rniga Cloudinary upload
// so'rovi yuborilib, natijadagi secure_url saqlanadi.
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProductForm({ initialData, productId }) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [title, setTitle] = useState(initialData?.title || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [category, setCategory] = useState(
    initialData?.category || "Erkaklar uchun"
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [instructions, setInstructions] = useState(
    initialData?.instructions || ""
  );
  const [featuresText, setFeaturesText] = useState(
    (initialData?.features || []).join("\n")
  );
  const [images, setImages] = useState(initialData?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleImageSelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const base64Images = await Promise.all(files.map(fileToBase64));
      setImages((prev) => [...prev, ...base64Images]);
    } catch (err) {
      setError("Rasm yuklashda xatolik yuz berdi");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (images.length === 0) {
      setError("Kamida bitta rasm yuklang");
      return;
    }

    setSaving(true);

    const payload = {
      title,
      price: Number(price),
      category,
      description,
      instructions,
      features: featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      images,
    };

    const url = isEdit ? `/api/products/${productId}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    setSaving(false);

    if (!data.success) {
      setError(data.message || "Xatolik yuz berdi");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm p-6 max-w-2xl space-y-4"
    >
      <div>
        <label className="text-sm text-gray-600">Soat nomi</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Narxi (so'm)</label>
          <input
            required
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Kategoriya</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="Erkaklar uchun">Erkaklar uchun</option>
            <option value="Ayollar uchun">Ayollar uchun</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-600">
          Rasmlar (bir nechtasini tanlash mumkin)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="mt-1 w-full text-sm"
        />
        {uploading && (
          <p className="text-xs text-gray-400 mt-1">Yuklanmoqda...</p>
        )}

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`preview-${idx}`}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="text-sm text-gray-600">Batafsil ta'rif</label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">
          Afzalliklari (har birini alohida qatorga yozing)
        </label>
        <textarea
          rows={3}
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          placeholder={"Suvga chidamli\n1 yil kafolat\nShveytsariya mexanizmi"}
          className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">
          Foydalanish/sotib olish yo'riqnomasi
        </label>
        <textarea
          rows={3}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploading}
        className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-60"
      >
        {saving ? "Saqlanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
      </button>
    </form>
  );
}
