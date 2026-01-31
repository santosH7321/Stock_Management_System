"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Package, FileText, AlertTriangle } from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => {
      setStats(res.data.data);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">
            Quick insights about hostel inventory & activity
          </p>
        </div>

        {/* Stats Grid */}
        {!stats ? (
          <div className="text-gray-400">Loading stats...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard
              title="Total Items"
              value={stats.totalItems}
              icon={Package}
              color="indigo"
            />

            <StatCard
              title="Total Logs"
              value={stats.totalLogs}
              icon={FileText}
              color="blue"
            />

            <StatCard
              title="Low Stock"
              value={stats.lowStock}
              icon={AlertTriangle}
              color="red"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    indigo: "bg-indigo-100 text-indigo-600",
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h2 className="text-3xl font-bold text-gray-800 mt-1">{value}</h2>
      </div>

      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl ${colors[color]}`}
      >
        <Icon size={22} />
      </div>
    </div>
  );
}
