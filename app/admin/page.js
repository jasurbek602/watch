"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/components/ProductCard";

const STATUS_STYLES = {
  Yangi: "bg-blue-100 text-blue-700",
  Bajarildi: "bg-green-100 text-green-700",
  "Bekor qilindi": "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    if (data.success) setOrders(data.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(id, status) {
    // Optimistik yangilash - UI darhol o'zgaradi
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status } : o))
    );

    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-primary mb-5">Buyurtmalar</h1>

      {loading ? (
        <p className="text-gray-400">Yuklanmoqda...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400">Hozircha buyurtmalar yo'q.</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Mahsulot</th>
                <th className="px-4 py-3">Mijoz</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Manzil</th>
                <th className="px-4 py-3">Vaqt</th>
                <th className="px-4 py-3">Holat</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={order.productSnapshot?.image}
                        alt={order.productSnapshot?.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-primary">
                          {order.productSnapshot?.title}
                        </p>
                        <p className="text-accent text-xs font-semibold">
                          {formatPrice(order.productSnapshot?.price || 0)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{order.phone}</td>
                  <td className="px-4 py-3 max-w-[200px]">{order.address}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleString("uz-UZ")}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-accent ${STATUS_STYLES[order.status]}`}
                    >
                      <option value="Yangi">Yangi</option>
                      <option value="Bajarildi">Bajarildi</option>
                      <option value="Bekor qilindi">Bekor qilindi</option>
                    </select>
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
