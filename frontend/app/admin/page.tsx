"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Package,
  FileText,
  AlertTriangle,
  Building2,
  Shield,
  ArrowUpRight,
} from "lucide-react";
import Charts from "@/components/dashboard/Charts";
import { IDashboardStats, IItem } from "@/lib/types";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: number | null;
  icon: React.ElementType;
  accent: string;
  bg: string;
  href?: string;
}

// ✅ Proper typed StatCard
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<IDashboardStats | null>(null);  // ✅ typed
  const [items, setItems] = useState<IItem[]>([]);                   // ✅ typed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Parallel API calls
        const [statsRes, itemsRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/items"),
        ]);
        setStats(statsRes.data.data);
        setItems(itemsRes.data.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ All 5 stat cards — matches backend response
  const statCards: StatCardProps[] = [
    {
      title: "Total Hostels",
      value: stats?.totalHostels ?? null,
      icon: Building2,
      accent: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Guards",
      value: stats?.totalGuards ?? null,
      icon: Shield,
      accent: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      title: "Total Items",
      value: stats?.totalItems ?? null,
      icon: Package,
      accent: "text-blue-500",
      bg: "bg-blue-50",
      href: "/admin/items",
    },
    {
      title: "Stock Logs",
      value: stats?.totalLogs ?? null,
      icon: FileText,
      accent: "text-indigo-500",
      bg: "bg-indigo-50",
      href: "/admin/logs",
    },
    {
      title: "Low Stock",
      value: stats?.lowStock ?? null,
      icon: AlertTriangle,
      accent: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-6 max-w-6xl">

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Overview of your hostel inventory and activity
          </p>
        </div>

        {/* ✅ Stats Grid with skeletons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : statCards.map((card) => <StatCard key={card.title} {...card} />)
          }
        </div>

        {/* ✅ Chart — outside grid, proper layout */}
        {!loading && items.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Inventory Overview
              </h2>
              <Link
                href="/admin/items"
                className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                View all <ArrowUpRight size={12} />
              </Link>
            </div>
            <Charts items={items} />
          </div>
        )}

        {/* ✅ Low stock alert banner */}
        {!loading && stats && stats.lowStock > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={16} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">
                {stats.lowStock} item{stats.lowStock > 1 ? "s" : ""} running low on stock
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Check your inventory and restock soon
              </p>
            </div>
            <Link
              href="/admin/items"
              className="ml-auto text-xs font-medium text-amber-700 hover:text-amber-900 flex items-center gap-1 flex-shrink-0"
            >
              View <ArrowUpRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}