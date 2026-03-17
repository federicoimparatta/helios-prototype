"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { dataCenters } from "@/lib/mock-data";
import {
  LayoutDashboard,
  Share2,
  Server,
  FileText,
  Lightbulb,
  BarChart3,
  Bot,
  ClipboardList,
  ChevronRight,
  MapPin,
} from "lucide-react";

const tabs = [
  { label: "Overview", slug: "", icon: LayoutDashboard },
  { label: "Knowledge Graph", slug: "/kg", icon: Share2 },
  { label: "Assets", slug: "/assets", icon: Server },
  { label: "SOPs", slug: "/sops", icon: FileText },
  { label: "Recommendations", slug: "/recommendations", icon: Lightbulb },
  { label: "Optimization", slug: "/optimization", icon: BarChart3 },
  { label: "Agents", slug: "/agents", icon: Bot },
  { label: "Audit", slug: "/audit", icon: ClipboardList },
];

export default function DCDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const dcId = params.dcId as string;

  const dc = dataCenters.find((d) => d.id === dcId);

  if (!dc) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-200 mb-4">404</h1>
          <p className="text-xl text-slate-500 mb-6">Data center not found</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors text-sm font-medium"
          >
            Back to Sites
          </Link>
        </div>
      </div>
    );
  }

  const basePath = `/dc/${dcId}`;

  function isActive(slug: string) {
    if (slug === "") {
      return pathname === basePath || pathname === basePath + "/";
    }
    return pathname.startsWith(basePath + slug);
  }

  const statusColors: Record<string, string> = {
    operational: "bg-emerald-500",
    warning: "bg-amber-500",
    critical: "bg-red-500",
    offline: "bg-slate-400",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 pt-4 pb-2 text-sm">
            <Link
              href="/"
              className="text-slate-400 hover:text-navy transition-colors"
            >
              Sites
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-700 font-medium">{dc.name}</span>
          </div>

          {/* Site Title Row */}
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${statusColors[dc.status]} ring-4 ring-opacity-20 ${
                  dc.status === "operational"
                    ? "ring-emerald-500"
                    : dc.status === "warning"
                      ? "ring-amber-500"
                      : "ring-slate-400"
                }`}
              />
              <h1 className="text-2xl font-bold text-slate-900">{dc.name}</h1>
              <div className="flex items-center gap-1 text-sm text-slate-500 ml-2">
                <MapPin className="w-3.5 h-3.5" />
                {dc.location}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                  dc.status === "operational"
                    ? "bg-emerald-50 text-emerald-700"
                    : dc.status === "warning"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {dc.status}
              </span>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex items-center gap-1 -mb-px overflow-x-auto">
            {tabs.map((tab) => {
              const active = isActive(tab.slug);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.slug}
                  href={`${basePath}${tab.slug}`}
                  className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    active
                      ? "border-navy text-navy"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      active
                        ? "text-navy"
                        : "text-slate-400 group-hover:text-slate-500"
                    }`}
                  />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-[1440px] mx-auto px-6 py-6">{children}</div>
    </div>
  );
}
