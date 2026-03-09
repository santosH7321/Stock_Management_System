"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/axios";
import {
  LayoutDashboard,
  Boxes,
  FileText,
  LogOut,
  Building2,
  Menu,
  X,
  Loader2,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role?: "ADMIN" | "GUARD";
  userName?: string;
}

const adminMenu: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Items", href: "/admin/items", icon: Boxes },
  { name: "Logs", href: "/admin/logs", icon: FileText },
];

const guardMenu: NavItem[] = [
  { name: "Dashboard", href: "/guard", icon: LayoutDashboard },
  { name: "Items", href: "/guard/items", icon: Boxes },
  { name: "Logs", href: "/guard/logs", icon: FileText },
];

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/items": "Items Inventory",
  "/admin/logs": "Stock Logs",
  "/guard": "Dashboard",
  "/guard/items": "Items",
  "/guard/logs": "Stock Logs",
};

export default function DashboardLayout({
  children,
  role = "ADMIN",
  userName = "User",
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const menu = role === "ADMIN" ? adminMenu : guardMenu;
  const pageTitle = pageTitles[pathname] || "Dashboard";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } catch {
    } finally {
      router.push("/login");
    }
  };

  const isActive = (href: string) => {
    if (href === "/admin" || href === "/guard") return pathname === href;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0C0E14] text-white w-64 py-6 px-4">

      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
          <Building2 size={16} className="text-white" />
        </div>
        <div>
          <p className="font-semibold text-sm tracking-tight">eHostel</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">
            {role === "ADMIN" ? "Admin Portal" : "Guard Portal"}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest px-3 mb-3 font-medium">
          Navigation
        </p>
        {menu.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                active
                  ? "bg-blue-500/10 text-blue-400 font-medium"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} className={active ? "text-blue-400" : ""} />
              {item.name}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-white/5 pt-4 mt-4">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-[10px] text-slate-500">{role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-150 disabled:opacity-60"
        >
          {loggingOut
            ? <Loader2 size={16} className="animate-spin" />
            : <LogOut size={16} />
          }
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F7F8FA] overflow-hidden">

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64">
            <SidebarContent />
          </div>
          <button
            className="absolute top-4 left-[268px] text-white z-10"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* ✅ Mobile hamburger */}
            <button
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-gray-800">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:block">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}