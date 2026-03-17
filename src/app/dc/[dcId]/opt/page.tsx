"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  DollarSign,
  TrendingDown,
  Battery,
  ShieldCheck,
  Check,
  X,
  Download,
  ClipboardList,
  Zap,
  Thermometer,
  SlidersHorizontal,
} from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  ReferenceLine,
} from "recharts";
import { generateOptimizationData } from "@/lib/mock-data";

/* ---------- brand colors ---------- */
const NAVY = "#001C77";
const TEAL = "#00C6C1";
const BLUE = "#0095D6";
const RED = "#EF4444";
const ORANGE = "#F97316";

/* ---------- tooltip type ---------- */
interface TPayloadItem {
  dataKey?: string | number;
  name?: string;
  value?: number | string;
  color?: string;
}
interface TTooltipProps {
  active?: boolean;
  payload?: readonly TPayloadItem[];
  label?: string;
}

/* ---------- custom tooltips ---------- */
function LoadTooltip({ active, payload, label }: TTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 text-xs">
      <p className="font-semibold text-gray-800 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={String(p.dataKey ?? i)} className="flex items-center gap-2 py-0.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: p.color }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-medium text-gray-800">
            {typeof p.value === "number"
              ? p.dataKey === "price"
                ? `$${p.value.toFixed(3)}/kWh`
                : `${p.value.toLocaleString()} kW`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function SocTooltip({ active, payload, label }: TTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 text-xs">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: TEAL }} />
        <span className="text-gray-500">State of Charge:</span>
        <span className="font-medium text-gray-800">{payload[0].value}%</span>
      </div>
    </div>
  );
}

function TempTooltip({ active, payload, label }: TTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 text-xs">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: BLUE }} />
        <span className="text-gray-500">CHW Supply Temp:</span>
        <span className="font-medium text-gray-800">
          {typeof payload[0].value === "number" ? payload[0].value.toFixed(1) : payload[0].value}°F
        </span>
      </div>
    </div>
  );
}

/* ---------- main component ---------- */
export default function OptimizationPage() {
  const data = useMemo(() => generateOptimizationData(), []);

  /* slider state (visual only) */
  const [demandCap, setDemandCap] = useState(5500);
  const [reserveSoc, setReserveSoc] = useState(20);
  const [chwRange, setChwRange] = useState([42, 48]);

  /* action state */
  const [planStatus, setPlanStatus] = useState<"pending" | "approved" | "rejected">("pending");

  /* validation checks */
  const checks = [
    { label: "Thermal comfort within ASHRAE TC 9.9 envelope", pass: true },
    { label: "BESS SOC never below 10% reserve floor", pass: true },
    { label: "Peak demand stays under contractual cap (6,000 kW)", pass: true },
    { label: "All equipment within rated operating limits", pass: true },
    { label: "Ramp rates within manufacturer specifications", pass: true },
  ];

  /* KPI cards data */
  const kpis = [
    {
      label: "Net Savings",
      value: "$12,400",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      sub: "vs. baseline schedule",
    },
    {
      label: "Peak Demand Reduction",
      value: "15%",
      icon: TrendingDown,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      sub: "12:00 - 16:00 window",
    },
    {
      label: "BESS Cycles",
      value: "2",
      icon: Battery,
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-200",
      sub: "charge + discharge",
    },
    {
      label: "Risk Score",
      value: "Low",
      icon: ShieldCheck,
      color: "text-navy",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      sub: "all constraints satisfied",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: TEAL }} />
              Day-Ahead Optimization
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              DC Site 001 (Atlanta) &mdash; 24-hour energy plan
            </p>
          </div>

          {/* date selector */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">March 17, 2026</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className={`bg-white rounded-xl border ${kpi.border} p-5 flex items-start gap-4 shadow-sm`}
            >
              <div className={`w-11 h-11 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {kpi.label}
                </p>
                <p className={`text-2xl font-bold mt-0.5 ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* LOAD PROFILE CHART */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">24-Hour Load Profile</h2>
          <p className="text-xs text-gray-500 mb-4">
            Stacked load breakdown with grid draw and energy price overlay
          </p>
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
                label={{
                  value: "Power (kW)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                  style: { fontSize: 11, fill: "#94a3b8" },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `$${v.toFixed(2)}`}
                domain={[0, 0.2]}
                label={{
                  value: "Price ($/kWh)",
                  angle: 90,
                  position: "insideRight",
                  offset: 10,
                  style: { fontSize: 11, fill: "#94a3b8" },
                }}
              />
              <Tooltip content={(props) => <LoadTooltip {...(props as TTooltipProps)} />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="rect"
                iconSize={10}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Bar
                yAxisId="left"
                dataKey="itLoad"
                name="IT Load"
                stackId="load"
                fill={NAVY}
                radius={[0, 0, 0, 0]}
                barSize={20}
              />
              <Bar
                yAxisId="left"
                dataKey="hvacLoad"
                name="HVAC Load"
                stackId="load"
                fill={BLUE}
                radius={[0, 0, 0, 0]}
                barSize={20}
              />
              <Bar
                yAxisId="left"
                dataKey="bessCharge"
                name="BESS Charge"
                stackId="load"
                fill={TEAL}
                radius={[2, 2, 0, 0]}
                barSize={20}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="gridDraw"
                name="Grid Draw"
                stroke={RED}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: RED, stroke: "#fff", strokeWidth: 2 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="price"
                name="Energy Price"
                stroke={ORANGE}
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
                activeDot={{ r: 4, fill: ORANGE, stroke: "#fff", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </section>

        {/* SOC + CHW TEMP CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BESS State of Charge */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-1">
              <Battery className="w-4 h-4" style={{ color: TEAL }} />
              <h2 className="text-base font-semibold text-gray-900">BESS State of Charge</h2>
            </div>
            <p className="text-xs text-gray-500 mb-4">24-hour projected SOC trajectory</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="socGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TEAL} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={TEAL} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip content={(props) => <SocTooltip {...(props as TTooltipProps)} />} />
                <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1} />
                <Area
                  type="monotone"
                  dataKey="soc"
                  name="SOC"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  fill="url(#socGrad)"
                  activeDot={{ r: 5, fill: TEAL, stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Dashed red line = 20% reserve floor
            </p>
          </section>

          {/* CHW Supply Temperature */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="w-4 h-4" style={{ color: BLUE }} />
              <h2 className="text-base font-semibold text-gray-900">CHW Supply Temperature</h2>
            </div>
            <p className="text-xs text-gray-500 mb-4">Chilled water setpoint tracking</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  domain={[40, 50]}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${v}\u00B0F`}
                />
                <Tooltip content={(props) => <TempTooltip {...(props as TTooltipProps)} />} />
                <ReferenceLine y={42} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1} />
                <ReferenceLine y={48} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1} />
                <Line
                  type="monotone"
                  dataKey="chwTemp"
                  name="CHW Supply"
                  stroke={BLUE}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: BLUE, stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Dashed gray lines = 42-48°F safety bounds
            </p>
          </section>
        </div>

        {/* POLICY CONTROLS + VALIDATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Policy Controls */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4" style={{ color: NAVY }} />
              <h2 className="text-base font-semibold text-gray-900">Policy Controls</h2>
            </div>

            <div className="space-y-6">
              {/* Demand Cap */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Demand Cap</label>
                  <span className="text-sm font-semibold" style={{ color: NAVY }}>
                    {demandCap.toLocaleString()} kW
                  </span>
                </div>
                <input
                  type="range"
                  min={4000}
                  max={7000}
                  step={100}
                  value={demandCap}
                  onChange={(e) => setDemandCap(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${NAVY} ${((demandCap - 4000) / 3000) * 100}%, #e2e8f0 ${((demandCap - 4000) / 3000) * 100}%)`,
                  }}
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>4,000 kW</span>
                  <span>7,000 kW</span>
                </div>
              </div>

              {/* Reserve SOC */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Reserve SOC</label>
                  <span className="text-sm font-semibold" style={{ color: TEAL }}>
                    {reserveSoc}%
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={1}
                  value={reserveSoc}
                  onChange={(e) => setReserveSoc(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${TEAL} ${((reserveSoc - 5) / 45) * 100}%, #e2e8f0 ${((reserveSoc - 5) / 45) * 100}%)`,
                  }}
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>5%</span>
                  <span>50%</span>
                </div>
              </div>

              {/* CHW Temp Range */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">CHW Temp Range</label>
                  <span className="text-sm font-semibold" style={{ color: BLUE }}>
                    {chwRange[0]}{"\u00B0"}F - {chwRange[1]}{"\u00B0"}F
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 mb-1">Min</p>
                    <input
                      type="range"
                      min={38}
                      max={45}
                      step={1}
                      value={chwRange[0]}
                      onChange={(e) =>
                        setChwRange([Number(e.target.value), chwRange[1]])
                      }
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${BLUE} ${((chwRange[0] - 38) / 7) * 100}%, #e2e8f0 ${((chwRange[0] - 38) / 7) * 100}%)`,
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 mb-1">Max</p>
                    <input
                      type="range"
                      min={45}
                      max={55}
                      step={1}
                      value={chwRange[1]}
                      onChange={(e) =>
                        setChwRange([chwRange[0], Number(e.target.value)])
                      }
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${BLUE} ${((chwRange[1] - 45) / 10) * 100}%, #e2e8f0 ${((chwRange[1] - 45) / 10) * 100}%)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Validation Checks */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-4 h-4" style={{ color: NAVY }} />
              <h2 className="text-base font-semibold text-gray-900">Validation Checks</h2>
            </div>
            <div className="space-y-3">
              {checks.map((check) => (
                <div
                  key={check.label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                    check.pass
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-red-50/50 border-red-200"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      check.pass ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  >
                    {check.pass ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{check.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">
                  All 5 of 5 checks passed
                </span>
              </div>
              <p className="text-xs text-emerald-600 mt-1">
                This plan meets all safety and operational constraints. Ready for approval.
              </p>
            </div>
          </section>
        </div>

        {/* ACTION BAR */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {planStatus === "pending" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Pending Review
                </span>
              )}
              {planStatus === "approved" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  Plan Approved
                </span>
              )}
              {planStatus === "rejected" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  <X className="w-3.5 h-3.5" />
                  Plan Rejected
                </span>
              )}
              <p className="text-xs text-gray-500">
                Generated by Action Planner at 08:00 AM &bull; Requires operator approval
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Audit Trail
              </button>
              <button className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={() => setPlanStatus("rejected")}
                disabled={planStatus !== "pending"}
                className="text-sm font-semibold px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => setPlanStatus("approved")}
                disabled={planStatus !== "pending"}
                className="text-sm font-semibold px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Approve Plan
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
