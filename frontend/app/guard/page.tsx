"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Package,
  AlertTriangle,
  FileText,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { IItem, IStockLog } from "@/lib/types";
import Link from "next/link";

// ============================================
// STAT CARD
// ============================================
interface StatCardProps {
  title: string;
  value: number | null;
  icon: React.ElementType;
  accent: string;
  bg: string;
  href?: string;
}

function StatCard({ title, value, icon: Icon, accent, bg, href }: StatCardProps) {
  const content = (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">
            {value ?? "—"}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon size={18} className={accent} />
        </div>
      </div>
      {href && (
        <div className="mt-4 flex items-center gap-1 text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
          <span>View details</span>
          <ArrowUpRight size={12} />
        </div>
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

// ✅ Skeleton loader
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-28" />
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function GuardDashboard() {
  const [items, setItems] = useState<IItem[]>([]);
  const [lowStock, setLowStock] = useState<IItem[]>([]);
  const [recentLogs, setRecentLogs] = useState<IStockLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ Parallel fetch — all 3 at once
      const [itemsRes, lowStockRes, logsRes] = await Promise.all([
        api.get("/items?limit=100"),
        api.get("/items/low-stock"),
        api.get("/logs?limit=5"),
      ]);

      setItems(itemsRes.data.data);
      setLowStock(lowStockRes.data.data);
      setRecentLogs(logsRes.data.data);
    } catch (err) {
      console.error("Failed to fetch guard dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const statCards: StatCardProps[] = [
    {
      title: "Total Items",
      value: items.length,
      icon: Package,
      accent: "text-blue-500",
      bg: "bg-blue-50",
      href: "/guard/items",
    },
    {
      title: "Low Stock",
      value: lowStock.length,
      icon: AlertTriangle,
      accent: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: "Stock Updates",
      value: recentLogs.length > 0 ? recentLogs.length : 0,
      icon: FileText,
      accent: "text-indigo-500",
      bg: "bg-indigo-50",
      href: "/guard/logs",
    },
  ];

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <DashboardLayout role="GUARD">
      <div className="space-y-6 max-w-5xl">

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Overview of your hostel inventory
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : statCards.map((card) => <StatCard key={card.title} {...card} />)
          }
        </div>

        {/* Low stock alert */}
        {!loading && lowStock.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={16} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">
                {lowStock.length} item{lowStock.length > 1 ? "s" : ""} running low on stock
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Please update stock or notify admin
              </p>
            </div>
            <Link
              href="/guard/items"
              className="ml-auto text-xs font-medium text-amber-700 hover:text-amber-900 flex items-center gap-1 flex-shrink-0"
            >
              View <ArrowUpRight size={12} />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Low stock items list */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">
                Low Stock Items
              </h2>
              <Link
                href="/guard/items"
                className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                View all <ArrowUpRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
              </div>
            ) : lowStock.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-400">
                  All items are sufficiently stocked ✅
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {lowStock.slice(0, 5).map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between px-6 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <Package size={13} className="text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.itemName}
                        </p>
                        <p className="text-xs text-gray-400">
                          Min: {item.minThreshold} {item.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-500">
                        {item.availableQuantity}
                      </p>
                      <p className="text-xs text-gray-400">{item.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">
                Recent Activity
              </h2>
              <Link
                href="/guard/logs"
                className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                View all <ArrowUpRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
              </div>
            ) : recentLogs.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-400">
                  No stock activity yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentLogs.map((log) => (
                  <div
                    key={log._id}
                    className="flex items-center justify-between px-6 py-3"
                  >
                    <div className="flex items-center gap-3">
                      {/* Action icon */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          log.action === "INCREASE"
                            ? "bg-green-50"
                            : "bg-red-50"
                        }`}
                      >
                        {log.action === "INCREASE" ? (
                          <TrendingUp size={13} className="text-green-500" />
                        ) : (
                          <TrendingDown size={13} className="text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {log.itemId?.itemName ?? "—"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(log.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${
                          log.action === "INCREASE"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {log.action === "INCREASE" ? "+" : "-"}
                        {log.quantity}
                      </p>
                      <p className="text-xs text-gray-400">
                        {log.beforeQty} → {log.afterQty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}