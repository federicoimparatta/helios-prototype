"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Search,
  ChevronRight,
  Clock,
  Lightbulb,
  Filter,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Zap,
  BarChart3,
} from "lucide-react";
import { recommendations, dataCenters } from "@/lib/mock-data";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  "review-required": {
    label: "Review Required",
    color: "text-orange-700",
    bg: "bg-orange-100 ring-orange-300",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  approved: {
    label: "Approved",
    color: "text-emerald-700",
    bg: "bg-emerald-100 ring-emerald-300",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  denied: {
    label: "Denied",
    color: "text-red-700",
    bg: "bg-red-100 ring-red-300",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  high: { label: "High", color: "bg-red-50 text-red-600 ring-red-200" },
  medium: { label: "Medium", color: "bg-yellow-50 text-yellow-700 ring-yellow-200" },
  low: { label: "Low", color: "bg-slate-100 text-slate-600 ring-slate-200" },
};

function ConfidenceBar({ value, label }: { value: number; label: string }) {
  const pct = value * 100;
  const barColor = pct >= 90 ? "bg-emerald-500" : pct >= 80 ? "bg-[#0095D6]" : pct >= 70 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-medium text-slate-500 w-14 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-700 w-10 text-right">{pct.toFixed(0)}%</span>
    </div>
  );
}

export default function RecommendationListingPage() {
  const params = useParams();
  const router = useRouter();
  const dcId = params.dcId as string;
  const dc = dataCenters.find((d) => d.id === dcId) ?? dataCenters[0];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const statuses = ["All", "review-required", "approved", "denied"];
  const statusLabels: Record<string, string> = {
    All: "All",
    "review-required": "Review Required",
    approved: "Approved",
    denied: "Denied",
  };

  const filtered = useMemo(() => {
    return recommendations.filter((rec) => {
      const matchesSearch =
        search === "" ||
        rec.title.toLowerCase().includes(search.toLowerCase()) ||
        rec.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || rec.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalSavings = recommendations.reduce((sum, r) => sum + r.expectedSavings, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <button onClick={() => router.push(`/dc/${dcId}`)} className="hover:text-[#001C77] transition-colors">
              {dc.name}
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#001C77] font-medium">Recommendations</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00C6C1]/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-[#00C6C1]" />
                </div>
                Optimization Recommendations
              </h1>
              <p className="text-slate-500 mt-1 ml-[52px]">
                {recommendations.length} recommendations &middot;{" "}
                {recommendations.filter((r) => r.status === "review-required").length} pending review
              </p>
            </div>

            {/* Summary stat */}
            <div className="hidden sm:flex items-center gap-3 bg-emerald-50 rounded-xl px-5 py-3 border border-emerald-100">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs text-emerald-600 font-medium">Total Projected Savings</p>
                <p className="text-xl font-bold text-emerald-700">${totalSavings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search recommendations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0095D6]/30 focus:border-[#0095D6] transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="flex gap-1.5">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    statusFilter === s
                      ? "bg-[#001C77] text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No recommendations found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((rec) => {
              const status = statusConfig[rec.status];
              const priority = priorityConfig[rec.priority];
              return (
                <button
                  key={rec.id}
                  onClick={() => router.push(`/dc/${dcId}/schedule/${rec.id}`)}
                  className="group bg-white rounded-xl border border-slate-200 p-5 text-left hover:border-[#0095D6]/40 hover:shadow-md hover:shadow-[#0095D6]/5 transition-all duration-200"
                >
                  <div className="flex items-start gap-5">
                    {/* Left content */}
                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-[#00C6C1]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00C6C1]/20 transition-colors">
                          <Zap className="w-4.5 h-4.5 text-[#00C6C1]" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#001C77] transition-colors truncate">
                          {rec.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-500 mb-3 ml-12 line-clamp-2">{rec.description}</p>

                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-2 ml-12">
                        {/* Status */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${status.bg} ${status.color}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>

                        {/* Priority */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${priority.color}`}
                        >
                          {priority.label} Priority
                        </span>

                        {/* Assets */}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                          <BarChart3 className="w-3 h-3" />
                          {rec.affectedAssets.length} asset{rec.affectedAssets.length !== 1 ? "s" : ""}
                        </span>

                        <span className="w-px h-4 bg-slate-200" />

                        {/* Date */}
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(rec.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Right stats */}
                    <div className="flex-shrink-0 w-56 space-y-3">
                      {/* Savings */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Savings</p>
                          <p className="text-lg font-bold text-emerald-700">
                            ${rec.expectedSavings.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Confidence */}
                      <ConfidenceBar value={rec.confidence} label="Confidence" />

                      {/* Safety */}
                      <ConfidenceBar value={rec.safetyScore} label="Safety" />
                    </div>

                    {/* Arrow */}
                    <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-[#0095D6] transition-colors flex-shrink-0 mt-1" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
