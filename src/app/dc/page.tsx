"use client";

import Link from "next/link";
import { dataCenters } from "@/lib/mock-data";
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
} from "lucide-react";

export default function DataCentersPage() {
  const totalPower = dataCenters.reduce(
    (sum, dc) => sum + dc.metrics.power,
    0
  );
  const avgPUE =
    dataCenters.reduce((sum, dc) => sum + dc.metrics.pue, 0) /
    dataCenters.length;
  const siteCount = dataCenters.length;

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Data Center Operations
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor and manage all site operations across your portfolio
        </p>
      </div>

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
              Active Sites
            </p>
            <p className="text-2xl font-bold text-gray-900">{siteCount}</p>
          </div>
        </div>
      </div>

      {/* Site Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {dataCenters.map((dc) => (
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
                {dc.reviewNeeded && (
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
    </div>
  );
}
