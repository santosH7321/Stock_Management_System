"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Shield,
  Plus,
  RefreshCw,
  Search,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { IUser, IHostel } from "@/lib/types";

interface CreateGuardForm {
  name: string;
  email: string;
  password: string;
  hostelId: string;
}

const EMPTY_FORM: CreateGuardForm = {
  name: "",
  email: "",
  password: "",
  hostelId: "",
};


function CreateGuardModal({
  hostels,
  onClose,
  onSuccess,
}: {
  hostels: IHostel[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<CreateGuardForm>(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.hostelId) {
      setError("All fields are required");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/guards", form);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create guard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Create Guard</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Add a new guard to a hostel
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="guard@hostel.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Min 8 characters"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Hostel */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Assign Hostel
            </label>
            <select
              name="hostelId"
              value={form.hostelId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-700"
            >
              <option value="">Select a hostel</option>
              {hostels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} ({h.code})
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#0C0E14] hover:bg-[#1a1d27] text-white text-sm font-medium transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Creating..." : "Create Guard"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function AdminGuardsPage() {
  const [guards, setGuards] = useState<IUser[]>([]);
  const [hostels, setHostels] = useState<IHostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [hostelFilter, setHostelFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchGuards = useCallback(
    async (p: number, showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: "10",
          ...(hostelFilter && { hostelId: hostelFilter }),
        });

        const res = await api.get(`/admin/guards?${params}`);
        setGuards(res.data.data);
        setTotalPages(res.data.pages);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Failed to fetch guards", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [hostelFilter]
  );

  // Fetch hostels for filter dropdown + modal
  const fetchHostels = async () => {
    try {
      const res = await api.get("/admin/hostels?limit=100");
      setHostels(res.data.data);
    } catch (err) {
      console.error("Failed to fetch hostels", err);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  useEffect(() => {
    fetchGuards(page);
  }, [page, hostelFilter, fetchGuards]);

  const handleToggle = async (guardId: string) => {
    setTogglingId(guardId);
    try {
      await api.patch(`/admin/guards/${guardId}/toggle`);
      // ✅ Update locally without refetch
      setGuards((prev) =>
        prev.map((g) =>
          g.id === guardId ? { ...g, isActive: !g.isActive } : g
        )
      );
    } catch (err) {
      console.error("Failed to toggle guard", err);
    } finally {
      setTogglingId(null);
    }
  };

  // Client-side search filter
  const filteredGuards = guards.filter((g) =>
    search
      ? g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.email.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-5 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Guards
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {total} guard{total !== 1 ? "s" : ""} registered
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
                placeholder="Search guards..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white w-48"
              />
            </div>

            {/* Hostel filter */}
            <select
              value={hostelFilter}
              onChange={(e) => {
                setHostelFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Hostels</option>
              {hostels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name}
                </option>
              ))}
            </select>

            {/* Refresh */}
            <button
              onClick={() => fetchGuards(page, true)}
              disabled={refreshing}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>

            {/* Create button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C0E14] hover:bg-[#1a1d27] text-white text-sm font-medium transition"
            >
              <Plus size={15} />
              New Guard
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-400">Loading guards...</p>
            </div>
          ) : filteredGuards.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                <Shield size={20} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                No guards found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {search
                  ? "Try a different search term"
                  : "Create your first guard using the button above"}
              </p>
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {["Guard", "Email", "Hostel", "Status", "Action"].map(
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
                  {filteredGuards.map((guard) => (
                    <tr
                      key={guard.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Guard name + avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {guard.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">
                            {guard.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-gray-500">{guard.email}</td>

                      {/* Hostel */}
                      <td className="px-6 py-4">
                        {guard.hostelId ? (
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium">
                            {typeof guard.hostelId === "object"
                              ? (guard.hostelId as any).name
                              : guard.hostelId}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Status badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                            guard.isActive
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {guard.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Toggle button */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggle(guard.id)}
                          disabled={togglingId === guard.id}
                          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                            guard.isActive
                              ? "bg-red-50 text-red-500 hover:bg-red-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          } disabled:opacity-50`}
                        >
                          {togglingId === guard.id && (
                            <Loader2 size={11} className="animate-spin" />
                          )}
                          {guard.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
                  <p className="text-xs text-gray-400">
                    Page {page} of {totalPages} · {total} guards
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

      {/* Create Guard Modal */}
      {showModal && (
        <CreateGuardModal
          hostels={hostels}
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchGuards(page, true)}
        />
      )}
    </DashboardLayout>
  );
}