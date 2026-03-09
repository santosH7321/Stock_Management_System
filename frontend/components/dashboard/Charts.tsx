"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from "recharts";
import { IItem } from "@/lib/types";
import { Package } from "lucide-react";

interface ChartsProps {
  items: IItem[];  // ✅ Properly typed
}

// ✅ Custom styled tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0C0E14] text-white px-3 py-2.5 rounded-xl text-xs shadow-xl border border-white/10">
        <p className="font-semibold mb-1 text-gray-300">{label}</p>
        <p className="text-blue-400">
          Available:{" "}
          <span className="text-white font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Charts({ items }: ChartsProps) {
  // ✅ Max 10 items, truncate long names, flag low stock
  const data = items.slice(0, 10).map((i) => ({
    name:
      i.itemName.length > 10
        ? i.itemName.slice(0, 10) + "…"
        : i.itemName,
    fullName: i.itemName,  // ✅ Full name for tooltip
    qty: i.availableQuantity,
    low: i.availableQuantity <= i.minThreshold,
  }));

  // ✅ Empty state
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 h-72 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
          <Package size={20} className="text-gray-300" />
        </div>
        <p className="text-sm text-gray-400">No items to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">
            Stock Overview
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Available quantity per item — top {data.length}
          </p>
        </div>

        {/* ✅ Color legend */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
            Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" />
            Low Stock
          </span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          barSize={28}
          barCategoryGap="30%"
          margin={{ top: 0, right: 0, bottom: 0, left: -10 }}
        >
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            width={30}
          />
          {/* ✅ Custom tooltip */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "#F9FAFB" }}
          />
          <Bar dataKey="qty" radius={[6, 6, 0, 0]}>
            {/* ✅ Red for low stock, blue for normal */}
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.low ? "#F87171" : "#3B82F6"}
                opacity={0.9}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}