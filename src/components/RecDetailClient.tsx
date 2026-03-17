"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  ArrowLeft,
  Lightbulb,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  Server,
  BarChart3,
  ClipboardList,
  Play,
  MessageSquare,
  Send,
  CircleDot,
  Activity,
  FileText,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { recommendations, dataCenters, assets, auditLogs } from "@/lib/mock-data";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  "review-required": {
    label: "Review Required",
    color: "text-orange-700",
    bg: "bg-orange-100 ring-orange-300",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  approved: {
    label: "Approved",
    color: "text-emerald-700",
    bg: "bg-emerald-100 ring-emerald-300",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  denied: {
    label: "Denied",
    color: "text-red-700",
    bg: "bg-red-100 ring-red-300",
    icon: <XCircle className="w-4 h-4" />,
  },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  high: { label: "High", color: "bg-red-50 text-red-600 ring-red-200" },
  medium: { label: "Medium", color: "bg-yellow-50 text-yellow-700 ring-yellow-200" },
  low: { label: "Low", color: "bg-slate-100 text-slate-600 ring-slate-200" },
};

// Mock monthly savings data
const monthlySavings = [
  { month: "Apr", projected: 3200, baseline: 4800 },
  { month: "May", projected: 3400, baseline: 5100 },
  { month: "Jun", projected: 3800, baseline: 5800 },
  { month: "Jul", projected: 4100, baseline: 6200 },
  { month: "Aug", projected: 4200, baseline: 6400 },
  { month: "Sep", projected: 3600, baseline: 5200 },
];

// Validation checks
const validationChecks = [
  { name: "Safety boundary compliance", status: "pass" as const, detail: "All parameters within limits" },
  { name: "Equipment availability", status: "pass" as const, detail: "All assets operational and ready" },
  { name: "Weather forecast compatibility", status: "pass" as const, detail: "Conditions favorable for next 24h" },
  { name: "Grid tariff verification", status: "pass" as const, detail: "Rate schedule confirmed with utility" },
  { name: "Concurrent SOP conflicts", status: "warn" as const, detail: "SOP-001 scheduled in same window" },
  { name: "Historical success rate", status: "pass" as const, detail: "Similar plans: 94% success rate" },
];

const tabs = [
  { id: "overview", label: "Overview", icon: <Lightbulb className="w-4 h-4" /> },
  { id: "assets", label: "Assets", icon: <Server className="w-4 h-4" /> },
  { id: "savings", label: "Savings", icon: <DollarSign className="w-4 h-4" /> },
  { id: "validation", label: "Validation", icon: <ShieldCheck className="w-4 h-4" /> },
  { id: "execution", label: "Execution", icon: <Play className="w-4 h-4" /> },
  { id: "audit", label: "Audit", icon: <FileText className="w-4 h-4" /> },
];

function GaugeChart({ value, label, color }: { value: number; label: string; color: string }) {
  const pct = value * 100;
  const radius = 50;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - value);
  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="70" viewBox="0 0 120 70">
        {/* Background arc */}
        <path
          d="M 10 65 A 50 50 0 0 1 110 65"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d="M 10 65 A 50 50 0 0 1 110 65"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${offset}`}
          className="transition-all duration-700"
        />
        <text x="60" y="55" textAnchor="middle" className="text-xl font-bold" fill="#1e293b" fontSize="22">
          {pct.toFixed(0)}%
        </text>
      </svg>
      <span className="text-xs font-medium text-slate-500 -mt-1">{label}</span>
    </div>
  );
}

export default function RecDetailClient() {
  const params = useParams();
  const router = useRouter();
  const dcId = params.dcId as string;
  const recId = params.recId as string;
  const dc = dataCenters.find((d) => d.id === dcId) ?? dataCenters[0];
  const rec = recommendations.find((r) => r.id === recId) ?? recommendations[0];
  const status = statusConfig[rec.status];
  const priority = priorityConfig[rec.priority];

  const [activeTab, setActiveTab] = useState("overview");
  const [comment, setComment] = useState("");
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  const relatedLogs = auditLogs.filter(
    (log) =>
      rec.affectedAssets.some((a) => log.target.toLowerCase().includes(a.toLowerCase())) ||
      log.target.toLowerCase().includes(rec.title.toLowerCase().split(" ")[0].toLowerCase())
  );

  const affectedAssetDetails = assets.filter((a) =>
    rec.affectedAssets.some((name) => a.name === name)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <button onClick={() => router.push(`/dc/${dcId}`)} className="hover:text-[#001C77] transition-colors">
              {dc.name}
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button
              onClick={() => router.push(`/dc/${dcId}/schedule`)}
              className="hover:text-[#001C77] transition-colors"
            >
              Recommendations
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#001C77] font-medium">{rec.id.toUpperCase()}</span>
          </div>

          {/* Title */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-[#00C6C1]/10 flex items-center justify-center">
                  <Zap className="w-5.5 h-5.5 text-[#00C6C1]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{rec.title}</h1>
                  <span className="text-xs text-slate-400 font-mono">{rec.id.toUpperCase()}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 ml-[56px]">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ring-inset ${status.bg} ${status.color}`}
                >
                  {status.icon}
                  {status.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ring-inset ${priority.color}`}
                >
                  {priority.label} Priority
                </span>
                <span className="w-px h-4 bg-slate-200" />
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(rec.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {actionTaken ? (
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                    actionTaken === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : actionTaken === "denied"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {actionTaken === "approved" && <CheckCircle2 className="w-4 h-4" />}
                  {actionTaken === "denied" && <XCircle className="w-4 h-4" />}
                  {actionTaken === "changes" && <RefreshCw className="w-4 h-4" />}
                  {actionTaken === "approved" ? "Approved" : actionTaken === "denied" ? "Denied" : "Changes Requested"}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setActionTaken("approved")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => setActionTaken("denied")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Deny
                  </button>
                  <button
                    onClick={() => setActionTaken("changes")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-slate-700 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Request Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#001C77] text-[#001C77]"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Description + Gauges */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#00C6C1]" />
                  Description
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">{rec.description}</p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-emerald-50 p-4 text-center">
                    <DollarSign className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-xl font-bold text-emerald-700">${rec.expectedSavings.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600">Expected Savings</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <Server className="w-5 h-5 text-[#0095D6] mx-auto mb-1" />
                    <p className="text-xl font-bold text-[#001C77]">{rec.affectedAssets.length}</p>
                    <p className="text-xs text-[#0095D6]">Affected Assets</p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4 text-center">
                    <Activity className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xl font-bold text-purple-700">{rec.phases.length}</p>
                    <p className="text-xs text-purple-600">Execution Phases</p>
                  </div>
                </div>
              </div>

              {/* Gauges */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-center gap-6">
                <GaugeChart value={rec.confidence} label="Confidence" color="#0095D6" />
                <GaugeChart value={rec.safetyScore} label="Safety Score" color="#00C6C1" />
              </div>
            </div>

            {/* Execution Timeline Visual */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#001C77]" />
                Execution Timeline
              </h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-slate-100 rounded-full" />
                <div className="relative flex justify-between">
                  {rec.phases.map((phase, i) => {
                    const colors = ["bg-[#0095D6]", "bg-[#00C6C1]", "bg-[#001C77]"];
                    return (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-12 h-12 rounded-full ${colors[i % 3]} flex items-center justify-center text-white font-bold text-sm z-10 shadow-md`}
                        >
                          {i + 1}
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-sm font-semibold text-slate-800">{phase.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {phase.start} - {phase.end}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 max-w-[200px]">{phase.action}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assets Tab */}
        {activeTab === "assets" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Server className="w-4 h-4 text-[#0095D6]" />
                Affected Assets
              </h3>

              {/* List all affected assets by name (including those without telemetry) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {rec.affectedAssets.map((assetName) => {
                  const assetDetail = assets.find((a) => a.name === assetName);
                  return (
                    <div
                      key={assetName}
                      className="rounded-lg border border-slate-200 p-4 hover:border-[#0095D6]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-[#0095D6]/10 flex items-center justify-center">
                            <Server className="w-4 h-4 text-[#0095D6]" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-800">{assetName}</h4>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                              {assetDetail?.type ?? "Equipment"}
                            </span>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">
                          <CircleDot className="w-3 h-3" />
                          Online
                        </span>
                      </div>

                      {assetDetail && (
                        <div className="space-y-1.5 border-t border-slate-100 pt-3">
                          {Object.entries(assetDetail.telemetry)
                            .slice(0, 4)
                            .map(([key, val]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="text-slate-500 capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <span className="text-slate-700 font-medium font-mono">
                                  {typeof val === "number" ? val.toLocaleString() : val}
                                </span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Savings Tab */}
        {activeTab === "savings" && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-500">Monthly Savings</span>
                </div>
                <p className="text-2xl font-bold text-emerald-700">
                  ${rec.expectedSavings.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">Projected per billing cycle</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#0095D6]" />
                  <span className="text-xs font-medium text-slate-500">Annual Projection</span>
                </div>
                <p className="text-2xl font-bold text-[#001C77]">
                  ${(rec.expectedSavings * 12).toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">Annualized estimate</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-[#00C6C1]" />
                  <span className="text-xs font-medium text-slate-500">Cost Reduction</span>
                </div>
                <p className="text-2xl font-bold text-[#00C6C1]">
                  {((1 - monthlySavings[0].projected / monthlySavings[0].baseline) * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-slate-400 mt-1">Vs. current baseline</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#001C77]" />
                Monthly Projected Savings Breakdown
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Baseline cost vs. optimized cost (projected)
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySavings} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                      tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name === "baseline" ? "Baseline" : "Optimized"]}
                    />
                    <Bar dataKey="baseline" name="baseline" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="projected" name="projected" fill="#00C6C1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 justify-center mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#cbd5e1]" />
                  <span className="text-xs text-slate-500">Baseline Cost</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#00C6C1]" />
                  <span className="text-xs text-slate-500">Optimized Cost</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Validation Tab */}
        {activeTab === "validation" && (
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00C6C1]" />
                Validation Checks
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated pre-execution validation results
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {validationChecks.map((check, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex-shrink-0">
                    {check.status === "pass" ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                      </div>
                    ) : check.status === "warn" ? (
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <AlertCircle className="w-4.5 h-4.5 text-amber-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <XCircle className="w-4.5 h-4.5 text-red-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{check.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{check.detail}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                      check.status === "pass"
                        ? "bg-emerald-100 text-emerald-700"
                        : check.status === "warn"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {check.status === "pass" ? "PASS" : check.status === "warn" ? "WARN" : "FAIL"}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">
                  {validationChecks.filter((c) => c.status === "pass").length}/{validationChecks.length} checks passed
                </span>
                {validationChecks.some((c) => c.status === "warn") && (
                  <span className="text-sm text-amber-600 ml-2">
                    ({validationChecks.filter((c) => c.status === "warn").length} warning
                    {validationChecks.filter((c) => c.status === "warn").length > 1 ? "s" : ""})
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Execution Tab */}
        {activeTab === "execution" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Play className="w-4 h-4 text-[#001C77]" />
              Phase Timeline
            </h3>

            {/* Horizontal timeline */}
            <div className="relative mb-8">
              {/* Hour scale */}
              <div className="flex justify-between mb-2 px-4">
                {Array.from({ length: 25 }, (_, i) => i).filter((h) => h % 4 === 0).map((h) => (
                  <span key={h} className="text-[10px] text-slate-400 font-mono">
                    {h.toString().padStart(2, "0")}:00
                  </span>
                ))}
              </div>

              {/* Track */}
              <div className="relative h-16 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                {rec.phases.map((phase, i) => {
                  const startHour = parseInt(phase.start.split(":")[0]);
                  const endHour = parseInt(phase.end.split(":")[0]);
                  const adjustedEnd = endHour < startHour ? endHour + 24 : endHour;
                  const leftPct = (startHour / 24) * 100;
                  const widthPct = ((adjustedEnd - startHour) / 24) * 100;
                  const colors = [
                    "bg-[#0095D6]/80 border-[#0095D6]",
                    "bg-[#00C6C1]/80 border-[#00C6C1]",
                    "bg-[#001C77]/80 border-[#001C77]",
                  ];
                  return (
                    <div
                      key={i}
                      className={`absolute top-2 bottom-2 rounded-lg border-2 ${colors[i % 3]} flex items-center justify-center transition-all`}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    >
                      <span className="text-xs font-semibold text-white drop-shadow-sm truncate px-2">
                        {phase.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phase details */}
            <div className="space-y-4">
              {rec.phases.map((phase, i) => {
                const iconColors = ["text-[#0095D6]", "text-[#00C6C1]", "text-[#001C77]"];
                const bgColors = ["bg-[#0095D6]/10", "bg-[#00C6C1]/10", "bg-[#001C77]/10"];
                return (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div className={`w-10 h-10 rounded-xl ${bgColors[i % 3]} flex items-center justify-center flex-shrink-0`}>
                      <span className={`text-sm font-bold ${iconColors[i % 3]}`}>{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-sm font-semibold text-slate-800">{phase.name}</h4>
                        <span className="text-xs text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                          {phase.start} - {phase.end}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{phase.action}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#001C77]" />
                Related Audit Entries
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Activity log entries related to this recommendation and affected assets
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {(relatedLogs.length > 0 ? relatedLogs : auditLogs.slice(0, 4)).map((log) => (
                <div key={log.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        log.severity === "warning"
                          ? "bg-amber-100"
                          : "bg-slate-100"
                      }`}
                    >
                      {log.severity === "warning" ? (
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Activity className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800">{log.target}</span>
                      <span className="text-xs font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {log.user} &middot;{" "}
                      {new Date(log.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comment Box (always visible) */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            Comments
          </h3>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#001C77] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              FI
            </div>
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment about this recommendation..."
                className="w-full p-3 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0095D6]/30 focus:border-[#0095D6] transition-all placeholder:text-slate-400"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  disabled={!comment.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#001C77] text-white text-sm font-medium hover:bg-[#001C77]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="pt-4 pb-8">
          <button
            onClick={() => router.push(`/dc/${dcId}/schedule`)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#001C77] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}
