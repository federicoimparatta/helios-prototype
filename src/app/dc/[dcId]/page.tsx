"use client";

import { useParams } from "next/navigation";
import { dataCenters, auditLogs } from "@/lib/mock-data";
import {
  Zap,
  Gauge,
  Thermometer,
  Activity,
  CircuitBoard,
  Server,
  Wind,
  Battery,
  Snowflake,
  Fan,
  AlertTriangle,
  Clock,
  Play,
  Calendar,
  Bot,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function DCOverviewPage() {
  const params = useParams();
  const dcId = params.dcId as string;
  const dc = dataCenters.find((d) => d.id === dcId);

  if (!dc) return null;

  const kpis = [
    {
      label: "Power",
      value: `${dc.metrics.power.toLocaleString()} kW`,
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-50",
      trend: "+2.3%",
      trendUp: true,
    },
    {
      label: "PUE",
      value: dc.metrics.pue.toFixed(2),
      icon: Gauge,
      color: "text-blue",
      bg: "bg-sky-50",
      trend: "-0.04",
      trendUp: false,
    },
    {
      label: "Temperature",
      value: `${dc.metrics.temperature}°F`,
      icon: Thermometer,
      color: "text-red-500",
      bg: "bg-red-50",
      trend: "+0.3°F",
      trendUp: true,
    },
    {
      label: "Voltage",
      value: `${dc.metrics.voltage} V`,
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      trend: "Stable",
      trendUp: false,
    },
    {
      label: "Current",
      value: `${dc.metrics.current.toLocaleString()} A`,
      icon: CircuitBoard,
      color: "text-purple-500",
      bg: "bg-purple-50",
      trend: "+1.8%",
      trendUp: true,
    },
  ];

  const equipmentItems = [
    { label: "UPS Units", count: dc.equipment.ups, icon: Zap, color: "text-amber-600" },
    { label: "PDUs", count: dc.equipment.pdu, icon: Server, color: "text-blue" },
    { label: "Chillers", count: dc.equipment.chillers, icon: Snowflake, color: "text-cyan-600" },
    { label: "AHUs", count: dc.equipment.ahu, icon: Fan, color: "text-teal" },
    { label: "Cooling Towers", count: dc.equipment.coolingTowers, icon: Wind, color: "text-indigo-500" },
    { label: "BESS", count: dc.equipment.bess, icon: Battery, color: "text-emerald-600" },
  ];

  const recentAlerts = auditLogs.slice(0, 3);

  const severityStyles: Record<string, string> = {
    info: "bg-blue/10 text-blue border-blue/20",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const actionLabels: Record<string, string> = {
    "optimization.approved": "Optimization Approved",
    "sop.version_created": "SOP Updated",
    "agent.alert": "Agent Alert",
    "bess.discharge_started": "BESS Discharge",
    "recommendation.denied": "Rec. Denied",
    "optimization.generated": "Optimization Generated",
    "bess.charge_started": "BESS Charging",
    "sop.executed": "SOP Executed",
  };

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    kpi.trendUp ? "text-amber-600" : "text-emerald-600"
                  }`}
                >
                  {kpi.label === "Voltage" ? null : kpi.trendUp ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{kpi.trend}</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-slate-900 group-hover:text-navy transition-colors">
                {kpi.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Equipment Summary + Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Summary */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Equipment Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {equipmentItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-300 transition-colors">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {item.count}
                    </p>
                    <p className="text-xs text-slate-500">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Activity
            </h2>
            <AlertTriangle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-3">
            {recentAlerts.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      log.severity === "warning"
                        ? "bg-amber-400"
                        : "bg-blue"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${severityStyles[log.severity]}`}
                      >
                        {log.severity}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {log.target}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                      <span className="text-slate-300">|</span>
                      <span>{log.user}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-lg hover:bg-navy-light transition-all text-sm font-medium shadow-sm hover:shadow-md group">
            <Play className="w-4 h-4" />
            Run Optimization
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium">
            <Calendar className="w-4 h-4 text-blue" />
            View Schedule
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal/10 text-teal-dark border border-teal/20 rounded-lg hover:bg-teal/20 transition-all text-sm font-medium">
            <Bot className="w-4 h-4" />
            AI Assistant
          </button>
        </div>
      </div>
    </div>
  );
}
