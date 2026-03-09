"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StockModal from "@/components/ui/StockModal";
import {
  Search,
  AlertTriangle,
  RefreshCw,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { IItem } from "@/lib/types";

// ============================================
// HELPERS
// ============================================
const unitColors: Record<string, string> = {
  KG:     "bg-blue-50 text-blue-600",
  LITRE:  "bg-cyan-50 text-cyan-600",
  PIECE:  "bg-purple-50 text-purple-600",
  PACKET: "bg-orange-50 text-orange-600",
  BOX:    "bg-green-50 text-green-600",
};

const stockStatus = (item: IItem) => {
  if (item.availableQuantity === 0)
    return { label: "Out of Stock", class: "bg-red-50 text-red-600" };
  if (item.availableQuantity <= item.minThreshold)
    return { label: "Low Stock", class: "bg-amber-50 text-amber-600" };
  return { label: "In Stock", class: "bg-green-50 text-green-600" };
};

// ============================================
// MAIN PAGE
// ============================================
export default function GuardItemsPage() {
  const [items, setItems]         = useState<IItem[]>([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected]   = useState<IItem | null>(null);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);

  const fetchItems = useCallback(
    async (p: number, showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const params = new URLSearchParams({
          page:  String(p),
          limit: "10",
          ...(search && { search }),
        });

        const res = await api.get(`/items?${params}`);
        setItems(res.data.data);
        setTotalPages(res.data.pages);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Failed to fetch items", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search]
  );

  // ✅ Debounced search + page change
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItems(page);
    }, 300);
    return () => clearTimeout(timeout);
  }, [page, search, fetchItems]);

  return (
    <DashboardLayout role="GUARD">
      <div className="space-y-5 max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Items
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {total} items in your hostel
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Search items..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white w-52"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={() => fetchItems(page, true)}
              disabled={refreshing}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-400">Loading items...</p>
            </div>
          ) : items.length === 0 ? (
            // ✅ Empty state
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                <Package size={20} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">No items found</p>
              <p className="text-xs text-gray-400 mt-1">
                {search
                  ? "Try a different search term"
                  : "No items have been added to your hostel yet"}
              </p>
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {["Item", "Unit", "Available", "Total", "Threshold", "Status", "Action"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => {
                    const status = stockStatus(item);
                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Item name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Package size={14} className="text-blue-500" />
                            </div>
                            <span className="font-medium text-gray-800">
                              {item.itemName}
                            </span>
                          </div>
                        </td>

                        {/* Unit */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                              unitColors[item.unit] ?? "bg-gray-50 text-gray-600"
                            }`}
                          >
                            {item.unit}
                          </span>
                        </td>

                        {/* Available qty */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800">
                              {item.availableQuantity}
                            </span>
                            {item.availableQuantity <= item.minThreshold && (
                              <AlertTriangle
                                size={13}
                                className="text-amber-400"
                              />
                            )}
                          </div>
                        </td>

                        {/* Total qty */}
                        <td className="px-6 py-4 text-gray-500">
                          {item.totalQuantity}
                        </td>

                        {/* Min threshold */}
                        <td className="px-6 py-4 text-gray-500">
                          {item.minThreshold}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium ${status.class}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        {/* ✅ Update stock — guard can do this */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelected(item)}
                            className="px-4 py-1.5 rounded-lg bg-[#0C0E14] hover:bg-[#1a1d27] text-white text-xs font-medium transition-all"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
                  <p className="text-xs text-gray-400">
                    Page {page} of {totalPages} · {total} items
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ✅ Stock modal — guard can increase or decrease */}
      {selected && (
        <StockModal
          item={selected}
          onClose={() => setSelected(null)}
          onSuccess={() => fetchItems(page, true)}
        />
      )}
    </DashboardLayout>
  );
}