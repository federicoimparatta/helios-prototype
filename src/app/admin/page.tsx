"use client";

import Link from "next/link";
import {
  Building2,
  Users,
  Bot,
  ClipboardCheck,
  Activity,
  AlertTriangle,
  Thermometer,
  Zap,
  ChevronRight,
  Plus,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { dataCenters, agents, users, auditLogs } from "@/lib/mock-data";

const stats = [
  { label: "Total Sites", value: dataCenters.length, icon: Building2, color: "bg-navy", textColor: "text-navy" },
  { label: "Total Users", value: users.length, icon: Users, color: "bg-blue", textColor: "text-blue" },
  { label: "Active Agents", value: agents.filter((a) => a.status === "active").length, icon: Bot, color: "bg-teal", textColor: "text-teal" },
  { label: "Pending Reviews", value: 2, icon: ClipboardCheck, color: "bg-amber-500", textColor: "text-amber-600" },
];

const statusRowColors: Record<string, string> = {
  operational: "bg-emerald-50/50",
  warning: "bg-amber-50/50",
  critical: "bg-red-50/50",
  offline: "bg-slate-50/50",
};

const statusBadge: Record<string, string> = {
  operational: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  critical: "bg-red-100 text-red-700",
  offline: "bg-slate-100 text-slate-600",
};

const statusDot: Record<string, string> = {
  operational: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
  offline: "bg-slate-400",
};

const agentStatusBadge: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  idle: "bg-slate-100 text-slate-600",
  error: "bg-red-100 text-red-700",
};

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function severityColor(severity: string) {
  if (severity === "warning") return "text-amber-600";
  if (severity === "error") return "text-red-600";
  return "text-slate-500";
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Platform overview and management</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/onboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors text-sm font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Onboard New Site
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* DC Performance Matrix — spans 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-navy" />
                <h2 className="font-semibold text-slate-900">DC Performance Matrix</h2>
              </div>
              <span className="text-xs text-slate-400">Live</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left font-medium text-slate-500 px-5 py-3">Site</th>
                    <th className="text-left font-medium text-slate-500 px-4 py-3">Status</th>
                    <th className="text-right font-medium text-slate-500 px-4 py-3">Power (kW)</th>
                    <th className="text-right font-medium text-slate-500 px-4 py-3">PUE</th>
                    <th className="text-right font-medium text-slate-500 px-4 py-3">Temp ({"\u00B0"}F)</th>
                    <th className="text-center font-medium text-slate-500 px-4 py-3">Alerts</th>
                  </tr>
                </thead>
                <tbody>
                  {dataCenters.map((dc) => (
                    <tr
                      key={dc.id}
                      className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${statusRowColors[dc.status]}`}
                    >
                      <td className="px-5 py-3.5">
                        <Link href={`/dc/${dc.id}`} className="text-navy font-medium hover:underline">
                          {dc.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[dc.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[dc.status]}`} />
                          {dc.status}
                        </span>
                      </td>
                      <td className="text-right px-4 py-3.5 font-mono text-slate-700">
                        {dc.metrics.power.toLocaleString()}
                      </td>
                      <td className="text-right px-4 py-3.5 font-mono">
                        <span className={dc.metrics.pue > 1.5 ? "text-amber-600 font-semibold" : "text-slate-700"}>
                          {dc.metrics.pue.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-right px-4 py-3.5 font-mono">
                        <span className={dc.metrics.temperature > 75 ? "text-amber-600 font-semibold" : "text-slate-700"}>
                          {dc.metrics.temperature.toFixed(1)}
                        </span>
                      </td>
                      <td className="text-center px-4 py-3.5">
                        {dc.reviewNeeded ? (
                          <span className="inline-flex items-center gap-1 text-amber-600">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">1</span>
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">--</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agent Health Panel */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Bot className="w-4.5 h-4.5 text-teal" />
              <h2 className="font-semibold text-slate-900">Agent Health</h2>
            </div>
            <div className="p-4 space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="border border-slate-100 rounded-lg p-4 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-slate-800">{agent.name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${agentStatusBadge[agent.status]}`}>
                      {agent.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Uptime</span>
                    <span className="text-sm font-bold text-slate-900">
                      {(agent.metrics.uptime * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-teal h-1.5 rounded-full transition-all"
                      style={{ width: `${agent.metrics.uptime * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {agent.metrics.tasksCompleted.toLocaleString()} tasks completed · {agent.lastActivity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-blue" />
                <h2 className="font-semibold text-slate-900">Recent Users</h2>
              </div>
              <Link
                href="/admin/users"
                className="text-xs text-navy hover:text-navy-light font-medium flex items-center gap-1 transition-colors"
              >
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left font-medium text-slate-500 px-5 py-2.5">Name</th>
                    <th className="text-left font-medium text-slate-500 px-4 py-2.5">Role</th>
                    <th className="text-left font-medium text-slate-500 px-4 py-2.5">Sites</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 4).map((u) => (
                    <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-2.5">
                        <div>
                          <p className="font-medium text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-500">{u.sites.length} site{u.sites.length !== 1 && "s"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Audit Logs */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-slate-500" />
                <h2 className="font-semibold text-slate-900">Recent Audit Logs</h2>
              </div>
              <Link
                href="/dc/dc-site-001/audit"
                className="text-xs text-navy hover:text-navy-light font-medium flex items-center gap-1 transition-colors"
              >
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="px-5 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${log.severity === "warning" ? "bg-amber-400" : "bg-slate-300"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 truncate">
                      <span className="font-medium">{log.user}</span>{" "}
                      <span className={severityColor(log.severity)}>{log.action.replace(/[._]/g, " ")}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{log.target} · {formatTimestamp(log.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Manage Users", href: "/admin/users", icon: Users, desc: "Users, roles, permissions, vendor access" },
            { label: "Org Hierarchy", href: "/admin/hierarchy", icon: Building2, desc: "Define org structure and permission scoping" },
            { label: "Onboard New Site", href: "/admin/onboard", icon: Building2, desc: "6-step wizard with ontology & RBAC setup" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-navy/30 hover:shadow-md transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center group-hover:bg-navy/10 transition-colors">
                  <Icon className="w-5 h-5 text-navy" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-slate-800 text-sm">{action.label}</h3>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-navy transition-colors" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    super_admin: "bg-purple-100 text-purple-700",
    org_admin: "bg-blue-100 text-blue-700",
    dc_admin: "bg-teal/10 text-teal-dark",
    shift_lead: "bg-amber-100 text-amber-700",
    operator: "bg-emerald-100 text-emerald-700",
    viewer: "bg-slate-100 text-slate-600",
    vendor_service: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${colors[role] || "bg-slate-100 text-slate-600"}`}>
      {role.replace(/_/g, " ")}
    </span>
  );
}
