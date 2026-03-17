"use client";

import { useState } from "react";
import { auditLogs } from "@/lib/mock-data";
import {
  Filter,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  Info,
  Zap,
  FileText,
  Bot,
  Battery,
  Lightbulb,
  Target,
} from "lucide-react";

type Severity = "all" | "info" | "warning";

const actionIcons: Record<string, typeof Zap> = {
  "optimization.approved": CheckCircle2,
  "optimization.generated": Lightbulb,
  "sop.version_created": FileText,
  "sop.executed": FileText,
  "agent.alert": Bot,
  "bess.discharge_started": Battery,
  "bess.charge_started": Battery,
  "recommendation.denied": AlertTriangle,
};

const actionColors: Record<string, { bg: string; text: string; border: string }> = {
  "optimization.approved": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  "optimization.generated": {
    bg: "bg-blue/10",
    text: "text-blue",
    border: "border-blue/20",
  },
  "sop.version_created": {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  "sop.executed": {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  "agent.alert": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  "bess.discharge_started": {
    bg: "bg-teal-50",
    text: "text-teal-dark",
    border: "border-teal/20",
  },
  "bess.charge_started": {
    bg: "bg-teal-50",
    text: "text-teal-dark",
    border: "border-teal/20",
  },
  "recommendation.denied": {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
  },
};

const actionLabels: Record<string, string> = {
  "optimization.approved": "Optimization Approved",
  "optimization.generated": "Optimization Generated",
  "sop.version_created": "SOP Version Created",
  "sop.executed": "SOP Executed",
  "agent.alert": "Agent Alert",
  "bess.discharge_started": "BESS Discharge Started",
  "bess.charge_started": "BESS Charge Started",
  "recommendation.denied": "Recommendation Denied",
};

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return { date, time };
}

function timeAgo(ts: string) {
  const now = new Date("2026-03-17T17:00:00Z");
  const then = new Date(ts);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

export default function AuditPage() {
  const [filter, setFilter] = useState<Severity>("all");

  const filteredLogs =
    filter === "all"
      ? auditLogs
      : auditLogs.filter((l) => l.severity === filter);

  const filters: { label: string; value: Severity; count: number }[] = [
    { label: "All", value: "all", count: auditLogs.length },
    {
      label: "Info",
      value: "info",
      count: auditLogs.filter((l) => l.severity === "info").length,
    },
    {
      label: "Warning",
      value: "warning",
      count: auditLogs.filter((l) => l.severity === "warning").length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Audit Log</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Track all system events, operator actions, and agent activities
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f.value
                  ? "bg-navy text-white shadow-sm"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {f.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filter === f.value
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[23px] top-2 bottom-2 w-px bg-slate-200" />

          <div className="space-y-0">
            {filteredLogs.map((log, index) => {
              const { date, time } = formatTimestamp(log.timestamp);
              const Icon = actionIcons[log.action] || Target;
              const colors = actionColors[log.action] || {
                bg: "bg-slate-50",
                text: "text-slate-600",
                border: "border-slate-200",
              };
              const label = actionLabels[log.action] || log.action;
              const isLast = index === filteredLogs.length - 1;

              return (
                <div
                  key={log.id}
                  className={`relative flex items-start gap-4 group ${
                    !isLast ? "pb-6" : ""
                  }`}
                >
                  {/* Timeline node */}
                  <div
                    className={`relative z-10 flex-shrink-0 w-[46px] h-[46px] rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Action badge + severity */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
                          >
                            {label}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              log.severity === "warning"
                                ? "bg-amber-50 text-amber-600 border border-amber-200"
                                : "bg-sky-50 text-sky-600 border border-sky-200"
                            }`}
                          >
                            {log.severity === "warning" ? (
                              <AlertTriangle className="w-2.5 h-2.5" />
                            ) : (
                              <Info className="w-2.5 h-2.5" />
                            )}
                            {log.severity}
                          </span>
                        </div>

                        {/* Target */}
                        <p className="text-sm font-medium text-slate-800 group-hover:text-navy transition-colors">
                          {log.target}
                        </p>

                        {/* Metadata */}
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <User className="w-3 h-3" />
                            <span>{log.user}</span>
                          </div>
                          <span className="text-slate-200">|</span>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {date} at {time}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Time ago */}
                      <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0 mt-1">
                        {timeAgo(log.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Filter className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                No audit logs match the selected filter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
