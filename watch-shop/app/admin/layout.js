"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // Login sahifasida sidebar ko'rsatilmasin
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const linkClass = (href) =>
    `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      pathname === href
        ? "bg-accent text-primary"
        : "text-white/80 hover:bg-white/10"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-56 bg-primary flex flex-col shrink-0">
        <div className="px-4 py-5 text-white font-bold text-lg">
          Watch<span className="text-accent">Shop</span>
          <div className="text-xs text-white/50 font-normal">
            Admin Panel
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <Link href="/admin" className={linkClass("/admin")}>
            📦 Buyurtmalar
          </Link>
          <Link
            href="/admin/products"
            className={linkClass("/admin/products")}
          >
            ⌚ Mahsulotlar
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="m-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 text-left"
        >
          🚪 Chiqish
        </button>
      </aside>

      <main className="flex-1 p-6 overflow-x-auto">{children}</main>
    </div>
  );
}
