"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Users,
  FileUp,
  Radio,
  ShieldCheck,
  Rocket,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { onboardingSteps, dataCenters } from "@/lib/mock-data";

const stepIcons = [MapPin, Users, FileUp, Radio, ShieldCheck, Rocket];

const tierOptions = ["Tier I", "Tier II", "Tier III", "Tier IV"];
const protocolOptions = ["Modbus TCP", "BACnet/IP", "OPC-UA", "MQTT", "SNMP"];

const gridChecks = [
  "Utility service entrance verified",
  "Main switchgear inspected",
  "Transfer switch tested",
  "Generator paralleling configured",
  "Grounding system validated",
  "ATS sequence of operations confirmed",
];

const generationChecks = [
  "Solar PV array connected",
  "BESS integration verified",
  "Diesel generator commissioned",
  "Fuel storage level confirmed",
  "Net metering agreement active",
  "Power quality analyzer installed",
];

export default function OnboardPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 state
  const [siteName, setSiteName] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [capacity, setCapacity] = useState("");
  const [tier, setTier] = useState("Tier III");

  // Step 2 state
  const [assignees, setAssignees] = useState([
    { name: "Federico Imparatta", role: "Site Admin" },
    { name: "Mike Chen", role: "Operator" },
  ]);

  // Step 3 state
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  // Step 4 state
  const [protocol, setProtocol] = useState("BACnet/IP");
  const [endpoint, setEndpoint] = useState("");
  const [pollingInterval, setPollingInterval] = useState("30");

  // Step 5 state
  const [gridChecksState, setGridChecksState] = useState<boolean[]>(new Array(gridChecks.length).fill(false));
  const [genChecksState, setGenChecksState] = useState<boolean[]>(new Array(generationChecks.length).fill(false));

  function next() {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  }

  function back() {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }

  function toggleGridCheck(i: number) {
    setGridChecksState((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  function toggleGenCheck(i: number) {
    setGenChecksState((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  function removeAssignee(index: number) {
    setAssignees((prev) => prev.filter((_, i) => i !== index));
  }

  function addAssignee() {
    setAssignees((prev) => [...prev, { name: "", role: "Operator" }]);
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
            {/* Connecting line */}
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
                      placeholder="e.g., DC Site 005 (Seattle)"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Location (City, State)
                    </label>
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
                    <input
                      type="text"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="e.g., 47.6062"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Longitude</label>
                    <input
                      type="text"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="e.g., -122.3321"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Total Capacity (MW)
                    </label>
                    <input
                      type="text"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="e.g., 10"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tier Level</label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all appearance-none cursor-pointer bg-white"
                    >
                      {tierOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: People */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-500">Assign team members to this site</p>
                  <button
                    onClick={addAssignee}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-dark border border-teal/30 rounded-lg hover:bg-teal/5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Person
                  </button>
                </div>
                <div className="space-y-3">
                  {assignees.map((assignee, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center text-navy font-semibold text-xs shrink-0">
                        {assignee.name ? assignee.name.split(" ").map((n) => n[0]).join("") : "?"}
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={assignee.name}
                          onChange={(e) => {
                            const updated = [...assignees];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            setAssignees(updated);
                          }}
                          placeholder="Full name"
                          className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
                        />
                        <select
                          value={assignee.role}
                          onChange={(e) => {
                            const updated = [...assignees];
                            updated[idx] = { ...updated[idx], role: e.target.value };
                            setAssignees(updated);
                          }}
                          className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all appearance-none cursor-pointer bg-white"
                        >
                          <option>Site Admin</option>
                          <option>Operator</option>
                          <option>Viewer</option>
                          <option>Engineer</option>
                        </select>
                      </div>
                      <button
                        onClick={() => removeAssignee(idx)}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Ontology */}
            {currentStep === 3 && (
              <div className="space-y-5">
                {[
                  { key: "electrical", label: "Electrical One-Line Diagram", desc: "Upload single-line electrical diagram (PDF, DWG, SVG)" },
                  { key: "mechanical", label: "Mechanical Layout", desc: "Upload mechanical/HVAC floor plan layout" },
                  { key: "sops", label: "SOPs", desc: "Upload standard operating procedures documents" },
                ].map((item) => (
                  <div key={item.key}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{item.label}</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-teal/40 transition-colors cursor-pointer group">
                      {uploadedFiles[item.key] ? (
                        <div className="flex items-center justify-center gap-2">
                          <Check className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm text-slate-700 font-medium">{uploadedFiles[item.key]}</span>
                          <button
                            onClick={() => {
                              const updated = { ...uploadedFiles };
                              delete updated[item.key];
                              setUploadedFiles(updated);
                            }}
                            className="ml-2 p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-teal transition-colors" />
                          <p className="text-sm text-slate-500">{item.desc}</p>
                          <p className="text-xs text-slate-400 mt-1">Click or drag to upload</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Telemetry */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Protocol</label>
                  <select
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all appearance-none cursor-pointer bg-white"
                  >
                    {protocolOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Endpoint URL</label>
                  <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    placeholder="e.g., bacnet://192.168.1.100:47808"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Polling Interval (seconds)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max="300"
                      step="5"
                      value={pollingInterval}
                      onChange={(e) => setPollingInterval(e.target.value)}
                      className="flex-1 accent-teal"
                    />
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

            {/* Step 5: Checks */}
            {currentStep === 5 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-navy" />
                    Grid Connection Verification
                  </h3>
                  <div className="space-y-2">
                    {gridChecks.map((check, i) => (
                      <label
                        key={i}
                        className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div
                          onClick={() => toggleGridCheck(i)}
                          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                            gridChecksState[i]
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {gridChecksState[i] && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm ${gridChecksState[i] ? "text-slate-700" : "text-slate-500"}`}>
                          {check}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {gridChecksState.filter(Boolean).length}/{gridChecks.length} verified
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-teal" />
                    Generation Source Verification
                  </h3>
                  <div className="space-y-2">
                    {generationChecks.map((check, i) => (
                      <label
                        key={i}
                        className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div
                          onClick={() => toggleGenCheck(i)}
                          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                            genChecksState[i]
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {genChecksState[i] && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm ${genChecksState[i] ? "text-slate-700" : "text-slate-500"}`}>
                          {check}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {genChecksState.filter(Boolean).length}/{generationChecks.length} verified
                  </p>
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
                  <p className="text-sm text-emerald-700">All configuration steps are complete. Review the summary below and activate the site.</p>
                </div>

                <div className="divide-y divide-slate-100">
                  {/* Site Overview summary */}
                  <div className="py-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Site Overview</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-slate-500">Name:</span> <span className="font-medium text-slate-800">{siteName || "DC Site 005 (Seattle)"}</span></div>
                      <div><span className="text-slate-500">Location:</span> <span className="font-medium text-slate-800">{location || "Seattle, WA"}</span></div>
                      <div><span className="text-slate-500">Coordinates:</span> <span className="font-medium text-slate-800">{latitude || "47.6062"}, {longitude || "-122.3321"}</span></div>
                      <div><span className="text-slate-500">Capacity:</span> <span className="font-medium text-slate-800">{capacity || "10"} MW</span></div>
                      <div><span className="text-slate-500">Tier:</span> <span className="font-medium text-slate-800">{tier}</span></div>
                    </div>
                  </div>

                  {/* People summary */}
                  <div className="py-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">People</h4>
                    <div className="flex flex-wrap gap-2">
                      {assignees.filter((a) => a.name).map((a, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy/5 text-sm text-slate-700">
                          <span className="w-5 h-5 rounded-full bg-navy/10 text-navy text-[10px] font-bold flex items-center justify-center">
                            {a.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                          {a.name} <span className="text-slate-400">({a.role})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Telemetry summary */}
                  <div className="py-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Telemetry</h4>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div><span className="text-slate-500">Protocol:</span> <span className="font-medium text-slate-800">{protocol}</span></div>
                      <div><span className="text-slate-500">Endpoint:</span> <span className="font-medium text-slate-800 font-mono text-xs">{endpoint || "—"}</span></div>
                      <div><span className="text-slate-500">Interval:</span> <span className="font-medium text-slate-800">{pollingInterval}s</span></div>
                    </div>
                  </div>

                  {/* Checks summary */}
                  <div className="py-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Verification</h4>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          gridChecksState.filter(Boolean).length === gridChecks.length
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {gridChecksState.filter(Boolean).length}
                        </div>
                        <span className="text-slate-600">/{gridChecks.length} Grid checks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          genChecksState.filter(Boolean).length === generationChecks.length
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {genChecksState.filter(Boolean).length}
                        </div>
                        <span className="text-slate-600">/{generationChecks.length} Generation checks</span>
                      </div>
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
              <button
                onClick={next}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-navy text-white rounded-lg hover:bg-navy-light transition-colors shadow-sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors shadow-sm shadow-teal/20"
              >
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
