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
  Shield,
  ShieldCheck,
  ShieldX,
  Lock,
  Fingerprint,
  UserCheck,
} from "lucide-react";
import { agents, agentAuthConfigs } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

/* ---------- brand colors ---------- */
const NAVY = "#001C77";
const TEAL = "#00C6C1";

/* ---------- activity log mock data ---------- */
const activityLogs: Record<
  string,
  { id: string; timestamp: string; action: string; severity: "info" | "warning" | "success"; requiresApproval?: boolean; approvedBy?: string | null }[]
> = {
  "agent-sop": [
    { id: "l1", timestamp: "16:43:00", action: "Matched SOP-001 to Chiller-2 vibration alert — recommended switchover procedure", severity: "info", requiresApproval: false },
    { id: "l2", timestamp: "16:30:00", action: "Validated pre-check conditions for AHU economizer mode — all 6 conditions met", severity: "success", requiresApproval: false },
    { id: "l3", timestamp: "15:55:00", action: "Version 3.2 of SOP-001 auto-published after review approval by Mike Chen", severity: "info", requiresApproval: false },
    { id: "l4", timestamp: "15:12:00", action: "Safety boundary alert: CHW supply temp approaching upper limit (46.5°F / 48°F max)", severity: "warning", requiresApproval: false },
    { id: "l5", timestamp: "14:40:00", action: "Requested approval: Execute BESS emergency discharge (SOP-002)", severity: "warning", requiresApproval: true, approvedBy: "Sarah Kim" },
    { id: "l6", timestamp: "13:20:00", action: "Completed quarterly SOP compliance audit — 3 of 4 SOPs up to date", severity: "success", requiresApproval: false },
  ],
  "agent-health": [
    { id: "l1", timestamp: "16:44:30", action: "Anomaly detected: Chiller-2 bearing vibration 23% above baseline — monitoring escalated", severity: "warning", requiresApproval: false },
    { id: "l2", timestamp: "16:42:00", action: "Health scores updated for all 5 monitored assets — overall fleet score: 94/100", severity: "success", requiresApproval: false },
    { id: "l3", timestamp: "16:35:00", action: "Predictive model: BESS-1 cell degradation rate within normal parameters (0.02%/month)", severity: "info", requiresApproval: false },
    { id: "l4", timestamp: "16:20:00", action: "Requested approval: Create maintenance ticket for Cooling Tower-1 fan motor", severity: "warning", requiresApproval: true, approvedBy: null },
    { id: "l5", timestamp: "16:05:00", action: "UPS-1 battery string B temperature nominal at 25.2°C — cleared previous alert", severity: "success", requiresApproval: false },
    { id: "l6", timestamp: "15:50:00", action: "AHU-3 supply air temp deviation corrected after damper recalibration", severity: "info", requiresApproval: false },
  ],
  "agent-planner": [
    { id: "l1", timestamp: "16:30:00", action: "Idle — awaiting next optimization trigger (scheduled for 20:00 next-day forecast)", severity: "info", requiresApproval: false },
    { id: "l2", timestamp: "08:00:00", action: "Generated day-ahead optimization plan — projected savings: $12,400", severity: "success", requiresApproval: false },
    { id: "l3", timestamp: "07:55:00", action: "Requested approval: Apply optimization — modify chiller sequence & dispatch BESS", severity: "warning", requiresApproval: true, approvedBy: "Sarah Kim" },
    { id: "l4", timestamp: "07:50:00", action: "Retrieved weather forecast: high 78°F, cooling load impact +8% vs. baseline", severity: "info", requiresApproval: false },
    { id: "l5", timestamp: "07:45:00", action: "BESS arbitrage window identified: charge 02:00-06:00, discharge 10:00-14:00", severity: "success", requiresApproval: false },
    { id: "l6", timestamp: "07:30:00", action: "Risk assessment complete — all 5 constraint checks passed (auto-approved)", severity: "success", requiresApproval: false },
  ],
};

/* ---------- permission level colors ---------- */
const permLevelColors: Record<string, { bg: string; text: string; label: string }> = {
  monitor: { bg: "bg-blue-50", text: "text-blue-700", label: "Monitor" },
  advisory: { bg: "bg-amber-50", text: "text-amber-700", label: "Advisory" },
  autonomous: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Autonomous" },
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
  const { currentUser, hasPermission } = useAuth();

  const canInteractWithAgents = hasPermission("agent_interact");
  const canApproveAgentActions = currentUser.agentPermissions.includes("approve_recommendations");

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* UC4 Info Banner */}
      <div className="bg-gradient-to-r from-navy to-navy-light rounded-xl p-5 mb-6 text-white">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Fingerprint className="w-5 h-5 text-teal-light" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-sm">UC4: Agent Identity & Authorization</h2>
            <p className="text-white/70 text-xs leading-relaxed mt-1">
              Agent authorization is a separate permission category from human user permissions. Read/write access
              doesn&apos;t automatically grant agent interaction. Each agent has its own identity, permission level,
              and set of actions that require human approval.
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-white/50 text-[10px] uppercase tracking-wider">Your agent access</p>
            {canInteractWithAgents ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal/20 text-teal-light text-xs font-medium mt-0.5">
                <ShieldCheck className="w-3 h-3" />
                {canApproveAgentActions ? "Approve & Interact" : "View Only"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-200 text-xs font-medium mt-0.5">
                <ShieldX className="w-3 h-3" />
                No Agent Access
              </span>
            )}
          </div>
        </div>
      </div>

      {/* No Access Warning */}
      {!canInteractWithAgents && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Agent interaction requires explicit permission</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Your role ({currentUser.role.replace("_", " ")}) does not include agent_interact permission.
              You can view agent status but cannot approve, configure, or trigger agent actions.
            </p>
          </div>
        </div>
      )}

      {/* ─── HEADER ─── */}
      <header className="bg-white border-b border-gray-200 rounded-xl mb-6">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Cpu className="w-5 h-5" style={{ color: TEAL }} />
              AI Agents
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Autonomous operational agents with human-in-the-loop governance
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

      <div className="space-y-5">
        {agents.map((agent) => {
          const isExpanded = expandedId === agent.id;
          const logs = activityLogs[agent.id] || [];
          const isActive = agent.status === "active";
          const authConfig = agentAuthConfigs.find((c) => c.agentId === agent.id);

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
                        {/* Agent Permission Level Badge */}
                        {authConfig && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${permLevelColors[authConfig.permissionLevel].bg} ${permLevelColors[authConfig.permissionLevel].text}`}>
                            <Shield className="w-3 h-3" />
                            {permLevelColors[authConfig.permissionLevel].label}
                          </span>
                        )}
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

                {/* Metrics grid */}
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
                  {/* Authorization Model */}
                  {authConfig && (
                    <div className="px-6 py-5 border-b border-gray-100 bg-slate-50/50">
                      <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
                        <Fingerprint className="w-4 h-4" style={{ color: NAVY }} />
                        Agent Authorization Model
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                            Auto-Approved Actions
                          </p>
                          <div className="space-y-1.5">
                            {authConfig.autoApproved.map((action) => (
                              <div key={action} className="flex items-center gap-2 text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="text-slate-700">{action.replace(/_/g, " ")}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                            Requires Human Approval
                          </p>
                          <div className="space-y-1.5">
                            {authConfig.requiresApproval.map((action) => (
                              <div key={action} className="flex items-center gap-2 text-xs">
                                <UserCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span className="text-slate-700">{action.replace(/_/g, " ")}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
                            {/* Approval indicator */}
                            {log.requiresApproval && (
                              <div className="mt-1.5 flex items-center gap-2">
                                {log.approvedBy ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200">
                                    <UserCheck className="w-3 h-3" />
                                    Approved by {log.approvedBy}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-medium border border-amber-200">
                                    <Clock className="w-3 h-3" />
                                    Awaiting approval
                                  </span>
                                )}
                              </div>
                            )}
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
                    {canInteractWithAgents && (
                      <button className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Configure
                      </button>
                    )}
                    {canInteractWithAgents && isActive && (
                      <button className="text-sm font-medium px-4 py-2 rounded-lg border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors ml-auto">
                        Pause Agent
                      </button>
                    )}
                    {canInteractWithAgents && !isActive && (
                      <button
                        className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-colors ml-auto hover:opacity-90"
                        style={{ backgroundColor: TEAL }}
                      >
                        Resume Agent
                      </button>
                    )}
                    {!canInteractWithAgents && (
                      <span className="text-xs text-slate-400 ml-auto flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Agent controls require agent_interact permission
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
