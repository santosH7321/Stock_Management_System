"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const res = await api.post("/auth/login", { email, password });

    const role = res.data.user.role;

    router.replace(role === "ADMIN" ? "/admin" : "/guard");

  } catch (err) {
    alert("Invalid credentials");
  }
};




  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 via-white to-blue-100 px-4">
        <div className="w-full max-w-md">
            <div className="backdrop-blur-xl bg-white/80 shadow-2xl rounded-3xl p-8 space-y-6 border border-white/40">

            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-800">Welcome to GECJ 👋</h1>
                <p className="text-gray-500 text-sm">Login to continue your journey</p>
            </div>

            <input
                type="email"
                required
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
                className="
                w-full px-4 py-3 rounded-xl
                border border-gray-200
                bg-white text-gray-600
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                transition-all duration-200
                "
            />

            <input
                type="password"
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="
                w-full px-4 py-3 rounded-xl
                border border-gray-200
                bg-white text-gray-600
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                transition-all duration-200
                "   
            />

            <button
                onClick={handleLogin}
                className="
                w-full py-3 rounded-xl
                bg-indigo-600 hover:bg-indigo-700
                text-white font-semibold
                shadow-lg hover:shadow-xl
                transition-all duration-200 active:scale-95
                "
            >
                Login
            </button>

            </div>
        </div>
    </div>

  );
}
