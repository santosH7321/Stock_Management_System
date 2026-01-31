"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Charts({ items }: any) {
  const data = items.map((i: any) => ({
    name: i.itemName,
    qty: i.availableQuantity
  }));

  return (
    <div className="bg-white p-6 rounded shadow h-80">
      <h2 className="font-bold mb-4">Stock Overview</h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="qty" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
