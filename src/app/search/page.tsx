"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Filter,
  ChevronDown,
  FileText,
  Server,
  Lightbulb,
  ClipboardList,
  Clock,
  ArrowRight,
  Bot,
  Zap,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { dataCenters } from "@/lib/mock-data";

const suggestions = [
  "Chiller-2 maintenance history",
  "BESS optimization results",
  "SOP for emergency procedures",
];

const sampleResults = [
  {
    type: "asset",
    icon: Server,
    title: "Chiller-2 — Maintenance Log",
    snippet:
      "Vibration anomaly detected on 2026-03-17. Last scheduled maintenance on 2026-02-15. Bearing replacement completed. Next service due 2026-04-15.",
    site: "DC Site 001 (Atlanta)",
    timestamp: "Updated 2 hours ago",
    relevance: 0.96,
  },
  {
    type: "sop",
    icon: FileText,
    title: "SOP-001: Chiller Switchover Procedure (v3.2)",
    snippet:
      "Step-by-step procedure for transitioning between primary and standby chillers. Includes pre-checks, valve sequencing, and CHW temperature verification within 42-48\u00B0F bounds.",
    site: "All Sites",
    timestamp: "Updated Mar 10",
    relevance: 0.92,
  },
  {
    type: "recommendation",
    icon: Lightbulb,
    title: "Optimize Chiller Sequencing for Peak Demand",
    snippet:
      "Recommended chiller staging adjustment to reduce peak demand charges during 12:00-16:00 window. Expected savings: $12,400/month. Confidence: 92%.",
    site: "DC Site 001 (Atlanta)",
    timestamp: "Generated today",
    relevance: 0.88,
  },
  {
    type: "audit",
    icon: ClipboardList,
    title: "Audit: Chiller-2 vibration anomaly alert",
    snippet:
      "Asset Health Monitor triggered warning at 14:15 UTC. Vibration levels exceeded threshold by 18%. Automatic notification sent to on-call operator (James Lee).",
    site: "DC Site 001 (Atlanta)",
    timestamp: "Today at 2:15 PM",
    relevance: 0.84,
  },
  {
    type: "agent",
    icon: Bot,
    title: "Asset Health Monitor — Chiller-2 Analysis",
    snippet:
      "Predictive maintenance model indicates 73% probability of bearing degradation within 30 days. Recommended action: Schedule inspection during next maintenance window.",
    site: "DC Site 001 (Atlanta)",
    timestamp: "Analysis from 30 min ago",
    relevance: 0.81,
  },
];

const typeColors: Record<string, string> = {
  asset: "bg-blue/10 text-blue",
  sop: "bg-purple-100 text-purple-600",
  recommendation: "bg-amber-100 text-amber-700",
  audit: "bg-slate-100 text-slate-600",
  agent: "bg-teal/10 text-teal-dark",
};

const typeLabels: Record<string, string> = {
  asset: "Asset",
  sop: "SOP",
  recommendation: "Recommendation",
  audit: "Audit Log",
  agent: "Agent Insight",
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [dcFilter, setDcFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      setIsSearching(true);
      setShowResults(false);
      const timer = setTimeout(() => {
        setIsSearching(false);
        setShowResults(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
      setShowResults(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-blue flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Agentic Search</h1>
              <p className="text-sm text-slate-500">AI-powered search across all sites, assets, SOPs, and operational data</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Search Input Area */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 mb-6">
          <div className="flex items-center gap-3">
            <div className="pl-3">
              <Sparkles className="w-5 h-5 text-teal" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about your data centers..."
              className="flex-1 py-3 text-base text-slate-800 placeholder-slate-400 outline-none bg-transparent"
            />
            <button className="px-5 py-2.5 bg-navy text-white rounded-xl text-sm font-medium hover:bg-navy-light transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>

          {/* DC Filter */}
          <div className="flex items-center gap-3 px-3 pt-2 pb-1 border-t border-slate-100 mt-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <div className="relative">
              <select
                value={dcFilter}
                onChange={(e) => setDcFilter(e.target.value)}
                className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-7 py-1.5 outline-none focus:border-navy transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Sites</option>
                {dataCenters.map((dc) => (
                  <option key={dc.id} value={dc.id}>
                    {dc.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
            <div className="flex items-center gap-1.5 ml-auto text-[11px] text-slate-400">
              <Zap className="w-3 h-3" />
              Powered by Helios AI
            </div>
          </div>
        </div>

        {/* Empty State — Suggestions */}
        {!query && !isSearching && !showResults && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy/5 to-teal/5 flex items-center justify-center mx-auto mb-5">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">
              Search across your entire operational knowledge base
            </h2>
            <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto">
              Find assets, SOPs, recommendations, audit logs, and agent insights using natural language queries.
            </p>
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Try searching for</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-teal/40 hover:shadow-md transition-all text-sm text-slate-600"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal transition-colors" />
                    &ldquo;{s}&rdquo;
                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-teal transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading Shimmer */}
        {isSearching && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 border-2 border-teal border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-slate-500">Searching across all knowledge sources...</span>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-50 rounded w-full" />
                    <div className="h-3 bg-slate-50 rounded w-4/5" />
                    <div className="flex gap-3">
                      <div className="h-3 bg-slate-50 rounded w-24" />
                      <div className="h-3 bg-slate-50 rounded w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search Results */}
        {showResults && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{sampleResults.length} results</span> for &ldquo;{query}&rdquo;
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                0.8s
              </div>
            </div>

            {/* AI Summary Card */}
            <div className="bg-gradient-to-br from-navy to-navy-light rounded-xl p-5 mb-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-teal" />
                <span className="text-xs font-semibold text-teal uppercase tracking-wider">AI Summary</span>
              </div>
              <p className="text-sm leading-relaxed text-white/90">
                Chiller-2 at DC Site 001 (Atlanta) is currently in a <span className="text-amber-300 font-semibold">warning state</span> due to elevated vibration levels detected 2 hours ago. The asset has a recommended switchover procedure (SOP-001 v3.2) and an active optimization recommendation for sequencing adjustments that could save <span className="text-teal font-semibold">$12,400/month</span>. The Asset Health Monitor predicts 73% probability of bearing degradation within 30 days.
              </p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
                <span className="flex items-center gap-1 text-xs text-white/50">
                  <Bot className="w-3 h-3" />
                  Sources: 3 agents, 2 SOPs, 4 telemetry streams
                </span>
              </div>
            </div>

            {/* Result Cards */}
            <div className="space-y-3">
              {sampleResults.map((result, i) => {
                const Icon = result.icon;
                return (
                  <div
                    key={i}
                    className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-navy/20 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColors[result.type]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${typeColors[result.type]}`}>
                            {typeLabels[result.type]}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {Math.round(result.relevance * 100)}% match
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-800 group-hover:text-navy transition-colors mb-1">
                          {result.title}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                          {result.snippet}
                        </p>
                        <div className="flex items-center gap-4 mt-2.5">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Server className="w-3 h-3" />
                            {result.site}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {result.timestamp}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-navy shrink-0 mt-1 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
