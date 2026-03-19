"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  GitBranch,
  FileUp,
  Radio,
  ShieldCheck,
  Rocket,
  Plus,
  Trash2,
  Upload,
  X,
  Globe,
  Building2,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  Snowflake,
  Fan,
  Battery,
  Users,
  Bot,
  Lock,
  Wrench,
  Eye,
} from "lucide-react";
import {
  onboardingSteps,
  dataCenters,
  orgHierarchy,
  exampleHierarchies,
  ontologySources,
  ontologyMappingSteps,
  roleLabels,
} from "@/lib/mock-data";

const stepIcons = [MapPin, GitBranch, FileUp, Radio, ShieldCheck, Rocket];

const tierOptions = ["Tier I", "Tier II", "Tier III", "Tier IV"];
const protocolOptions = ["Modbus TCP", "BACnet/IP", "OPC-UA", "MQTT", "SNMP"];

export default function OnboardPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 state
  const [siteName, setSiteName] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [capacity, setCapacity] = useState("");
  const [tier, setTier] = useState("Tier III");

  // Step 2 state (org hierarchy)
  const [hierarchyType, setHierarchyType] = useState("geographic");
  const [selectedParent, setSelectedParent] = useState("region-west");

  // Step 3 state (ontology)
  const [ontologyStep, setOntologyStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  // Step 4 state (telemetry)
  const [protocol, setProtocol] = useState("BACnet/IP");
  const [endpoint, setEndpoint] = useState("");
  const [pollingInterval, setPollingInterval] = useState("30");

  // Step 5 state (access control)
  const [assignees, setAssignees] = useState([
    { name: "Federico Imparatta", role: "super_admin", permissions: ["read", "write", "admin", "agent_interact"] },
    { name: "", role: "operator", permissions: ["read", "write"] },
  ]);

  function next() {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  }

  function back() {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }

  function removeAssignee(index: number) {
    setAssignees((prev) => prev.filter((_, i) => i !== index));
  }

  function addAssignee() {
    setAssignees((prev) => [...prev, { name: "", role: "operator", permissions: ["read", "write"] }]);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 py-5">
          <div className="flex items-center gap-2 text-sm mb-3">
            <Link href="/admin" className="text-slate-400 hover:text-navy transition-colors">
              Admin
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-medium">Onboard New Site</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Data Center Onboarding</h1>
          <p className="text-sm text-slate-500 mt-0.5">Complete all steps to activate a new site</p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Step Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 mx-10" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-teal mx-10 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (onboardingSteps.length - 1)) * (100 - (100 / onboardingSteps.length))}%` }}
            />

            {onboardingSteps.map((step) => {
              const Icon = stepIcons[step.id - 1];
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className="relative flex flex-col items-center gap-2 z-10"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isCompleted
                        ? "bg-teal text-white shadow-md shadow-teal/20"
                        : isCurrent
                          ? "bg-teal text-white ring-4 ring-teal/20 shadow-md shadow-teal/20"
                          : "bg-white text-slate-400 border-2 border-slate-200"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4.5 h-4.5" />}
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-xs font-semibold ${
                        isCurrent ? "text-teal-dark" : isCompleted ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-8 py-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-teal/10 text-teal-dark text-xs font-bold">
                {currentStep}
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {onboardingSteps[currentStep - 1].title}
                </h2>
                <p className="text-sm text-slate-500">
                  {onboardingSteps[currentStep - 1].description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Step 1: Site Overview */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Site Name</label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      placeholder="e.g., DC-West-02 (Seattle)"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Seattle, WA"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Latitude</label>
                    <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)}
                      placeholder="47.6062" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Longitude</label>
                    <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)}
                      placeholder="-122.3321" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Total Capacity (MW)</label>
                    <input type="text" value={capacity} onChange={(e) => setCapacity(e.target.value)}
                      placeholder="10" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tier Level</label>
                    <select value={tier} onChange={(e) => setTier(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all appearance-none cursor-pointer bg-white">
                      {tierOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: UC2 — Org Hierarchy Placement */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-navy/5 border border-navy/10 rounded-xl p-4">
                  <p className="text-xs text-navy font-semibold mb-1">UC2: Custom Org Hierarchy</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Place this site within the customer&apos;s organizational structure. The hierarchy is fully customizable —
                    the permission scoping from UC1 rides on top of whatever structure the customer defines.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Hierarchy Structure</label>
                  <div className="flex items-center gap-1.5 mb-4">
                    {orgHierarchy.levels.map((level, i) => (
                      <span key={level} className="flex items-center gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-navy/5 text-[10px] font-semibold text-navy uppercase tracking-wider">
                          {level}
                        </span>
                        {i < orgHierarchy.levels.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Place Under (Parent Node)</label>
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                    {orgHierarchy.nodes
                      .filter((n) => n.level !== "Site")
                      .map((node) => (
                        <label
                          key={node.id}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                            selectedParent === node.id ? "bg-navy/5" : "hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              selectedParent === node.id ? "bg-navy border-navy" : "border-slate-300 bg-white"
                            }`}
                            onClick={() => setSelectedParent(node.id)}
                          >
                            {selectedParent === node.id && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex items-center gap-2">
                            {node.level === "Portfolio" && <Globe className="w-4 h-4 text-purple-500" />}
                            {node.level === "Region" && <MapPin className="w-4 h-4 text-blue-500" />}
                            <span className="text-sm text-slate-700">{node.label}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase font-medium">
                              {node.level}
                            </span>
                          </div>
                        </label>
                      ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Or select a different hierarchy template</label>
                  <div className="grid grid-cols-2 gap-3">
                    {exampleHierarchies.map((ex) => (
                      <button
                        key={ex.customer}
                        className="text-left p-3 rounded-lg border border-slate-200 hover:border-navy/30 hover:bg-navy/5 transition-all"
                      >
                        <p className="text-sm font-semibold text-slate-800">{ex.customer}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{ex.levels.join(" > ")}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: UC5 — Ontology (As-Built → Equipment Topology) */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-navy/5 border border-navy/10 rounded-xl p-4">
                  <p className="text-xs text-navy font-semibold mb-1">UC5: Ontology-Driven Hierarchy Instantiation</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload as-built drawings (electrical SLD, mechanical layouts). The ontology maps real telemetry
                    data points from BMS/EPMS onto the corresponding equipment — producing the facility floor plan
                    with live readings on each node.
                  </p>
                </div>

                {/* Ontology Pipeline Steps */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">Ontology Pipeline</p>
                  <div className="grid grid-cols-4 gap-3">
                    {ontologyMappingSteps.map((step) => (
                      <div
                        key={step.step}
                        className={`p-3 rounded-lg border transition-all cursor-pointer ${
                          ontologyStep >= step.step
                            ? "border-teal/40 bg-teal/5"
                            : "border-slate-200"
                        }`}
                        onClick={() => setOntologyStep(step.step)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              ontologyStep > step.step
                                ? "bg-teal text-white"
                                : ontologyStep === step.step
                                  ? "bg-teal/20 text-teal-dark"
                                  : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {ontologyStep > step.step ? <Check className="w-3 h-3" /> : step.step}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-700">{step.label}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload As-Builts */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Step 1: Upload As-Built Drawings</p>
                  <div className="space-y-3">
                    {[
                      { key: "electrical", label: "Electrical Single-Line Diagram", desc: "PDF, DWG, or SVG — maps utility feed through to IT load", icon: Zap },
                      { key: "mechanical", label: "Mechanical / HVAC Layout", desc: "PDF or DWG — maps chiller plant, AHU distribution, thermal zones", icon: Fan },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.key}>
                          <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 hover:border-teal/40 transition-colors cursor-pointer group">
                            {uploadedFiles[item.key] ? (
                              <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <div className="flex-1">
                                  <span className="text-sm text-slate-700 font-medium">{uploadedFiles[item.key]}</span>
                                  <p className="text-[10px] text-emerald-600 mt-0.5">Parsed — 52 equipment nodes extracted</p>
                                </div>
                                <button
                                  onClick={() => {
                                    const updated = { ...uploadedFiles };
                                    delete updated[item.key];
                                    setUploadedFiles(updated);
                                  }}
                                  className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-teal/10 transition-colors">
                                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-teal transition-colors" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                                  <p className="text-xs text-slate-400">{item.desc}</p>
                                </div>
                                <Upload className="w-5 h-5 text-slate-300 ml-auto group-hover:text-teal transition-colors" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Ontology Result Preview */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-teal" />
                    Ontology Preview — Equipment Topology
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    This is what the Knowledge Graph will look like when the ontology maps telemetry to the as-builts.
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      { label: "Utility Feed", icon: Zap, children: "Site Main Switchgear" },
                      { label: "UPS / BESS / Gen", icon: Battery, children: "PDU → IT Load" },
                      { label: "Chillers → AHU", icon: Snowflake, children: "Cooling Towers → Zones" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="bg-white rounded-lg border border-slate-200 p-3">
                          <Icon className="w-5 h-5 text-teal mx-auto mb-1" />
                          <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                          <ArrowRight className="w-3 h-3 text-slate-300 mx-auto my-1 rotate-90" />
                          <p className="text-[10px] text-slate-400">{item.children}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mapped Data Sources */}
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                      Data Sources Mapped
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {ontologySources.map((src) => (
                        <div key={src.id} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              src.status === "mapped" || src.status === "connected" ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-slate-700 truncate">{src.filename}</p>
                            <p className="text-[9px] text-slate-400">
                              {src.pointsMapped}/{src.totalPoints} points mapped
                            </p>
                          </div>
                          <span className={`text-[9px] font-semibold uppercase ${
                            src.status === "mapped" || src.status === "connected" ? "text-emerald-600" : "text-amber-600"
                          }`}>
                            {src.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Telemetry Mapping */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-navy/5 border border-navy/10 rounded-xl p-4">
                  <p className="text-xs text-navy font-semibold mb-1">UC5: Telemetry → Ontology Mapping</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Connect BMS and EPMS data sources. Each telemetry point maps to an equipment node
                    in the ontology, creating the live facility floor plan.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Protocol</label>
                  <select value={protocol} onChange={(e) => setProtocol(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all appearance-none cursor-pointer bg-white">
                    {protocolOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Endpoint URL</label>
                  <input type="text" value={endpoint} onChange={(e) => setEndpoint(e.target.value)}
                    placeholder="e.g., bacnet://192.168.1.100:47808"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Polling Interval (seconds)</label>
                  <div className="flex items-center gap-4">
                    <input type="range" min="5" max="300" step="5" value={pollingInterval}
                      onChange={(e) => setPollingInterval(e.target.value)} className="flex-1 accent-teal" />
                    <span className="text-sm font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 min-w-[4rem] text-center">
                      {pollingInterval}s
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Connection Preview</h3>
                  <div className="space-y-1.5 text-xs font-mono text-slate-500">
                    <p>Protocol: <span className="text-teal-dark font-semibold">{protocol}</span></p>
                    <p>Endpoint: <span className="text-slate-700">{endpoint || "—"}</span></p>
                    <p>Poll Rate: <span className="text-slate-700">{pollingInterval}s</span></p>
                    <p>Status: <span className="text-amber-600">Pending configuration</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: UC1/UC3/UC4 — Access Control */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="bg-navy/5 border border-navy/10 rounded-xl p-4">
                  <p className="text-xs text-navy font-semibold mb-1">UC1 / UC3 / UC4: Access Control Setup</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Configure RBAC (read/write/admin), vendor service access for specific devices,
                    and agent interaction permissions — all scoped to this site within the org hierarchy.
                  </p>
                </div>

                {/* Permission Levels */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Permission Levels</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { level: "Read-Only", icon: Eye, desc: "View dashboards & telemetry", color: "border-slate-200 bg-slate-50" },
                      { level: "Read / Write", icon: Users, desc: "Modify setpoints, create SOPs", color: "border-emerald-200 bg-emerald-50" },
                      { level: "Admin", icon: ShieldCheck, desc: "Manage users, configure site", color: "border-purple-200 bg-purple-50" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.level} className={`p-3 rounded-lg border ${item.color}`}>
                          <Icon className="w-4 h-4 text-slate-500 mb-1" />
                          <p className="text-xs font-semibold text-slate-700">{item.level}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Add users */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-700">Assign Users</p>
                    <button onClick={addAssignee}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-dark border border-teal/30 rounded-lg hover:bg-teal/5 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Add Person
                    </button>
                  </div>
                  <div className="space-y-3">
                    {assignees.map((assignee, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-navy font-semibold text-[10px] shrink-0">
                          {assignee.name ? assignee.name.split(" ").map((n) => n[0]).join("") : "?"}
                        </div>
                        <input type="text" value={assignee.name}
                          onChange={(e) => { const u = [...assignees]; u[idx] = { ...u[idx], name: e.target.value }; setAssignees(u); }}
                          placeholder="Full name" className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10" />
                        <select value={assignee.role}
                          onChange={(e) => { const u = [...assignees]; u[idx] = { ...u[idx], role: e.target.value }; setAssignees(u); }}
                          className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 bg-white">
                          <option value="super_admin">Super Admin</option>
                          <option value="dc_admin">DC Admin</option>
                          <option value="shift_lead">Shift Lead</option>
                          <option value="operator">Operator</option>
                          <option value="viewer">Viewer</option>
                          <option value="vendor_service">Vendor / Service</option>
                        </select>
                        <button onClick={() => removeAssignee(idx)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vendor Access */}
                <div className="border border-orange-200 rounded-xl p-4 bg-orange-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-4 h-4 text-orange-600" />
                    <p className="text-sm font-semibold text-slate-700">Vendor / Contractor Access (UC3)</p>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Service-only permission: view telemetry for assigned devices, no export or download capability.
                    Scoped to specific equipment — separate from standard read/write.
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> No export</span>
                    <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> No download</span>
                    <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> No agent access</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Device-scoped view</span>
                  </div>
                </div>

                {/* Agent Authorization */}
                <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-blue" />
                    <p className="text-sm font-semibold text-slate-700">Agent Authorization (UC4)</p>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Agent interaction is an explicitly permissioned capability, separate from read/write.
                    Users with agent_interact can approve and schedule agent-recommended actions.
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Super Admin
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Shift Lead
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> DC Admin
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">
                      <X className="w-3 h-3" /> Operators / Viewers / Vendors
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Confirm */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-emerald-800">Ready to Activate</h3>
                  </div>
                  <p className="text-sm text-emerald-700">
                    All configuration steps complete. The site will be placed within the org hierarchy,
                    ontology mapped to as-built drawings, and access controls applied.
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  <div className="py-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Site Overview</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-slate-500">Name:</span> <span className="font-medium text-slate-800">{siteName || "DC-West-02 (Seattle)"}</span></div>
                      <div><span className="text-slate-500">Location:</span> <span className="font-medium text-slate-800">{location || "Seattle, WA"}</span></div>
                      <div><span className="text-slate-500">Tier:</span> <span className="font-medium text-slate-800">{tier}</span></div>
                      <div><span className="text-slate-500">Capacity:</span> <span className="font-medium text-slate-800">{capacity || "10"} MW</span></div>
                    </div>
                  </div>
                  <div className="py-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Org Hierarchy (UC2)</h4>
                    <p className="text-sm text-slate-700">
                      Placed under: <span className="font-semibold">{orgHierarchy.nodes.find((n) => n.id === selectedParent)?.label || "US-West"}</span>
                    </p>
                  </div>
                  <div className="py-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Ontology (UC5)</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">Sources mapped:</span>
                      <span className="font-medium text-emerald-700">{ontologySources.filter((s) => s.status === "mapped" || s.status === "connected").length}/{ontologySources.length}</span>
                    </div>
                  </div>
                  <div className="py-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Access Control (UC1/UC3/UC4)</h4>
                    <div className="flex flex-wrap gap-2">
                      {assignees.filter((a) => a.name).map((a, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy/5 text-sm text-slate-700">
                          <span className="w-5 h-5 rounded-full bg-navy/10 text-navy text-[10px] font-bold flex items-center justify-center">
                            {a.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                          {a.name} <span className="text-slate-400">({a.role.replace("_", " ")})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={back}
              disabled={currentStep === 1}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                currentStep === 1
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-1.5">
              {onboardingSteps.map((step) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full transition-all ${
                    step.id === currentStep
                      ? "bg-teal w-4"
                      : step.id < currentStep
                        ? "bg-teal/40"
                        : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            {currentStep < 6 ? (
              <button onClick={next}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-navy text-white rounded-lg hover:bg-navy-light transition-colors shadow-sm">
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors shadow-sm shadow-teal/20">
                <Rocket className="w-4 h-4" />
                Activate Site
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
