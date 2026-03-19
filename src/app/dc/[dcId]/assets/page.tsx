"use client";

import { useState } from "react";
import { assets, sops } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import {
  ChevronRight,
  ChevronDown,
  Zap,
  Server,
  Snowflake,
  Fan,
  Battery,
  Wind,
  Activity,
  FileText,
  ExternalLink,
  Gauge,
  Thermometer,
  Clock,
  Percent,
  Droplets,
  RotateCcw,
  Lock,
  Download,
  Share2,
  Eye,
  ShieldAlert,
  Wrench,
} from "lucide-react";

type AssetType = (typeof assets)[number];

// Group assets by category
const assetTree = [
  {
    category: "Electrical",
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-50",
    children: [
      { type: "UPS", items: assets.filter((a) => a.type === "UPS") },
      { type: "PDU", items: [] as AssetType[] },
    ],
  },
  {
    category: "HVAC",
    icon: Fan,
    color: "text-teal",
    bg: "bg-teal-50",
    children: [
      { type: "Chillers", items: assets.filter((a) => a.type === "Chiller") },
      { type: "AHU", items: assets.filter((a) => a.type === "AHU") },
      {
        type: "Cooling Towers",
        items: assets.filter((a) => a.type === "Cooling Tower"),
      },
    ],
  },
  {
    category: "Storage",
    icon: Battery,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    children: [
      { type: "BESS", items: assets.filter((a) => a.type === "BESS") },
    ],
  },
];

// Telemetry display config
const telemetryMeta: Record<
  string,
  { label: string; unit: string; icon: typeof Activity }
> = {
  activePower: { label: "Active Power", unit: "kW", icon: Zap },
  voltage: { label: "Voltage", unit: "V", icon: Activity },
  current: { label: "Current", unit: "A", icon: Activity },
  loadPercent: { label: "Load", unit: "%", icon: Gauge },
  batteryTemp: { label: "Battery Temp", unit: "°C", icon: Thermometer },
  runtime: { label: "Runtime", unit: "min", icon: Clock },
  coolingCapacity: { label: "Cooling Capacity", unit: "kW", icon: Snowflake },
  chwSupplyTemp: { label: "CHW Supply Temp", unit: "°F", icon: Thermometer },
  chwReturnTemp: { label: "CHW Return Temp", unit: "°F", icon: Thermometer },
  compressorPower: { label: "Compressor Power", unit: "kW", icon: Zap },
  cop: { label: "COP", unit: "", icon: Gauge },
  flowRate: { label: "Flow Rate", unit: "GPM", icon: Droplets },
  soc: { label: "State of Charge", unit: "%", icon: Battery },
  capacityKwh: { label: "Capacity", unit: "kWh", icon: Battery },
  chargeRateKw: { label: "Charge Rate", unit: "kW", icon: Zap },
  dischargeRateKw: { label: "Discharge Rate", unit: "kW", icon: Zap },
  cycleCount: { label: "Cycle Count", unit: "", icon: RotateCcw },
  cellTemp: { label: "Cell Temp", unit: "°C", icon: Thermometer },
  supplyAirTemp: { label: "Supply Air Temp", unit: "°F", icon: Thermometer },
  returnAirTemp: { label: "Return Air Temp", unit: "°F", icon: Thermometer },
  fanSpeed: { label: "Fan Speed", unit: "%", icon: Fan },
  outdoorAirFraction: { label: "Outdoor Air Fraction", unit: "", icon: Wind },
  coilLoad: { label: "Coil Load", unit: "kW", icon: Activity },
  damperPosition: { label: "Damper Position", unit: "%", icon: Percent },
  cwSupplyTemp: { label: "CW Supply Temp", unit: "°F", icon: Thermometer },
  cwReturnTemp: { label: "CW Return Temp", unit: "°F", icon: Thermometer },
  approachTemp: { label: "Approach Temp", unit: "°F", icon: Thermometer },
  basinTemp: { label: "Basin Temp", unit: "°F", icon: Thermometer },
};

// Map asset types to related SOP categories
const assetTypeToSopCategory: Record<string, string[]> = {
  UPS: ["Electrical"],
  Chiller: ["HVAC"],
  BESS: ["Electrical"],
  AHU: ["HVAC"],
  "Cooling Tower": ["HVAC"],
};

export default function AssetsPage() {
  const { isVendor, canAccessDevice, currentUser, hasPermission } = useAuth();

  // For vendors, filter to only their accessible assets
  const accessibleAssets = isVendor
    ? assets.filter((a) => canAccessDevice(a.id))
    : assets;

  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    accessibleAssets[0]?.id || ""
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["Electrical", "HVAC", "Storage"])
  );
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(
    new Set(["UPS", "Chillers", "AHU", "Cooling Towers", "BESS"])
  );

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);
  const isSelectedAccessible = selectedAsset ? canAccessDevice(selectedAsset.id) : false;

  const relatedSops = selectedAsset
    ? sops.filter((s) =>
        (assetTypeToSopCategory[selectedAsset.type] || []).includes(s.category)
      )
    : [];

  function toggleCategory(cat: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function toggleType(type: string) {
    setExpandedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  // Build filtered asset tree for vendors
  const filteredAssetTree = isVendor
    ? assetTree.map((cat) => ({
        ...cat,
        children: cat.children.map((sub) => ({
          ...sub,
          items: sub.items.filter((a) => canAccessDevice(a.id)),
        })).filter((sub) => sub.items.length > 0),
      })).filter((cat) => cat.children.length > 0)
    : assetTree;

  return (
    <div>
      {/* UC3 Vendor Banner */}
      {isVendor && (
        <div className="mb-5 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-orange-800">
              UC3: Service-Only Access — {currentUser.name}
            </h3>
            <p className="text-xs text-orange-600 mt-0.5 leading-relaxed">
              You can view telemetry for your {currentUser.scopedDevices?.length || 0} assigned devices.
              Export, download, and data extraction are disabled. Agent interaction is not available.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {currentUser.scopedDevices?.map((deviceId) => {
                const asset = assets.find((a) => a.id === deviceId);
                return (
                  <span
                    key={deviceId}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-medium border border-orange-200"
                  >
                    {asset?.name || deviceId}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-1.5 rounded bg-orange-100 text-orange-400" title="Export disabled">
              <Download className="w-3.5 h-3.5" />
            </div>
            <div className="p-1.5 rounded bg-orange-100 text-orange-400" title="Share disabled">
              <Share2 className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6 h-[calc(100vh-220px)]">
        {/* Left Panel — Asset Tree */}
        <div className="w-72 bg-white rounded-xl border border-slate-200 flex-shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">
              {isVendor ? "Assigned Devices" : "Asset Explorer"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isVendor
                ? `${accessibleAssets.length} devices in scope`
                : `${assets.length} assets configured`}
            </p>
          </div>
          <div className="p-2">
            {filteredAssetTree.map((category) => {
              const CatIcon = category.icon;
              const isExpanded = expandedCategories.has(category.category);
              const totalAssets = category.children.reduce(
                (sum, c) => sum + c.items.length,
                0
              );

              return (
                <div key={category.category} className="mb-1">
                  <button
                    onClick={() => toggleCategory(category.category)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <div
                      className={`w-6 h-6 rounded ${category.bg} flex items-center justify-center`}
                    >
                      <CatIcon className={`w-3.5 h-3.5 ${category.color}`} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 flex-1 text-left">
                      {category.category}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {totalAssets}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="ml-5 mt-0.5">
                      {category.children.map((sub) => {
                        const isTypeExpanded = expandedTypes.has(sub.type);
                        return (
                          <div key={sub.type}>
                            <button
                              onClick={() => toggleType(sub.type)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
                            >
                              {isTypeExpanded ? (
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-3 h-3 text-slate-400" />
                              )}
                              <span className="text-xs font-medium text-slate-500">
                                {sub.type}
                              </span>
                              <span className="text-[10px] text-slate-400 ml-auto">
                                {sub.items.length}
                              </span>
                            </button>

                            {isTypeExpanded && (
                              <div className="ml-5 mt-0.5">
                                {sub.items.length === 0 ? (
                                  <p className="text-[10px] text-slate-300 px-3 py-1 italic">
                                    No assets
                                  </p>
                                ) : (
                                  sub.items.map((asset) => {
                                    const isSelected = asset.id === selectedAssetId;
                                    return (
                                      <button
                                        key={asset.id}
                                        onClick={() => setSelectedAssetId(asset.id)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all text-sm ${
                                          isSelected
                                            ? "bg-navy/5 text-navy font-semibold border border-navy/10"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                                        }`}
                                      >
                                        <div
                                          className={`w-1.5 h-1.5 rounded-full ${
                                            isSelected ? "bg-navy" : "bg-emerald-400"
                                          }`}
                                        />
                                        {asset.name}
                                      </button>
                                    );
                                  })
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Show locked devices for vendors */}
            {isVendor && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold px-3 mb-1">
                  Outside your scope
                </p>
                {assets
                  .filter((a) => !canAccessDevice(a.id))
                  .slice(0, 4)
                  .map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 cursor-not-allowed"
                    >
                      <Lock className="w-3 h-3" />
                      {asset.name}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Asset Detail */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {selectedAsset ? (
            <>
              {/* Header */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center">
                    <Server className="w-5 h-5 text-navy" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedAsset.name}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {selectedAsset.type} — ID: {selectedAsset.id}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {isVendor && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-medium border border-orange-200">
                        <Eye className="w-3 h-3" />
                        View Only
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Telemetry Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Live Telemetry
                  </h3>
                  {/* Export/Download buttons — disabled for vendors */}
                  {!isVendor && hasPermission("write") && (
                    <div className="flex items-center gap-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        Export CSV
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                      </button>
                    </div>
                  )}
                  {isVendor && (
                    <div className="flex items-center gap-2">
                      <button
                        disabled
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 border border-slate-100 rounded-lg cursor-not-allowed"
                        title="Export disabled for service accounts"
                      >
                        <Lock className="w-3 h-3" />
                        Export
                      </button>
                      <button
                        disabled
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 border border-slate-100 rounded-lg cursor-not-allowed"
                        title="Share disabled for service accounts"
                      >
                        <Lock className="w-3 h-3" />
                        Share
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(selectedAsset.telemetry).map(([key, value]) => {
                    const meta = telemetryMeta[key] || {
                      label: key,
                      unit: "",
                      icon: Activity,
                    };
                    const Icon = meta.icon;
                    return (
                      <div
                        key={key}
                        className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm hover:border-slate-300 transition-all group cursor-default"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-slate-400 group-hover:text-navy transition-colors" />
                          <span className="text-xs font-medium text-slate-500">
                            {meta.label}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-bold text-slate-900">
                            {typeof value === "number" && value % 1 !== 0
                              ? value.toFixed(1)
                              : value.toLocaleString()}
                          </span>
                          <span className="text-sm text-slate-400">
                            {meta.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Related SOPs — hidden for vendors */}
              {!isVendor && relatedSops.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Related SOPs
                  </h3>
                  <div className="space-y-2">
                    {relatedSops.map((sop) => (
                      <div
                        key={sop.id}
                        className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue/5 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 group-hover:text-navy transition-colors truncate">
                            {sop.title}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-slate-400">
                              v{sop.version}
                            </span>
                            <span className="text-xs text-slate-300">|</span>
                            <span className="text-xs text-slate-400">
                              {sop.author}
                            </span>
                            <span className="text-xs text-slate-300">|</span>
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                sop.status === "active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {sop.status}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-navy transition-colors flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Server className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">
                  Select an asset to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
