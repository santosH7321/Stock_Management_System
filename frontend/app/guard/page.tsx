"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Package, FileText, AlertTriangle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function GuardDashboard() {
  const [itemCount, setItemCount] = useState<number | null>(null);
  const [logCount, setLogCount] = useState<number | null>(null);
  const [lowStock, setLowStock] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, logsRes, lowRes] = await Promise.all([
          api.get("/items?limit=1"),
          api.get("/logs?limit=1"),
          api.get("/items/low-stock"),
        ]);
        setItemCount(itemsRes.data.total);
        setLogCount(logsRes.data.total);
        setLowStock(lowRes.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout role="GUARD">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Your hostel stock overview</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/guard/items">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Items</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{itemCount ?? "—"}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Package size={18} className="text-blue-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                  <span>View items</span><ArrowUpRight size={12} />
                </div>
              </div>
            </Link>

            <Link href="/guard/logs">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Logs</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{logCount ?? "—"}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <FileText size={18} className="text-indigo-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                  <span>View logs</span><ArrowUpRight size={12} />
                </div>
              </div>
            </Link>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Low Stock</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{lowStock ?? "—"}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <AlertTriangle size={18} className="text-amber-500" />
                </div>
              </div>
              {lowStock !== null && lowStock > 0 && (
                <p className="mt-4 text-xs text-amber-500">Needs attention</p>
              )}
            </div>
          </div>
        )}

        {lowStock !== null && lowStock > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              <span className="font-semibold">{lowStock} item{lowStock > 1 ? "s" : ""}</span> in your hostel {lowStock > 1 ? "are" : "is"} running low on stock.
            </p>
            <Link href="/guard/items" className="ml-auto text-xs font-medium text-amber-700 flex items-center gap-1 flex-shrink-0 hover:text-amber-900">
              View <ArrowUpRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
