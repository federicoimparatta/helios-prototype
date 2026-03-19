"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sun, Shield, Eye, UserCog, Wrench, Bot, ChevronRight } from "lucide-react";
import { users, roleLabels } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

const roleIcons: Record<string, typeof Shield> = {
  super_admin: Shield,
  org_admin: Shield,
  dc_admin: UserCog,
  shift_lead: UserCog,
  operator: UserCog,
  viewer: Eye,
  vendor_service: Wrench,
};

const roleBorderColors: Record<string, string> = {
  super_admin: "border-purple-300 hover:border-purple-400",
  org_admin: "border-blue-300 hover:border-blue-400",
  dc_admin: "border-teal/40 hover:border-teal",
  shift_lead: "border-amber-300 hover:border-amber-400",
  operator: "border-emerald-300 hover:border-emerald-400",
  viewer: "border-slate-300 hover:border-slate-400",
  vendor_service: "border-orange-300 hover:border-orange-400",
};

const roleBadgeColors: Record<string, string> = {
  super_admin: "bg-purple-500/20 text-purple-200 border-purple-500/30",
  org_admin: "bg-blue-500/20 text-blue-200 border-blue-500/30",
  dc_admin: "bg-teal/20 text-teal-light border-teal/30",
  shift_lead: "bg-amber-500/20 text-amber-200 border-amber-500/30",
  operator: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
  viewer: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  vendor_service: "bg-orange-500/20 text-orange-200 border-orange-500/30",
};

const ucTags: Record<string, { label: string; color: string }[]> = {
  u1: [{ label: "UC1: Full RBAC", color: "text-purple-300" }],
  u2: [
    { label: "UC1: Approval Auth", color: "text-amber-300" },
    { label: "UC4: Agent Interact", color: "text-blue-300" },
  ],
  u3: [{ label: "UC1: Site Admin", color: "text-teal-light" }],
  u4: [{ label: "UC1: Region Scope", color: "text-emerald-300" }],
  u6: [{ label: "UC1: Read-Only", color: "text-slate-300" }],
  u7: [
    { label: "UC3: Vendor Access", color: "text-orange-300" },
    { label: "UC3: Device Scope", color: "text-orange-300" },
  ],
  u8: [
    { label: "UC3: Vendor Access", color: "text-orange-300" },
    { label: "UC3: Device Scope", color: "text-orange-300" },
  ],
};

export default function LoginPage() {
  const router = useRouter();
  const { switchUser } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectUser = (userId: string) => {
    setLoading(userId);
    switchUser(userId);
    setTimeout(() => {
      router.push("/dc");
    }, 600);
  };

  // Group: featured personas then rest
  const featured = ["u2", "u7", "u6"]; // Sarah Kim (shift lead), TechCool (vendor), Tom (viewer)
  const sortedUsers = [
    ...users.filter((u) => u.id === "u1"), // admin first
    ...users.filter((u) => featured.includes(u.id)),
    ...users.filter((u) => u.id !== "u1" && !featured.includes(u.id)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-dark to-[#000d3a] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
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
          <p className="text-white/40 text-sm mt-3">
            Data Center Energy Management Platform
          </p>
        </div>

        {/* Persona Picker */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-white text-lg font-semibold mb-1">
            Select a Persona
          </h2>
          <p className="text-white/40 text-sm mb-5">
            Choose a role to explore RBAC, vendor access, and agent authorization use cases
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sortedUsers.map((user) => {
              const Icon = roleIcons[user.role] || Shield;
              const isLoading = loading === user.id;
              const tags = ucTags[user.id] || [];

              return (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user.id)}
                  disabled={loading !== null}
                  className={`relative text-left p-4 rounded-xl border bg-white/[0.04] transition-all duration-200 group ${
                    roleBorderColors[user.role] || "border-white/10"
                  } ${isLoading ? "opacity-60" : "hover:bg-white/[0.08]"} disabled:cursor-not-allowed`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/15 transition-colors">
                      {user.role === "vendor_service" ? (
                        <Wrench className="w-4 h-4 text-orange-300" />
                      ) : (
                        <Icon className="w-4 h-4 text-white/60" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-semibold truncate">
                          {user.name}
                        </p>
                        {isLoading && (
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border mt-1 ${
                          roleBadgeColors[user.role] || "bg-white/10 text-white/60"
                        }`}
                      >
                        {roleLabels[user.role]}
                      </span>
                      <p className="text-white/30 text-[11px] mt-1.5 leading-relaxed">
                        {user.description}
                      </p>
                      {/* UC tags */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {tags.map((tag) => (
                            <span
                              key={tag.label}
                              className={`text-[9px] font-medium ${tag.color}`}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors shrink-0 mt-1" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Use Case Legend */}
          <div className="mt-5 pt-4 border-t border-white/5">
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-white/30">
              <span><strong className="text-white/50">UC1</strong> RBAC by Org Hierarchy</span>
              <span><strong className="text-white/50">UC2</strong> Custom Org Hierarchy</span>
              <span><strong className="text-white/50">UC3</strong> Device-Level Access Control</span>
              <span><strong className="text-white/50">UC4</strong> Agent Authorization</span>
              <span><strong className="text-white/50">UC5</strong> Ontology-Driven Hierarchy</span>
            </div>
          </div>
        </div>

        <p className="text-white/20 text-xs text-center mt-6">
          &copy; 2026 QCELLS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
