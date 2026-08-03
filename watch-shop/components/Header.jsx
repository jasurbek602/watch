"use client";

import { FaInstagram, FaTelegramPlane, FaSearch } from "react-icons/fa";

const CATEGORIES = ["Barchasi", "Erkaklar uchun", "Ayollar uchun"];

export default function Header({
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}) {
  return (
    <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
      {/* Tepa qator: logo + ijtimoiy tarmoqlar */}
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <a href="/" className="text-xl font-bold tracking-wide">
          Watch<span className="text-accent">Shop</span>
        </a>

        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white hover:text-accent transition-colors text-xl"
          >
            <FaInstagram />
          </a>
          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="text-white hover:text-accent transition-colors text-xl"
          >
            <FaTelegramPlane />
          </a>
        </div>
      </div>

      {/* Kategoriyalar va qidiruv */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 pb-3">
        <nav className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-accent text-primary"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Soat qidirish..."
            className="w-full rounded-full bg-white/10 placeholder-gray-400 text-white text-sm pl-9 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>
    </header>
  );
}
