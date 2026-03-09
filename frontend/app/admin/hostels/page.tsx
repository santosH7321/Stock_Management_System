"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Building2,
  Plus,
  RefreshCw,
  Search,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { IHostel } from "@/lib/types";

// ============================================
// TYPES
// ============================================
interface HostelForm {
  name: string;
  code: string;
  address: string;
  capacity: string;
}

const EMPTY_FORM: HostelForm = {
  name: "",
  code: "",
  address: "",
  capacity: "",
};

// ============================================
// CREATE / EDIT HOSTEL MODAL
// ============================================
function HostelModal({
  hostel,
  onClose,
  onSuccess,
}: {
  hostel?: IHostel | null; // ✅ null = create, IHostel = edit
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!hostel;

  const [form, setForm] = useState<HostelForm>(
    hostel
      ? {
          name: hostel.name,
          code: hostel.code,
          address: hostel.address || "",
          capacity: String(hostel.capacity || ""),
        }
      : EMPTY_FORM
  );
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.name || !form.code) {
      setError("Name and code are required");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        // ✅ Edit hostel
        await api.patch(`/admin/hostels/${hostel!._id}`, {
          name: form.name,
          address: form.address,
          capacity: form.capacity ? Number(form.capacity) : undefined,
        });
      } else {
        // ✅ Create hostel
        await api.post("/admin/hostels", {
          name: form.name,
          code: form.code.toUpperCase(),
          address: form.address,
          capacity: form.capacity ? Number(form.capacity) : undefined,
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save hostel");
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
            <h2 className="font-semibold text-gray-900">
              {isEdit ? "Edit Hostel" : "Create Hostel"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit
                ? `Editing ${hostel!.name}`
                : "Add a new hostel to the system"}
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
              Hostel Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Aryabhatta"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Code — disabled on edit */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Hostel Code{" "}
              {isEdit && (
                <span className="text-gray-400 font-normal">(cannot change)</span>
              )}
            </label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="e.g. ARY"
              disabled={isEdit} // ✅ Code is immutable after creation
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition uppercase disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Address{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. Block A, GECJ Campus"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Capacity{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              name="capacity"
              type="number"
              min={0}
              value={form.capacity}
              onChange={handleChange}
              placeholder="e.g. 100"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
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
              {loading
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                ? "Save Changes"
                : "Create Hostel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function AdminHostelsPage() {
  const [hostels, setHostels] = useState<IHostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [modalHostel, setModalHostel] = useState<IHostel | null | undefined>(
    undefined // undefined = modal closed, null = create, IHostel = edit
  );

  const fetchHostels = useCallback(
    async (p: number, showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const res = await api.get(`/admin/hostels?page=${p}&limit=10`);
        setHostels(res.data.data);
        setTotalPages(res.data.pages);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Failed to fetch hostels", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchHostels(page);
  }, [page, fetchHostels]);

  const handleToggle = async (hostelId: string) => {
    setTogglingId(hostelId);
    try {
      await api.patch(`/admin/hostels/${hostelId}/toggle`);
      // ✅ Update locally without refetch
      setHostels((prev) =>
        prev.map((h) =>
          h._id === hostelId ? { ...h, isActive: !h.isActive } : h
        )
      );
    } catch (err) {
      console.error("Failed to toggle hostel", err);
    } finally {
      setTogglingId(null);
    }
  };

  // Client-side search
  const filteredHostels = hostels.filter((h) =>
    search
      ? h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.code.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-5 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Hostels
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {total} hostel{total !== 1 ? "s" : ""} registered
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
                placeholder="Search hostels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white w-48"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={() => fetchHostels(page, true)}
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
              onClick={() => setModalHostel(null)} // ✅ null = open create modal
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C0E14] hover:bg-[#1a1d27] text-white text-sm font-medium transition"
            >
              <Plus size={15} />
              New Hostel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-400">Loading hostels...</p>
            </div>
          ) : filteredHostels.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                <Building2 size={20} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                No hostels found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {search
                  ? "Try a different search term"
                  : "Create your first hostel using the button above"}
              </p>
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {["Hostel", "Code", "Address", "Capacity", "Status", "Actions"].map(
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
                  {filteredHostels.map((hostel) => (
                    <tr
                      key={hostel._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Hostel name + icon */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Building2 size={14} className="text-blue-500" />
                          </div>
                          <span className="font-medium text-gray-800">
                            {hostel.name}
                          </span>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 text-xs font-mono font-medium">
                          {hostel.code}
                        </span>
                      </td>

                      {/* Address */}
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {hostel.address || (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* Capacity */}
                      <td className="px-6 py-4 text-gray-500">
                        {hostel.capacity ? (
                          `${hostel.capacity} beds`
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                            hostel.isActive
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {hostel.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* Edit button */}
                          <button
                            onClick={() => setModalHostel(hostel)} // ✅ IHostel = open edit modal
                            className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 text-xs font-medium transition flex items-center gap-1.5"
                          >
                            <Pencil size={11} />
                            Edit
                          </button>

                          {/* Toggle button */}
                          <button
                            onClick={() => handleToggle(hostel._id)}
                            disabled={togglingId === hostel._id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                              hostel.isActive
                                ? "bg-red-50 text-red-500 hover:bg-red-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                            } disabled:opacity-50`}
                          >
                            {togglingId === hostel._id && (
                              <Loader2 size={11} className="animate-spin" />
                            )}
                            {hostel.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
                  <p className="text-xs text-gray-400">
                    Page {page} of {totalPages} · {total} hostels
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

      {/* ✅ Single modal handles both create and edit */}
      {modalHostel !== undefined && (
        <HostelModal
          hostel={modalHostel}
          onClose={() => setModalHostel(undefined)}
          onSuccess={() => fetchHostels(page, true)}
        />
      )}
    </DashboardLayout>
  );
}