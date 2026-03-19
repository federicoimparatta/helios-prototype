"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GitBranch,
  ChevronRight,
  ChevronDown,
  Building2,
  Globe,
  MapPin,
  Plus,
  Pencil,
  Settings,
  Check,
  Users,
  Shield,
  Bot,
  Wrench,
} from "lucide-react";
import { orgHierarchy, exampleHierarchies, dataCenters, users, roleLabels } from "@/lib/mock-data";

const levelIcons: Record<string, typeof Globe> = {
  Portfolio: Globe,
  Region: MapPin,
  Site: Building2,
};

const levelColors: Record<string, { bg: string; text: string; border: string }> = {
  Portfolio: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Region: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Site: { bg: "bg-teal/10", text: "text-teal-dark", border: "border-teal/30" },
};

function getChildren(parentId: string | null) {
  return orgHierarchy.nodes.filter((n) => n.parent === parentId);
}

function getUsersAtNode(nodeId: string) {
  return users.filter((u) => u.scopeNode === nodeId);
}

function HierarchyNode({ nodeId, depth }: { nodeId: string; depth: number }) {
  const [expanded, setExpanded] = useState(true);
  const node = orgHierarchy.nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const children = getChildren(nodeId);
  const nodeUsers = getUsersAtNode(nodeId);
  const dc = node.dcId ? dataCenters.find((d) => d.id === node.dcId) : null;
  const Icon = levelIcons[node.level] || Building2;
  const colors = levelColors[node.level] || levelColors.Site;

  return (
    <div className={depth > 0 ? "ml-8" : ""}>
      <div
        className={`group flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm cursor-pointer ${colors.border} ${colors.bg}`}
        onClick={() => setExpanded(!expanded)}
      >
        {children.length > 0 ? (
          expanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )
        ) : (
          <div className="w-4" />
        )}

        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg}`}>
          <Icon className={`w-4 h-4 ${colors.text}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${colors.text}`}>{node.label}</span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}>
              {node.level}
            </span>
          </div>
          {dc && (
            <p className="text-[11px] text-slate-500 mt-0.5">
              {dc.status === "operational" ? "Operational" : "Warning"} — {dc.metrics.power.toLocaleString()} kW — PUE {dc.metrics.pue.toFixed(2)}
            </p>
          )}
        </div>

        {/* Users scoped to this node */}
        {nodeUsers.length > 0 && (
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex -space-x-1.5">
              {nodeUsers.slice(0, 3).map((u) => {
                const isVendor = u.role === "vendor_service";
                return (
                  <div
                    key={u.id}
                    title={`${u.name} (${roleLabels[u.role]})`}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-white ${
                      isVendor
                        ? "bg-orange-100 text-orange-700"
                        : "bg-navy/10 text-navy"
                    }`}
                  >
                    {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                );
              })}
            </div>
            {nodeUsers.length > 3 && (
              <span className="text-[10px] text-slate-400">+{nodeUsers.length - 3}</span>
            )}
          </div>
        )}

        <button className="p-1.5 rounded-lg text-slate-300 hover:text-navy hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Children */}
      {expanded && children.length > 0 && (
        <div className="mt-2 space-y-2 relative">
          {/* Vertical connector line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
          {children.map((child) => (
            <HierarchyNode key={child.id} nodeId={child.id} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HierarchyPage() {
  const [selectedExample, setSelectedExample] = useState<number | null>(null);

  const rootNodes = getChildren(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 py-5">
          <div className="flex items-center gap-2 text-sm mb-3">
            <Link href="/admin" className="text-slate-400 hover:text-navy transition-colors">
              Admin
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-medium">Org Hierarchy</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-navy" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Organization Hierarchy</h1>
                <p className="text-sm text-slate-500">
                  Define how sites are organized — permissions scope to this structure
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                <Settings className="w-4 h-4" />
                Edit Levels
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors text-sm font-medium shadow-sm">
                <Plus className="w-4 h-4" />
                Add Node
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
        {/* UC2 Info Card */}
        <div className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <GitBranch className="w-6 h-6 text-teal-light" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">UC2: Custom Org Hierarchy per Customer</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Each customer defines their own organizational structure. The hierarchy isn&apos;t hardcoded to geographic
                regions — customers can slice it however they want. Permission scoping from UC1 rides on top of
                whatever hierarchy the customer defines.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                  {orgHierarchy.levels.length} levels defined
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue" />
                  {orgHierarchy.nodes.length} nodes
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hierarchy Tree — 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Hierarchy */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-navy" />
                    {orgHierarchy.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Levels: {orgHierarchy.levels.join(" > ")}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {orgHierarchy.levels.map((level) => {
                    const colors = levelColors[level] || levelColors.Site;
                    return (
                      <span
                        key={level}
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${colors.bg} ${colors.text} ${colors.border}`}
                      >
                        {level}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                {rootNodes.map((node) => (
                  <HierarchyNode key={node.id} nodeId={node.id} depth={0} />
                ))}
              </div>
            </div>

            {/* Permission Scoping Explanation */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-navy" />
                How Permission Scoping Works
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-slate-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-slate-800">Portfolio Scope</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    User sees all regions and all sites. Typically Super Admin.
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-navy/10 text-navy text-[8px] font-bold flex items-center justify-center">FI</div>
                    <span className="text-[10px] text-slate-400">Federico Imparatta</span>
                  </div>
                </div>
                <div className="border border-slate-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-800">Region Scope</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    User sees all sites within a region. Can&apos;t see sites outside it.
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-navy/10 text-navy text-[8px] font-bold flex items-center justify-center">JL</div>
                    <span className="text-[10px] text-slate-400">James Lee (US-East)</span>
                  </div>
                </div>
                <div className="border border-slate-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-teal" />
                    <span className="text-sm font-semibold text-slate-800">Site Scope</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    User sees only their assigned site(s). Nothing outside that scope.
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-navy/10 text-navy text-[8px] font-bold flex items-center justify-center">SK</div>
                    <span className="text-[10px] text-slate-400">Sarah Kim (DC-West-01)</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 border border-orange-100 rounded-lg p-4 bg-orange-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <Wrench className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-semibold text-slate-800">Device Scope (Vendor)</span>
                </div>
                <p className="text-xs text-slate-500">
                  Vendors see only their assigned devices within a site. No export, no download, no agent interaction.
                  Separate from standard read/write — a service-only permission level.
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[8px] font-bold flex items-center justify-center">TC</div>
                    <span className="text-[10px] text-slate-400">TechCool (Chillers)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[8px] font-bold flex items-center justify-center">PG</div>
                    <span className="text-[10px] text-slate-400">PowerGrid (UPS/BESS)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel — Example Hierarchies */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue" />
                Example Hierarchies
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Different customers use different structures
              </p>

              <div className="space-y-3">
                {exampleHierarchies.map((ex, idx) => (
                  <button
                    key={ex.customer}
                    onClick={() => setSelectedExample(selectedExample === idx ? null : idx)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                      selectedExample === idx
                        ? "border-navy/30 bg-navy/5 shadow-sm"
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-800">{ex.customer}</span>
                      {selectedExample === idx && (
                        <Check className="w-4 h-4 text-navy" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mb-1.5">{ex.description}</p>
                    <div className="flex items-center gap-1">
                      {ex.levels.map((level, i) => (
                        <span key={level} className="flex items-center gap-1">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-semibold text-slate-600 uppercase tracking-wider">
                            {level}
                          </span>
                          {i < ex.levels.length - 1 && (
                            <ChevronRight className="w-3 h-3 text-slate-300" />
                          )}
                        </span>
                      ))}
                    </div>
                    {selectedExample === idx && (
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <p className="text-[10px] font-mono text-slate-400">
                          {ex.example}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Agent Authorization Note */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <Bot className="w-4 h-4 text-teal" />
                UC4: Agent Permissions
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Agent authorization is separate from human user permissions
              </p>
              <div className="space-y-2">
                {[
                  { label: "Agent Interact", desc: "Can trigger and approve agent actions", icon: Bot, assigned: users.filter((u) => u.agentPermissions.length > 0).length },
                  { label: "No Agent Access", desc: "Read/write but no agent interaction", icon: Users, assigned: users.filter((u) => u.agentPermissions.length === 0).length },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{item.assigned}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
