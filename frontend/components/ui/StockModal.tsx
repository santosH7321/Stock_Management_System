"use client";

import { useState } from "react";
import api from "@/lib/axios";

export default function StockModal({
  itemId,
  onClose,
  onSuccess
}: any) {
  const [quantity, setQuantity] = useState(1);
  const [action, setAction] = useState("INCREASE");
  const [remark, setRemark] = useState("");

  const updateStock = async () => {
    await api.patch(`/stock/${itemId}`, {
      action,
      quantity,
      remark
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-lg p-6 w-80 space-y-4">
        <h2 className="font-bold">Update Stock</h2>

        <select
          className="border p-2 w-full"
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="INCREASE">Increase</option>
          <option value="DECREASE">Decrease</option>
        </select>

        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Quantity"
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <input
          className="border p-2 w-full"
          placeholder="Remark"
          onChange={(e) => setRemark(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={updateStock}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Save
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
