"use client";

import "./globals.css";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sun,
  Building2,
  Shield,
  Search,
  MessageSquare,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import ChatPanel from "@/components/ChatPanel";

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [chatOpen, setChatOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Don't render shell on login page
  const isLoginPage = pathname === "/login";
  if (isLoginPage) {
    return <>{children}</>;
  }

  const navLinks = [
    { href: "/dc", label: "Sites", icon: Building2 },
    { href: "/admin/users", label: "Admin", icon: Shield },
    { href: "/search", label: "Search", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-navy h-14 flex items-center justify-between px-6 shadow-lg shadow-navy/20">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/dc" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-teal to-blue rounded-lg flex items-center justify-center shadow-md shadow-teal/20">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-white/40 text-[10px] font-medium tracking-[0.2em] uppercase">
                QCELLS
              </span>
              <span className="text-white font-bold text-lg tracking-tight">
                HELIOS
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: User Avatar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center text-white text-xs font-bold shadow-md">
                FI
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white/40 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-900">
                      Federico Imparatta
                    </p>
                    <p className="text-xs text-gray-400">
                      federico.imparatta@us.q-cells.com
                    </p>
                  </div>
                  <button className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link
                      href="/login"
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14">
        <div className="p-6 max-w-[1400px] mx-auto">{children}</div>
      </main>

      {/* Floating Chat Button */}
      <button
        onClick={() => setChatOpen(true)}
        className={`fixed bottom-6 right-6 z-30 w-14 h-14 bg-gradient-to-br from-teal to-teal-dark text-white rounded-2xl shadow-lg shadow-teal/30 hover:shadow-xl hover:shadow-teal/40 hover:scale-105 transition-all flex items-center justify-center ${chatOpen ? "hidden" : ""}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
