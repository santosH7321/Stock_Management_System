"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StockModal from "@/components/ui/StockModal";
import { Search } from "lucide-react";

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);


  useEffect(() => {
    api.get("/items").then((res) => {
      setItems(res.data.data);
      setLoading(false);
    });
  }, []);

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Items Inventory</h1>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
            />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

          {loading ? (
            <div className="p-10 text-center text-gray-400">
              Loading items...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No items found
            </div>
          ) : (
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                    <tr>
                    <th className="text-left px-6 py-4 font-semibold">Item</th>
                    <th className="text-left px-6 py-4 font-semibold">Hostel</th>
                    <th className="text-left px-6 py-4 font-semibold">Available</th>
                    <th className="text-left px-6 py-4 font-semibold">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredItems.map((item) => (
                    <tr
                        key={item._id}
                        className="border-t hover:bg-indigo-50/40 transition"
                    >
                        <td className="px-6 py-4 font-medium text-gray-800">
                        {item.itemName}
                        </td>
                        
                        <td className="px-6 py-4 text-gray-600">
                        {item.hostelId.name}
                        </td>

                        <td className="px-6 py-4">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${
                                item.availableQuantity > 5
                                ? "bg-green-100 text-green-700"
                                : item.availableQuantity > 0
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                        >
                            {item.availableQuantity}
                        </span>
                        </td>

                        <td className="px-6 py-4">
                        <button
                            onClick={() => setSelected(item._id)}
                            className="
                            px-4 py-1.5 rounded-lg
                            bg-indigo-600 text-white text-xs font-semibold
                            hover:bg-indigo-700
                            shadow-sm hover:shadow-md
                            transition active:scale-95
                            "
                        >
                            Update
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>

          )}
        </div>
      </div>
      {selected && (
        <StockModal
            itemId={selected}
            onClose={() => setSelected(null)}
            onSuccess={() => window.location.reload()}
        />
        )}
    </DashboardLayout>
  );
}
