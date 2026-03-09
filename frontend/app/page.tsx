"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  Package,
  BarChart3,
  Shield,
  Building2,
  ArrowRight,
  Layers,
  Bell,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Real-Time Inventory",
    desc: "Track stock levels across all hostels instantly. Know exactly what's available at any moment.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Visual insights into consumption patterns, low-stock alerts, and restocking trends.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    desc: "Admins manage everything. Guards update stock for their assigned hostel only.",
  },
  {
    icon: Bell,
    title: "Low Stock Alerts",
    desc: "Automatic alerts when items fall below minimum thresholds — before it becomes a problem.",
  },
  {
    icon: Layers,
    title: "Full Audit Logs",
    desc: "Every stock change is logged with who did it, when, and why. Complete traceability.",
  },
  {
    icon: Users,
    title: "Multi-Hostel Support",
    desc: "Manage multiple hostels from a single admin account with unified reporting.",
  },
];

const stats = [
  { value: "100%", label: "Audit Coverage" },
  { value: "< 1s", label: "Update Speed" },
  { value: "Multi", label: "Hostel Support" },
  { value: "24/7", label: "Availability" },
];

export default function HomePage() {
  const gridRef = useRef<HTMLCanvasElement>(null);

  // Animated dot grid background
  useEffect(() => {
    const canvas = gridRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const spacing = 40;
      const cols = Math.ceil(canvas.width / spacing);
      const rows = Math.ceil(canvas.height / spacing);

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          const wave = Math.sin(i * 0.3 + t) * Math.cos(j * 0.3 + t) * 0.5 + 0.5;
          const alpha = wave * 0.25 + 0.04;
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99,130,255,${alpha})`;
          ctx.fill();
        }
      }
      t += 0.008;
      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.05); }
        }
        .anim-1 { animation: fadeUp 0.7s ease forwards; }
        .anim-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .anim-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .anim-4 { animation: fadeUp 0.7s 0.45s ease both; }
        .glow-blob { animation: glow 6s ease-in-out infinite; }

        .feature-card:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(99,130,255,0.2);
          transform: translateY(-2px);
        }
        .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 0 40px rgba(99,130,255,0.4); }
        .cta-btn:active { transform: translateY(0); }
      `}</style>

      <div
        className="font-dm min-h-screen bg-[#0C0E14] text-white overflow-x-hidden"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Animated dot grid */}
        <canvas
          ref={gridRef}
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        />

        {/* Glow blobs */}
        <div
          className="glow-blob fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(99,130,255,0.08) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />
        <div
          className="glow-blob fixed bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(99,130,255,0.06) 0%, transparent 70%)",
            zIndex: 0,
            animationDelay: "3s",
          }}
        />

        {/* Content */}
        <div className="relative" style={{ zIndex: 1 }}>

          {/* Navbar */}
          <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Building2 size={15} className="text-blue-400" />
              </div>
              <span
                className="font-syne font-700 text-white text-sm tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
              >
                eHostel
              </span>
            </div>

            <Link
              href="/login"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              Sign in
              <ArrowRight size={14} />
            </Link>
          </nav>

          {/* Hero */}
          <section className="text-center px-6 pt-20 pb-24 max-w-4xl mx-auto">

            {/* Badge */}
            <div className="anim-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs text-blue-400 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Hostel Stock Management Platform
            </div>

            {/* Headline */}
            <h1
              className="anim-2 font-syne text-5xl md:text-7xl font-800 leading-none tracking-tight mb-6"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
            >
              <span className="text-white">Stock control,</span>
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #6382FF 0%, #A78BFA 50%, #60A5FA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                finally simple.
              </span>
            </h1>

            {/* Subheading */}
            <p className="anim-3 text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              A unified platform for hostel admins and guards to track inventory,
              log stock changes, and stay ahead of shortages — in real time.
            </p>

            {/* CTA */}
            <div className="anim-4 flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="cta-btn inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-medium text-white transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #3B5BDB 0%, #6382FF 100%)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Get Started
                <ArrowRight size={15} />
              </Link>

              <span className="text-xs text-gray-600">
                GECJ · Internal System
              </span>
            </div>
          </section>

          {/* Stats strip */}
          <section className="max-w-4xl mx-auto px-6 mb-24">
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="bg-[#0C0E14] px-6 py-7 text-center"
                >
                  <p
                    className="font-syne text-3xl font-700 text-white mb-1"
                    style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
                  >
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="max-w-6xl mx-auto px-6 pb-24">
            <div className="text-center mb-14">
              <p
                className="font-syne text-xs uppercase tracking-widest text-blue-400 mb-3"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Everything you need
              </p>
              <h2
                className="font-syne text-3xl md:text-4xl font-700 text-white"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
              >
                Built for hostel operations
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="feature-card p-6 rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-200 cursor-default"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center mb-4">
                      <Icon size={16} className="text-blue-400" />
                    </div>
                    <h3
                      className="font-syne font-600 text-white text-sm mb-2"
                      style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600 }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Bottom CTA banner */}
          <section className="max-w-4xl mx-auto px-6 pb-24">
            <div
              className="rounded-3xl p-12 text-center relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,91,219,0.15) 0%, rgba(99,130,255,0.08) 100%)",
                border: "1px solid rgba(99,130,255,0.15)",
              }}
            >
              {/* Inner glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(99,130,255,0.12) 0%, transparent 60%)",
                }}
              />

              <div className="relative">
                <h2
                  className="font-syne text-3xl md:text-4xl font-700 text-white mb-3"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
                >
                  Ready to manage your stock?
                </h2>
                <p className="text-gray-400 text-sm mb-8">
                  Sign in with your admin or guard credentials to get started.
                </p>
                <Link
                  href="/login"
                  className="cta-btn inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-medium text-white transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, #3B5BDB 0%, #6382FF 100%)",
                  }}
                >
                  Sign in to Dashboard
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/5 px-8 py-6 max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 size={14} className="text-blue-400" />
              <span className="text-xs text-gray-600 font-syne" style={{ fontFamily: "'Syne', sans-serif" }}>
                eHostel
              </span>
            </div>
            <p className="text-xs text-gray-700">
              GECJ Hostel Management System · Internal Use Only
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}