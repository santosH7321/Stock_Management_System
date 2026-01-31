"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import {
  LayoutDashboard,
  Boxes,
  FileText,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
    } catch (err) {
      console.log("Logout API failed, continuing...");
    }

    localStorage.removeItem("token");

    document.cookie = "token=; Max-Age=0; path=/;";

    router.push("/login");
  };

  const menu = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Items", href: "/admin/items", icon: Boxes },
    { name: "Logs", href: "/admin/logs", icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50">
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r shadow-xl p-6 flex flex-col">

        <h1 className="text-2xl font-bold text-indigo-600 mb-10 tracking-tight">
          eHostel Portal
        </h1>

        <nav className="space-y-2 text-sm font-medium">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${
                    active
                      ? "bg-indigo-600 text-white shadow"
                      : "hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl
          text-red-600 hover:bg-red-50 transition font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {pathname.split("/").pop()?.toUpperCase()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md border p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
