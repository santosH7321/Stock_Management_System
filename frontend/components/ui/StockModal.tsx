"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { X, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { IItem } from "@/lib/types";

interface StockModalProps {
  item: IItem;           // ✅ Full item object — not just ID
  onClose: () => void;
  onSuccess: () => void;
}

export default function StockModal({ item, onClose, onSuccess }: StockModalProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [action, setAction] = useState<"INCREASE" | "DECREASE">("INCREASE");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ✅ Real-time stock preview
  const afterQty =
    action === "INCREASE"
      ? item.availableQuantity + (quantity || 0)
      : Math.max(0, item.availableQuantity - (quantity || 0));

  const isLowAfter = afterQty <= item.minThreshold;

  const handleSubmit = async () => {
    // ✅ Input validation
    if (!quantity || quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    // ✅ Client side stock check before API call
    if (action === "DECREASE" && quantity > item.availableQuantity) {
      setError(`Cannot decrease by ${quantity}. Available: ${item.availableQuantity}`);
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.patch(`/stock/${item._id}`, {
        action,
        quantity,
        remark: remark.trim(),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      // ✅ Show API error message
      setError(err.response?.data?.message || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* ✅ Backdrop click to close */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Update Stock</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {item.itemName} · {item.hostelId?.name ?? ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* ✅ Real-time stock preview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Current Stock</p>
              <p className="text-2xl font-bold text-gray-800">
                {item.availableQuantity}
              </p>
              <p className="text-xs text-gray-400">{item.unit}</p>
            </div>

            <div
              className={`rounded-xl p-3 text-center ${
                isLowAfter ? "bg-red-50" : "bg-blue-50"
              }`}
            >
              <p className="text-xs text-gray-400 mb-1">After Update</p>
              <p
                className={`text-2xl font-bold ${
                  isLowAfter ? "text-red-600" : "text-blue-600"
                }`}
              >
                {afterQty}
              </p>
              <p className="text-xs text-gray-400">{item.unit}</p>
            </div>
          </div>

          {/* ✅ Low stock warning */}
          {isLowAfter && afterQty > 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              ⚠️ Stock will be below minimum threshold ({item.minThreshold} {item.unit})
            </p>
          )}

          {/* Action Toggle */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">
              Action
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setAction("INCREASE");
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  action === "INCREASE"
                    ? "bg-green-500 text-white shadow-sm"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                <TrendingUp size={15} />
                Increase
              </button>
              <button
                onClick={() => {
                  setAction("DECREASE");
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  action === "DECREASE"
                    ? "bg-red-500 text-white shadow-sm"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                <TrendingDown size={15} />
                Decrease
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                setQuantity(Number(e.target.value));
                setError(""); // ✅ Clear error on change
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter quantity"
            />
          </div>

          {/* Remark */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">
              Remark{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              maxLength={500}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Add a note..."
            />
          </div>

          {/* ✅ Inline error */}
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
              className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Updating..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}