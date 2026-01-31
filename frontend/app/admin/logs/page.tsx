"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    api.get("/logs").then((res) => {
      setLogs(res.data.data);
    });
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold mb-4">Stock Logs</h1>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Item</th>
              <th>Hostel</th>
              <th>User</th>
              <th>Action</th>
              <th>Qty</th>
              <th>Before</th>
              <th>After</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t text-center">

                <td className="p-2">{log.itemId?.itemName}</td>
                <td>{log.hostelId?.name}</td>
                <td>{log.changedBy?.name}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      log.action === "INCREASE"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {log.action}
                  </span>
                </td>

                <td>{log.quantity}</td>
                <td>{log.beforeQty}</td>
                <td>{log.afterQty}</td>
                <td>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
