"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  Shield,
  FileText,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Play,
  Pencil,
  History,
  ArrowLeft,
  User,
  Calendar,
  Tag,
  BadgeCheck,
  PenLine,
  Thermometer,
  Zap,
  Gauge,
  RotateCcw,
  Wrench,
  ClipboardCheck,
  Server,
} from "lucide-react";
import { sops, dataCenters, assets } from "@/lib/mock-data";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active: {
    label: "Active",
    color: "bg-emerald-100 text-emerald-700 ring-emerald-300",
    icon: <BadgeCheck className="w-4 h-4" />,
  },
  draft: {
    label: "Draft",
    color: "bg-yellow-100 text-yellow-700 ring-yellow-300",
    icon: <PenLine className="w-4 h-4" />,
  },
};

const categoryColors: Record<string, string> = {
  HVAC: "bg-blue-100 text-blue-700",
  Electrical: "bg-purple-100 text-purple-700",
};

// Pre-execution checks for different categories
const preExecutionChecks: Record<string, string[]> = {
  HVAC: [
    "Verify all personnel have PPE (gloves, safety glasses)",
    "Confirm BMS operator is on standby",
    "Check weather forecast for next 4 hours",
    "Ensure backup cooling path is available",
    "Verify communication channel with NOC",
  ],
  Electrical: [
    "Verify all personnel have PPE (arc flash rated)",
    "Confirm lockout/tagout procedures completed",
    "Check redundant power path is energized",
    "Ensure fire suppression is armed",
    "Verify communication channel with NOC",
    "Confirm utility notification if required",
  ],
};

const rollbackInstructions: Record<string, string[]> = {
  "sop-001": [
    "Immediately restart primary chiller if standby fails to hold load",
    "Close isolation valves on standby unit",
    "Reset condenser water pump to primary circuit",
    "Monitor CHW temps — escalate if >50°F for more than 5 minutes",
  ],
  "sop-002": [
    "Disengage transfer switch and return to grid (if available)",
    "Ramp down BESS discharge to 0 kW over 2 minutes",
    "Engage emergency generator if grid is unavailable",
    "Contact utility for outage timeline update",
  ],
  "sop-003": [
    "Close economizer dampers immediately",
    "Engage mechanical cooling (lead chiller)",
    "Reset AHU to normal mixed-air mode",
    "Verify zone temperatures return within spec in 15 minutes",
  ],
  "sop-004": [
    "Return UPS to bypass mode if battery installation fails",
    "Re-connect original battery string",
    "Verify DC bus voltage is stable (380-440V)",
    "Schedule follow-up maintenance window",
  ],
};

// Map SOP categories to relevant equipment
function getRelevantEquipment(sop: (typeof sops)[0]) {
  if (sop.category === "HVAC") {
    return assets.filter((a) => ["Chiller", "AHU", "Cooling Tower"].includes(a.type));
  }
  if (sop.category === "Electrical") {
    return assets.filter((a) => ["UPS", "BESS"].includes(a.type));
  }
  return assets;
}

function paramIcon(param: string) {
  if (param.toLowerCase().includes("temp")) return <Thermometer className="w-4 h-4 text-orange-500" />;
  if (param.toLowerCase().includes("current") || param.toLowerCase().includes("voltage"))
    return <Zap className="w-4 h-4 text-yellow-500" />;
  return <Gauge className="w-4 h-4 text-blue-500" />;
}

export default function SOPDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dcId = params.dcId as string;
  const sopId = params.sopId as string;
  const dc = dataCenters.find((d) => d.id === dcId) ?? dataCenters[0];
  const sop = sops.find((s) => s.id === sopId) ?? sops[0];
  const status = statusConfig[sop.status];
  const relevantEquipment = getRelevantEquipment(sop);
  const checks = preExecutionChecks[sop.category] ?? preExecutionChecks.HVAC;
  const rollback = rollbackInstructions[sop.id] ?? rollbackInstructions["sop-001"];

  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [checkedPre, setCheckedPre] = useState<Set<number>>(new Set());

  const toggleStep = (i: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const togglePre = (i: number) => {
    setCheckedPre((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <button onClick={() => router.push(`/dc/${dcId}`)} className="hover:text-[#001C77] transition-colors">
              {dc.name}
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button
              onClick={() => router.push(`/dc/${dcId}/sop`)}
              className="hover:text-[#001C77] transition-colors"
            >
              SOPs
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#001C77] font-medium">{sop.id.toUpperCase()}</span>
          </div>

          {/* Title Block */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-[#001C77]/10 flex items-center justify-center">
                  <Shield className="w-5.5 h-5.5 text-[#001C77]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{sop.title}</h1>
                  <span className="text-xs text-slate-400 font-mono">{sop.id.toUpperCase()}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 ml-[56px]">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-600">
                  v{sop.version}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ring-inset ${status.color}`}
                >
                  {status.icon}
                  {status.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${categoryColors[sop.category] ?? "bg-slate-100 text-slate-600"}`}
                >
                  <Tag className="w-3 h-3" />
                  {sop.category}
                </span>
                <span className="w-px h-4 bg-slate-200" />
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <User className="w-3.5 h-3.5" />
                  {sop.author}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(sop.lastUpdated).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                <Play className="w-4 h-4" />
                Execute SOP
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-slate-700 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-slate-700 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">
                <History className="w-4 h-4" />
                History
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* Safety Boundaries */}
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Safety Boundaries</h2>
              <p className="text-xs text-slate-500">Operating limits that must be maintained during execution</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Parameter
                  </th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Minimum
                  </th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Maximum
                  </th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Unit
                  </th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Range
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sop.safetyBoundaries.map((b, i) => {
                  const range = b.max - b.min;
                  // Simulate a "current" value near mid-range (slightly high for visual interest)
                  const simulated = b.min + range * (0.55 + i * 0.1);
                  const pct = ((simulated - b.min) / range) * 100;
                  const nearLimit = pct > 80 || pct < 20;
                  return (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-800 flex items-center gap-2">
                        {paramIcon(b.param)}
                        {b.param}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-xs font-medium">
                          {b.min}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-block px-2 py-0.5 rounded bg-red-50 text-red-700 font-mono text-xs font-medium">
                          {b.max}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center text-slate-500">{b.unit}</td>
                      <td className="px-5 py-3.5">
                        <div className="w-full max-w-[180px] mx-auto">
                          <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`absolute left-0 top-0 h-full rounded-full transition-all ${
                                nearLimit ? "bg-amber-400" : "bg-emerald-400"
                              }`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                            <span>{b.min}</span>
                            <span
                              className={`font-semibold ${nearLimit ? "text-amber-600" : "text-emerald-600"}`}
                            >
                              {simulated.toFixed(1)} {b.unit}
                            </span>
                            <span>{b.max}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Procedure Steps */}
          <section className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#001C77]/10 flex items-center justify-center">
                <ClipboardCheck className="w-4 h-4 text-[#001C77]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Procedure Steps</h2>
                <p className="text-xs text-slate-500">
                  {checkedSteps.size}/{sop.steps.length} completed
                </p>
              </div>
            </div>
            <div className="p-5 space-y-1.5">
              {/* Progress bar */}
              <div className="mb-4">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00C6C1] rounded-full transition-all duration-300"
                    style={{ width: `${(checkedSteps.size / sop.steps.length) * 100}%` }}
                  />
                </div>
              </div>
              {sop.steps.map((step, i) => {
                const done = checkedSteps.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleStep(i)}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                      done ? "bg-emerald-50/60" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex-shrink-0 mt-0.5">
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </span>
                    <span className="flex items-start gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span
                        className={`text-sm ${done ? "text-slate-400 line-through" : "text-slate-700"}`}
                      >
                        {step}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Pre-execution Checks */}
          <section className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Pre-execution Checks</h2>
                <p className="text-xs text-slate-500">
                  {checkedPre.size}/{checks.length} verified
                </p>
              </div>
            </div>
            <div className="p-5 space-y-1.5">
              {/* Progress bar */}
              <div className="mb-4">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${(checkedPre.size / checks.length) * 100}%` }}
                  />
                </div>
              </div>
              {checks.map((check, i) => {
                const done = checkedPre.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => togglePre(i)}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                      done ? "bg-amber-50/60" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex-shrink-0 mt-0.5">
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-amber-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </span>
                    <span className={`text-sm ${done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                      {check}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Equipment Configuration */}
        <section className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0095D6]/10 flex items-center justify-center">
              <Server className="w-4 h-4 text-[#0095D6]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Equipment Configuration</h2>
              <p className="text-xs text-slate-500">
                {relevantEquipment.length} relevant asset{relevantEquipment.length !== 1 ? "s" : ""} for this
                procedure
              </p>
            </div>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relevantEquipment.map((eq) => (
              <div
                key={eq.id}
                className="rounded-lg border border-slate-200 p-4 hover:border-[#0095D6]/30 transition-colors"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{eq.name}</h4>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">{eq.type}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {Object.entries(eq.telemetry)
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
              </div>
            ))}
          </div>
        </section>

        {/* Rollback Steps */}
        <section className="bg-white rounded-xl border border-red-100">
          <div className="px-5 py-4 border-b border-red-50 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <RotateCcw className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Rollback Steps</h2>
              <p className="text-xs text-slate-500">
                Execute in sequence if procedure must be aborted
              </p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {rollback.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-xs font-bold text-red-600 flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Back */}
        <div className="pt-2 pb-8">
          <button
            onClick={() => router.push(`/dc/${dcId}/sop`)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#001C77] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to SOP List
          </button>
        </div>
      </div>
    </div>
  );
}
