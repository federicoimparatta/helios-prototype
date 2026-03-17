"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Search,
  FileText,
  Filter,
  ChevronRight,
  Clock,
  User,
  Tag,
  Shield,
  BadgeCheck,
  PenLine,
} from "lucide-react";
import { sops, dataCenters } from "@/lib/mock-data";

const categoryColors: Record<string, string> = {
  HVAC: "bg-blue-100 text-blue-700",
  Electrical: "bg-purple-100 text-purple-700",
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active: {
    label: "Active",
    color: "bg-emerald-100 text-emerald-700 ring-emerald-300",
    icon: <BadgeCheck className="w-3.5 h-3.5" />,
  },
  draft: {
    label: "Draft",
    color: "bg-yellow-100 text-yellow-700 ring-yellow-300",
    icon: <PenLine className="w-3.5 h-3.5" />,
  },
};

export default function SOPListingPage() {
  const params = useParams();
  const router = useRouter();
  const dcId = params.dcId as string;
  const dc = dataCenters.find((d) => d.id === dcId) ?? dataCenters[0];

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(sops.map((s) => s.category)));
    return ["All", ...cats];
  }, []);

  const filtered = useMemo(() => {
    return sops.filter((sop) => {
      const matchesSearch =
        search === "" ||
        sop.title.toLowerCase().includes(search.toLowerCase()) ||
        sop.author.toLowerCase().includes(search.toLowerCase()) ||
        sop.id.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || sop.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter]);

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
            <span className="text-[#001C77] font-medium">Standard Operating Procedures</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#001C77]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#001C77]" />
                </div>
                Standard Operating Procedures
              </h1>
              <p className="text-slate-500 mt-1 ml-[52px]">
                {sops.length} procedures &middot; {sops.filter((s) => s.status === "active").length} active
              </p>
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
              placeholder="Search SOPs by title, author, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0095D6]/30 focus:border-[#0095D6] transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="flex gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    categoryFilter === cat
                      ? "bg-[#001C77] text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SOP Cards */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No SOPs found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((sop) => {
              const status = statusConfig[sop.status];
              return (
                <button
                  key={sop.id}
                  onClick={() => router.push(`/dc/${dcId}/sop/${sop.id}`)}
                  className="group bg-white rounded-xl border border-slate-200 p-5 text-left hover:border-[#0095D6]/40 hover:shadow-md hover:shadow-[#0095D6]/5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Title Row */}
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#001C77]/10 transition-colors">
                          <Shield className="w-4.5 h-4.5 text-slate-500 group-hover:text-[#001C77] transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#001C77] transition-colors truncate">
                            {sop.title}
                          </h3>
                          <span className="text-xs text-slate-400 font-mono">{sop.id.toUpperCase()}</span>
                        </div>
                      </div>

                      {/* Metadata Row */}
                      <div className="flex flex-wrap items-center gap-3 ml-12">
                        {/* Version */}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-xs font-medium text-slate-600">
                          v{sop.version}
                        </span>

                        {/* Status */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${status.color}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>

                        {/* Category */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${categoryColors[sop.category] ?? "bg-slate-100 text-slate-600"}`}
                        >
                          <Tag className="w-3 h-3" />
                          {sop.category}
                        </span>

                        {/* Divider */}
                        <span className="w-px h-4 bg-slate-200" />

                        {/* Author */}
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <User className="w-3 h-3" />
                          {sop.author}
                        </span>

                        {/* Last Updated */}
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(sop.lastUpdated).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Steps Count + Arrow */}
                    <div className="flex items-center gap-3 flex-shrink-0 pt-1">
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-700">{sop.steps.length}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">steps</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0095D6] group-hover:translate-x-0.5 transition-all" />
                    </div>
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
