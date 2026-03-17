"use client";

import { useState } from "react";
import {
  Bot,
  Activity,
  Clock,
  Target,
  ArrowUpRight,
  Settings,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Info,
  Cpu,
  Zap,
} from "lucide-react";
import { agents } from "@/lib/mock-data";

/* ---------- brand colors ---------- */
const NAVY = "#001C77";
const TEAL = "#00C6C1";
const BLUE = "#0095D6";

/* ---------- activity log mock data ---------- */
const activityLogs: Record<
  string,
  { id: string; timestamp: string; action: string; severity: "info" | "warning" | "success" }[]
> = {
  "agent-sop": [
    { id: "l1", timestamp: "16:43:00", action: "Matched SOP-001 to Chiller-2 vibration alert — recommended switchover procedure", severity: "info" },
    { id: "l2", timestamp: "16:30:00", action: "Validated pre-check conditions for AHU economizer mode — all 6 conditions met", severity: "success" },
    { id: "l3", timestamp: "15:55:00", action: "Version 3.2 of SOP-001 auto-published after review approval by Mike Chen", severity: "info" },
    { id: "l4", timestamp: "15:12:00", action: "Safety boundary alert: CHW supply temp approaching upper limit (46.5°F / 48°F max)", severity: "warning" },
    { id: "l5", timestamp: "14:40:00", action: "Generated pre-check report for BESS emergency discharge procedure (SOP-002)", severity: "info" },
    { id: "l6", timestamp: "13:20:00", action: "Completed quarterly SOP compliance audit — 3 of 4 SOPs up to date", severity: "success" },
  ],
  "agent-health": [
    { id: "l1", timestamp: "16:44:30", action: "Anomaly detected: Chiller-2 bearing vibration 23% above baseline — monitoring escalated", severity: "warning" },
    { id: "l2", timestamp: "16:42:00", action: "Health scores updated for all 5 monitored assets — overall fleet score: 94/100", severity: "success" },
    { id: "l3", timestamp: "16:35:00", action: "Predictive model: BESS-1 cell degradation rate within normal parameters (0.02%/month)", severity: "info" },
    { id: "l4", timestamp: "16:20:00", action: "Cooling Tower-1 fan motor current trending up — maintenance recommended in 14 days", severity: "warning" },
    { id: "l5", timestamp: "16:05:00", action: "UPS-1 battery string B temperature nominal at 25.2°C — cleared previous alert", severity: "success" },
    { id: "l6", timestamp: "15:50:00", action: "AHU-3 supply air temp deviation corrected after damper recalibration", severity: "info" },
  ],
  "agent-planner": [
    { id: "l1", timestamp: "16:30:00", action: "Idle — awaiting next optimization trigger (scheduled for 20:00 next-day forecast)", severity: "info" },
    { id: "l2", timestamp: "08:00:00", action: "Generated day-ahead optimization plan — projected savings: $12,400", severity: "success" },
    { id: "l3", timestamp: "07:55:00", action: "Ingested 24-hour price forecast from PJM market data feed", severity: "info" },
    { id: "l4", timestamp: "07:50:00", action: "Retrieved weather forecast: high 78°F, cooling load impact +8% vs. baseline", severity: "info" },
    { id: "l5", timestamp: "07:45:00", action: "BESS arbitrage window identified: charge 02:00-06:00, discharge 10:00-14:00", severity: "success" },
    { id: "l6", timestamp: "07:30:00", action: "Risk assessment complete — all 5 constraint checks passed", severity: "success" },
  ],
};

/* ---------- agent metrics card ---------- */
function MetricTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  );
}

/* ---------- severity icon ---------- */
function SeverityIcon({ severity }: { severity: "info" | "warning" | "success" }) {
  if (severity === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
  if (severity === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
  return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
}

/* ---------- main component ---------- */
export default function AgentPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── HEADER ─── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Cpu className="w-5 h-5" style={{ color: TEAL }} />
              AI Agents
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              DC Site 001 (Atlanta) &mdash; Autonomous operational agents
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {agents.filter((a) => a.status === "active").length} Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium border border-gray-200">
              {agents.filter((a) => a.status === "idle").length} Idle
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-6 space-y-5">
        {agents.map((agent) => {
          const isExpanded = expandedId === agent.id;
          const logs = activityLogs[agent.id] || [];
          const isActive = agent.status === "active";

          return (
            <div
              key={agent.id}
              className={`bg-white rounded-xl border shadow-sm transition-all duration-200 ${
                isExpanded ? "border-blue-300 ring-2 ring-blue-100" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* ─── Card Header (always visible) ─── */}
              <button
                onClick={() => toggle(agent.id)}
                className="w-full text-left px-6 py-5 focus:outline-none"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Agent icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: isActive ? `${TEAL}15` : "#f1f5f9",
                      }}
                    >
                      <Bot
                        className="w-6 h-6"
                        style={{ color: isActive ? TEAL : "#94a3b8" }}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                        {/* Status badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-500 border border-gray-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                            }`}
                          />
                          {isActive ? "Active" : "Idle"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 max-w-2xl">{agent.description}</p>

                      {/* Capabilities */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {agent.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border"
                            style={{
                              color: NAVY,
                              backgroundColor: `${NAVY}08`,
                              borderColor: `${NAVY}20`,
                            }}
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right side: expand icon */}
                  <div className="flex items-center gap-3 shrink-0 mt-1">
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      Last active: {agent.lastActivity}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* ─── Metrics grid ─── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 ml-16">
                  <MetricTile
                    label="Tasks Completed"
                    value={agent.metrics.tasksCompleted.toLocaleString()}
                    icon={CheckCircle2}
                  />
                  <MetricTile
                    label="Avg Response"
                    value={agent.metrics.avgResponseTime}
                    icon={Clock}
                  />
                  <MetricTile
                    label="Accuracy"
                    value={`${(agent.metrics.accuracy * 100).toFixed(0)}%`}
                    icon={Target}
                  />
                  <MetricTile
                    label="Uptime"
                    value={`${(agent.metrics.uptime * 100).toFixed(1)}%`}
                    icon={Activity}
                  />
                </div>
              </button>

              {/* ─── Expanded detail ─── */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  {/* Activity Log */}
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <Zap className="w-4 h-4" style={{ color: TEAL }} />
                        Recent Activity
                      </h4>
                      <span className="text-xs text-gray-400">
                        Showing latest {logs.length} events
                      </span>
                    </div>

                    <div className="space-y-0">
                      {logs.map((log, idx) => (
                        <div
                          key={log.id}
                          className={`flex items-start gap-3 py-3 ${
                            idx < logs.length - 1 ? "border-b border-gray-50" : ""
                          }`}
                        >
                          <SeverityIcon severity={log.severity} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {log.action}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 font-mono shrink-0">
                            {log.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center gap-3">
                    <button
                      className="text-sm font-medium px-4 py-2 rounded-lg text-white flex items-center gap-2 transition-colors hover:opacity-90"
                      style={{ backgroundColor: NAVY }}
                    >
                      <FileText className="w-4 h-4" />
                      View Logs
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                    <button className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                    {isActive && (
                      <button className="text-sm font-medium px-4 py-2 rounded-lg border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors ml-auto">
                        Pause Agent
                      </button>
                    )}
                    {!isActive && (
                      <button
                        className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-colors ml-auto hover:opacity-90"
                        style={{ backgroundColor: TEAL }}
                      >
                        Resume Agent
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ─── Summary footer ─── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Agent Fleet Summary</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {agents.reduce((sum, a) => sum + a.metrics.tasksCompleted, 0).toLocaleString()} total tasks completed &bull; Average fleet accuracy:{" "}
                {(
                  (agents.reduce((sum, a) => sum + a.metrics.accuracy, 0) / agents.length) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Export Report
              </button>
              <button
                className="text-sm font-semibold px-5 py-2 rounded-lg text-white flex items-center gap-2 transition-colors hover:opacity-90"
                style={{ backgroundColor: NAVY }}
              >
                <Settings className="w-4 h-4" />
                Global Settings
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
