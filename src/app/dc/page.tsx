"use client";

import Link from "next/link";
import { dataCenters } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import {
  Zap,
  Gauge,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Server,
  Wind,
  Battery,
  Building2,
  ArrowRight,
  ShieldAlert,
  Lock,
  Eye,
  Bot,
  Wrench,
} from "lucide-react";

export default function DataCentersPage() {
  const { currentUser, canAccessSite, isVendor, hasPermission } = useAuth();

  // Filter sites based on user scope
  const accessibleSites = dataCenters.filter((dc) => canAccessSite(dc.id));
  const inaccessibleSites = dataCenters.filter((dc) => !canAccessSite(dc.id));

  const totalPower = accessibleSites.reduce((sum, dc) => sum + dc.metrics.power, 0);
  const avgPUE = accessibleSites.length > 0
    ? accessibleSites.reduce((sum, dc) => sum + dc.metrics.pue, 0) / accessibleSites.length
    : 0;
  const siteCount = accessibleSites.length;

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isVendor ? "Service Portal" : "Data Center Operations"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isVendor
            ? `Viewing assigned devices at ${siteCount} site${siteCount !== 1 ? "s" : ""}`
            : `Monitor and manage ${currentUser.scopeLevel === "portfolio" ? "all" : "your assigned"} site operations`}
        </p>
      </div>

      {/* Scope Banner for non-admin users */}
      {currentUser.role !== "super_admin" && (
        <div className="mb-6 bg-navy/5 border border-navy/10 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center shrink-0">
            {isVendor ? (
              <Wrench className="w-5 h-5 text-navy" />
            ) : currentUser.permissions.includes("read") && !currentUser.permissions.includes("write") ? (
              <Eye className="w-5 h-5 text-navy" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-navy" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800">
              {isVendor
                ? `Service access — ${currentUser.scopedDevices?.length || 0} assigned devices`
                : `Scope: ${currentUser.scopeLevel.charAt(0).toUpperCase() + currentUser.scopeLevel.slice(1)} level — ${siteCount} site${siteCount !== 1 ? "s" : ""}`}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {isVendor
                ? "View-only telemetry for assigned devices. Export and download are disabled."
                : `Permissions: ${currentUser.permissions.join(", ")}`}
            </p>
          </div>
          {currentUser.agentPermissions.length > 0 && (
            <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue/10 border border-blue/20">
              <Bot className="w-3.5 h-3.5 text-blue" />
              <span className="text-[11px] font-medium text-blue">Agent Access</span>
            </div>
          )}
        </div>
      )}

      {/* Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Total Power
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {totalPower.toLocaleString()}{" "}
              <span className="text-sm font-normal text-gray-400">kW</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center">
            <Gauge className="w-6 h-6 text-teal" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Avg PUE
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {avgPUE.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-navy" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {isVendor ? "Assigned Sites" : "Accessible Sites"}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {siteCount}
              {!isVendor && currentUser.role !== "super_admin" && (
                <span className="text-sm font-normal text-gray-400"> / {dataCenters.length}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Accessible Site Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {accessibleSites.map((dc) => (
          <Link
            key={dc.id}
            href={`/dc/${dc.id}`}
            className="group bg-white rounded-xl border border-gray-200 hover:border-teal/40 hover:shadow-lg hover:shadow-teal/5 transition-all duration-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    dc.status === "operational"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-navy transition-colors">
                    {dc.name}
                  </h3>
                  <p className="text-xs text-gray-400">{dc.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {dc.reviewNeeded && hasPermission("approve") && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-200">
                    <AlertTriangle className="w-3 h-3" />
                    Review Needed
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    dc.status === "operational"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}
                >
                  {dc.status === "operational" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {dc.status === "operational" ? "Operational" : "Warning"}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Zap className="w-3.5 h-3.5 text-blue" />
                    <span className="text-xs text-gray-500">Power</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {dc.metrics.power.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400">kW</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Gauge className="w-3.5 h-3.5 text-teal" />
                    <span className="text-xs text-gray-500">PUE</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {dc.metrics.pue.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-gray-400">ratio</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-xs text-gray-500">Temp</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {dc.metrics.temperature}
                  </p>
                  <p className="text-[10px] text-gray-400">&deg;F</p>
                </div>
              </div>

              {/* Equipment Summary */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5" />
                    {dc.equipment.chillers} Chillers
                  </span>
                  <span className="flex items-center gap-1">
                    <Server className="w-3.5 h-3.5" />
                    {dc.equipment.ahu} AHU
                  </span>
                  <span className="flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5" />
                    {dc.equipment.bess} BESS
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    {dc.equipment.ups} UPS
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-teal group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Inaccessible Sites (shown as locked cards) */}
      {inaccessibleSites.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Outside your scope ({inaccessibleSites.length} site{inaccessibleSites.length !== 1 ? "s" : ""})
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
            {inaccessibleSites.map((dc) => (
              <div
                key={dc.id}
                className="bg-slate-50 rounded-xl border border-slate-200 p-5 opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-500">{dc.name}</h3>
                    <p className="text-xs text-slate-400">{dc.location} — Access restricted</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

