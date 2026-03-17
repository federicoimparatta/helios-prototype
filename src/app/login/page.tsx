"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sun, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dc");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-dark to-[#000d3a] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal to-blue rounded-xl flex items-center justify-center shadow-lg shadow-teal/20">
              <Sun className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white/50 text-xs font-medium tracking-[0.3em] uppercase">
                QCELLS
              </p>
              <h1 className="text-white text-3xl font-bold tracking-tight">
                HELIOS
              </h1>
            </div>
          </div>
          <p className="text-white/40 text-sm mt-4">
            Data Center Energy Management Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-lg font-semibold mb-1">
            Welcome back
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@us.q-cells.com"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-teal/50 focus:ring-2 focus:ring-teal/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-teal/50 focus:ring-2 focus:ring-teal/20 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-teal focus:ring-teal/30"
                />
                <span className="text-white/40 text-xs">Remember me</span>
              </label>
              <button
                type="button"
                className="text-teal/70 hover:text-teal text-xs transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal to-teal-dark text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-teal/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-white/30 text-xs">
              Protected by QCELLS enterprise SSO
            </p>
          </div>
        </div>

        <p className="text-white/20 text-xs text-center mt-8">
          &copy; 2026 QCELLS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
