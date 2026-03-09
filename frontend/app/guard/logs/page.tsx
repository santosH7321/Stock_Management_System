"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TrendingUp, TrendingDown, FileText, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { IStockLog } from "@/lib/types";

export default function GuardLogsPage() {
  const [logs, setLogs] = useState<IStockLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLogs = useCallback(async (p: number, showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await api.get(`/logs?page=${p}&limit=15`);
      setLogs(res.data.data);
      setTotalPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(page);
  }, [page, fetchLogs]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <DashboardLayout role="GUARD">
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Stock Logs</h1>
            <p className="text-sm text-gray-400 mt-0.5">{total} total entries</p>
          </div>
          <button
            onClick={() => fetchLogs(page, true)}
            disabled={refreshing}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-400">Loading logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                <FileText size={20} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">No logs found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-50">
                      {["Item", "Action", "Qty", "Before", "After", "Remark", "Date"].map((h) => (
                        <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4 font-medium text-gray-800 whitespace-nowrap">
                          {log.itemId?.itemName ?? "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                            log.action === "INCREASE" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                          }`}>
                            {log.action === "INCREASE" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                            {log.action === "INCREASE" ? "Increase" : "Decrease"}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-800">{log.quantity}</td>
                        <td className="px-5 py-4 text-gray-500">{log.beforeQty}</td>
                        <td className="px-5 py-4 text-gray-500">{log.afterQty}</td>
                        <td className="px-5 py-4 text-gray-400 text-xs max-w-32 truncate">
                          {log.remark || "—"}
                        </td>
                        <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                          {formatDate(log.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
                  <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
    </DashboardLayout>
  );
}
