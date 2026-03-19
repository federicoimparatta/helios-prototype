/* ─────────────────────────────────────────────────────────────
   Mock Data — Updated for 5 Use Cases
   UC1: RBAC by Org Hierarchy
   UC2: Custom Org Hierarchy per Customer
   UC3: Device-Level Telemetry Access Control
   UC4: Agent Identity and Authorization
   UC5: Ontology-Driven Hierarchy Instantiation
   ───────────────────────────────────────────────────────────── */

// ── Data Centers ──────────────────────────────────────────────
export const dataCenters = [
  {
    id: "dc-site-001",
    name: "DC-East-01 (Atlanta)",
    location: "Atlanta, GA",
    lat: 33.749,
    lng: -84.388,
    status: "operational" as const,
    reviewNeeded: true,
    metrics: { power: 4250, voltage: 480, current: 8854, pue: 1.38, temperature: 72.1 },
    equipment: { chillers: 3, ahu: 8, bess: 1, coolingTowers: 4, ups: 6, pdu: 24 },
  },
  {
    id: "dc-site-002",
    name: "DC-South-01 (Dallas)",
    location: "Dallas, TX",
    lat: 32.776,
    lng: -96.797,
    status: "operational" as const,
    reviewNeeded: false,
    metrics: { power: 3800, voltage: 480, current: 7917, pue: 1.42, temperature: 73.5 },
    equipment: { chillers: 2, ahu: 6, bess: 1, coolingTowers: 3, ups: 4, pdu: 18 },
  },
  {
    id: "dc-site-003",
    name: "DC-West-01 (Phoenix)",
    location: "Phoenix, AZ",
    lat: 33.448,
    lng: -112.074,
    status: "warning" as const,
    reviewNeeded: true,
    metrics: { power: 5100, voltage: 480, current: 10625, pue: 1.51, temperature: 76.3 },
    equipment: { chillers: 4, ahu: 10, bess: 2, coolingTowers: 6, ups: 8, pdu: 32 },
  },
  {
    id: "dc-site-004",
    name: "DC-East-02 (Chicago)",
    location: "Chicago, IL",
    lat: 41.878,
    lng: -87.629,
    status: "operational" as const,
    reviewNeeded: false,
    metrics: { power: 2900, voltage: 480, current: 6042, pue: 1.35, temperature: 71.8 },
    equipment: { chillers: 2, ahu: 5, bess: 1, coolingTowers: 2, ups: 4, pdu: 14 },
  },
];

// ── UC2: Custom Org Hierarchy ─────────────────────────────────
export interface OrgHierarchyNode {
  id: string;
  label: string;
  level: string;
  parent: string | null;
  dcId?: string; // maps to dataCenters[].id when level=Site
}

export interface OrgHierarchy {
  id: string;
  name: string;
  customer: string;
  levels: string[];
  nodes: OrgHierarchyNode[];
}

export const orgHierarchy: OrgHierarchy = {
  id: "helios-demo",
  name: "Helios Data Centers",
  customer: "Helios",
  levels: ["Portfolio", "Region", "Site"],
  nodes: [
    { id: "portfolio", label: "Helios Portfolio", level: "Portfolio", parent: null },
    { id: "region-west", label: "US-West", level: "Region", parent: "portfolio" },
    { id: "region-east", label: "US-East", level: "Region", parent: "portfolio" },
    { id: "region-south", label: "US-South", level: "Region", parent: "portfolio" },
    { id: "dc-west-01", label: "DC-West-01 (Phoenix)", level: "Site", parent: "region-west", dcId: "dc-site-003" },
    { id: "dc-east-01", label: "DC-East-01 (Atlanta)", level: "Site", parent: "region-east", dcId: "dc-site-001" },
    { id: "dc-east-02", label: "DC-East-02 (Chicago)", level: "Site", parent: "region-east", dcId: "dc-site-004" },
    { id: "dc-south-01", label: "DC-South-01 (Dallas)", level: "Site", parent: "region-south", dcId: "dc-site-002" },
  ],
};

export const exampleHierarchies = [
  {
    customer: "AWS",
    levels: ["Global", "Region", "Availability Zone"],
    example: "Global > US-West-2 > us-west-2a",
    description: "Airport-code regions with lettered availability zones",
  },
  {
    customer: "Microsoft Azure",
    levels: ["Geography", "Region", "Availability Zone"],
    example: "Americas > West US 2 > Zone 1",
    description: "Metro-based regions with numbered zones",
  },
  {
    customer: "Equinix",
    levels: ["Portfolio", "Metro", "Campus", "Building"],
    example: "Americas > Dallas > DA > DA11",
    description: "Flat portfolio with metro/campus/building hierarchy",
  },
  {
    customer: "Custom Colo",
    levels: ["Portfolio", "Site"],
    example: "MyPortfolio > Site-A",
    description: "Flat two-level hierarchy for single-tenant colo",
  },
];

// ── UC1/UC3/UC4: Users with Permissions ───────────────────────
export type PermissionLevel = "read" | "write" | "admin" | "approve" | "service_view" | "agent_interact";
export type AgentPermission =
  | "approve_recommendations"
  | "schedule_actions"
  | "configure_agents"
  | "view_agent_activity"
  | "trigger_agent";
export type UserRole =
  | "super_admin"
  | "org_admin"
  | "dc_admin"
  | "shift_lead"
  | "operator"
  | "viewer"
  | "vendor_service";

export const users = [
  {
    id: "u1",
    name: "Federico Imparatta",
    email: "federico.imparatta@us.q-cells.com",
    role: "super_admin" as UserRole,
    scopeLevel: "portfolio" as const,
    scopeNode: "portfolio",
    sites: ["dc-site-001", "dc-site-002", "dc-site-003", "dc-site-004"],
    permissions: ["read", "write", "admin", "approve", "agent_interact"] as PermissionLevel[],
    agentPermissions: ["approve_recommendations", "schedule_actions", "configure_agents", "view_agent_activity", "trigger_agent"] as AgentPermission[],
    scopedDevices: null as string[] | null,
    description: "Full platform access across all sites and agents",
  },
  {
    id: "u2",
    name: "Sarah Kim",
    email: "sarah.kim@us.q-cells.com",
    role: "shift_lead" as UserRole,
    scopeLevel: "site" as const,
    scopeNode: "dc-west-01",
    sites: ["dc-site-003"],
    permissions: ["read", "write", "approve", "agent_interact"] as PermissionLevel[],
    agentPermissions: ["approve_recommendations", "schedule_actions", "view_agent_activity"] as AgentPermission[],
    scopedDevices: null as string[] | null,
    description: "Shift Lead at DC-West-01 with approval authority",
  },
  {
    id: "u3",
    name: "Mike Chen",
    email: "mike.chen@us.q-cells.com",
    role: "dc_admin" as UserRole,
    scopeLevel: "site" as const,
    scopeNode: "dc-east-01",
    sites: ["dc-site-001"],
    permissions: ["read", "write", "admin", "agent_interact"] as PermissionLevel[],
    agentPermissions: ["approve_recommendations", "configure_agents", "view_agent_activity"] as AgentPermission[],
    scopedDevices: null as string[] | null,
    description: "DC Admin for Atlanta site",
  },
  {
    id: "u4",
    name: "James Lee",
    email: "james.lee@us.q-cells.com",
    role: "operator" as UserRole,
    scopeLevel: "region" as const,
    scopeNode: "region-east",
    sites: ["dc-site-001", "dc-site-004"],
    permissions: ["read", "write"] as PermissionLevel[],
    agentPermissions: ["view_agent_activity"] as AgentPermission[],
    scopedDevices: null as string[] | null,
    description: "Operator across US-East region",
  },
  {
    id: "u5",
    name: "Maria Gonzalez",
    email: "maria.gonzalez@us.q-cells.com",
    role: "dc_admin" as UserRole,
    scopeLevel: "site" as const,
    scopeNode: "dc-south-01",
    sites: ["dc-site-002"],
    permissions: ["read", "write", "admin", "agent_interact"] as PermissionLevel[],
    agentPermissions: ["approve_recommendations", "view_agent_activity"] as AgentPermission[],
    scopedDevices: null as string[] | null,
    description: "DC Admin for Dallas site",
  },
  {
    id: "u6",
    name: "Tom Wilson",
    email: "tom.wilson@us.q-cells.com",
    role: "viewer" as UserRole,
    scopeLevel: "site" as const,
    scopeNode: "dc-west-01",
    sites: ["dc-site-003"],
    permissions: ["read"] as PermissionLevel[],
    agentPermissions: [] as AgentPermission[],
    scopedDevices: null as string[] | null,
    description: "Read-only viewer for Phoenix site",
  },
  {
    id: "u7",
    name: "TechCool Solutions",
    email: "service@techcool-hvac.com",
    role: "vendor_service" as UserRole,
    scopeLevel: "device" as const,
    scopeNode: "dc-east-01",
    sites: ["dc-site-001"],
    permissions: ["service_view"] as PermissionLevel[],
    agentPermissions: [] as AgentPermission[],
    scopedDevices: ["chiller-1", "chiller-2", "ct-1"],
    description: "HVAC vendor — view-only access to assigned chillers & cooling towers",
  },
  {
    id: "u8",
    name: "PowerGrid Maintenance",
    email: "ops@powergrid-maint.com",
    role: "vendor_service" as UserRole,
    scopeLevel: "device" as const,
    scopeNode: "dc-east-01",
    sites: ["dc-site-001"],
    permissions: ["service_view"] as PermissionLevel[],
    agentPermissions: [] as AgentPermission[],
    scopedDevices: ["ups-1", "ups-2", "bess-1"],
    description: "Electrical vendor — view-only access to UPS & BESS units",
  },
];

export const roleLabels: Record<UserRole, string> = {
  super_admin: "Super Admin",
  org_admin: "Org Admin",
  dc_admin: "DC Admin",
  shift_lead: "Shift Lead",
  operator: "Operator",
  viewer: "Viewer",
  vendor_service: "Vendor / Service",
};

export const permissionDescriptions: Record<PermissionLevel, string> = {
  read: "View dashboards, telemetry, and reports",
  write: "Modify setpoints, create SOPs, update configurations",
  admin: "Manage users, configure sites, modify hierarchy",
  approve: "Approve/reject recommendations and scheduled actions",
  service_view: "View assigned device telemetry only (no export/download)",
  agent_interact: "Interact with AI agents, trigger and approve agent actions",
};

// ── UC4: Agent Authorization Model ───────────────────────────
export interface AgentAuthConfig {
  agentId: string;
  permissionLevel: "monitor" | "advisory" | "autonomous";
  requiresApproval: string[];
  autoApproved: string[];
  scope: string; // site, region, portfolio
}

export const agentAuthConfigs: AgentAuthConfig[] = [
  {
    agentId: "agent-sop",
    permissionLevel: "advisory",
    requiresApproval: ["execute_sop", "modify_sop", "override_safety_boundary"],
    autoApproved: ["recommend_sop", "validate_preconditions", "monitor_safety_boundaries", "version_management"],
    scope: "site",
  },
  {
    agentId: "agent-health",
    permissionLevel: "monitor",
    requiresApproval: ["create_maintenance_ticket", "trigger_emergency_shutdown"],
    autoApproved: ["read_telemetry", "compute_health_score", "detect_anomaly", "generate_alert", "predict_failure"],
    scope: "site",
  },
  {
    agentId: "agent-planner",
    permissionLevel: "advisory",
    requiresApproval: ["apply_optimization", "modify_setpoints", "dispatch_bess", "adjust_chiller_sequence"],
    autoApproved: ["generate_plan", "compute_savings", "risk_assessment", "ingest_market_data", "weather_forecast"],
    scope: "site",
  },
];

// ── UC5: Ontology Sources ─────────────────────────────────────
export interface OntologySource {
  id: string;
  type: "electrical_sld" | "mechanical_layout" | "bms" | "epms" | "sops";
  format: string;
  filename: string;
  status: "uploaded" | "processing" | "mapped" | "connected" | "error";
  pointsMapped: number;
  totalPoints: number;
  lastSync?: string;
}

export const ontologySources: OntologySource[] = [
  {
    id: "onto-1",
    type: "electrical_sld",
    format: "AutoCAD DWG",
    filename: "DC-East-01-Electrical-SLD.dwg",
    status: "mapped",
    pointsMapped: 48,
    totalPoints: 52,
  },
  {
    id: "onto-2",
    type: "mechanical_layout",
    format: "PDF",
    filename: "DC-East-01-HVAC-FloorPlan.pdf",
    status: "mapped",
    pointsMapped: 35,
    totalPoints: 38,
  },
  {
    id: "onto-3",
    type: "bms",
    format: "BACnet/IP",
    filename: "bacnet://192.168.1.100:47808",
    status: "connected",
    pointsMapped: 156,
    totalPoints: 160,
    lastSync: "2026-03-19T16:30:00Z",
  },
  {
    id: "onto-4",
    type: "epms",
    format: "Modbus TCP",
    filename: "modbus://192.168.1.200:502",
    status: "connected",
    pointsMapped: 72,
    totalPoints: 75,
    lastSync: "2026-03-19T16:30:00Z",
  },
];

export const ontologyMappingSteps = [
  { step: 1, label: "Upload As-Builts", description: "Import electrical SLD and mechanical layout drawings (PDF, DWG, SVG)" },
  { step: 2, label: "Parse & Extract", description: "AI extracts equipment topology, connection paths, and nameplate data from drawings" },
  { step: 3, label: "Connect Telemetry", description: "Map BMS/EPMS data points to extracted equipment nodes via protocol adapters" },
  { step: 4, label: "Validate & Activate", description: "Verify live readings on each node, confirm topology matches physical plant" },
];

// ── Knowledge Graph ───────────────────────────────────────────
export const knowledgeGraphNodes = [
  { id: "site", label: "DC-East-01", type: "site", x: 400, y: 50, ontologySource: "as-built" },
  { id: "utility", label: "Utility Feed", type: "utility", x: 400, y: -30, status: "normal", ontologySource: "electrical_sld" },
  { id: "ups-1", label: "UPS-1", type: "ups", x: 150, y: 170, status: "normal", ontologySource: "electrical_sld", telemetrySource: "epms" },
  { id: "ups-2", label: "UPS-2", type: "ups", x: 350, y: 170, status: "normal", ontologySource: "electrical_sld", telemetrySource: "epms" },
  { id: "gen-1", label: "Generator-1", type: "generator", x: 550, y: 170, status: "standby", ontologySource: "electrical_sld", telemetrySource: "epms" },
  { id: "bess-1", label: "BESS-1", type: "bess", x: 700, y: 170, status: "charging", ontologySource: "electrical_sld", telemetrySource: "epms" },
  { id: "pdu-1", label: "PDU-A1", type: "pdu", x: 100, y: 310, status: "normal", ontologySource: "electrical_sld", telemetrySource: "epms" },
  { id: "pdu-2", label: "PDU-A2", type: "pdu", x: 250, y: 310, status: "normal", ontologySource: "electrical_sld", telemetrySource: "epms" },
  { id: "pdu-3", label: "PDU-B1", type: "pdu", x: 400, y: 310, status: "normal", ontologySource: "electrical_sld", telemetrySource: "epms" },
  { id: "chiller-1", label: "Chiller-1", type: "chiller", x: 550, y: 310, status: "normal", ontologySource: "mechanical_layout", telemetrySource: "bms" },
  { id: "chiller-2", label: "Chiller-2", type: "chiller", x: 700, y: 310, status: "warning", ontologySource: "mechanical_layout", telemetrySource: "bms" },
  { id: "ct-1", label: "Cooling Tower-1", type: "cooling_tower", x: 625, y: 440, status: "normal", ontologySource: "mechanical_layout", telemetrySource: "bms" },
  { id: "ahu-1", label: "AHU-1", type: "ahu", x: 100, y: 440, status: "normal", ontologySource: "mechanical_layout", telemetrySource: "bms" },
  { id: "ahu-2", label: "AHU-2", type: "ahu", x: 250, y: 440, status: "normal", ontologySource: "mechanical_layout", telemetrySource: "bms" },
  { id: "ahu-3", label: "AHU-3", type: "ahu", x: 400, y: 440, status: "normal", ontologySource: "mechanical_layout", telemetrySource: "bms" },
  { id: "zone-1", label: "Zone A (Cold)", type: "zone", x: 100, y: 570, status: "normal", ontologySource: "mechanical_layout" },
  { id: "zone-2", label: "Zone B (Hot)", type: "zone", x: 250, y: 570, status: "warning", ontologySource: "mechanical_layout" },
  { id: "zone-3", label: "Zone C (Cold)", type: "zone", x: 400, y: 570, status: "normal", ontologySource: "mechanical_layout" },
  { id: "it-load", label: "IT Load", type: "it_load", x: 250, y: 440, status: "normal", ontologySource: "electrical_sld" },
];

export const knowledgeGraphEdges = [
  { from: "utility", to: "site", relationship: "feeds" },
  { from: "site", to: "ups-1", relationship: "distributes" },
  { from: "site", to: "ups-2", relationship: "distributes" },
  { from: "site", to: "gen-1", relationship: "backup" },
  { from: "site", to: "bess-1", relationship: "storage" },
  { from: "ups-1", to: "pdu-1", relationship: "feeds" },
  { from: "ups-1", to: "pdu-2", relationship: "feeds" },
  { from: "ups-2", to: "pdu-3", relationship: "feeds" },
  { from: "site", to: "chiller-1", relationship: "cools" },
  { from: "site", to: "chiller-2", relationship: "cools" },
  { from: "chiller-1", to: "ct-1", relationship: "rejects_heat" },
  { from: "chiller-2", to: "ct-1", relationship: "rejects_heat" },
  { from: "site", to: "ahu-1", relationship: "serves" },
  { from: "site", to: "ahu-2", relationship: "serves" },
  { from: "site", to: "ahu-3", relationship: "serves" },
  { from: "ahu-1", to: "zone-1", relationship: "conditions" },
  { from: "ahu-2", to: "zone-2", relationship: "conditions" },
  { from: "ahu-3", to: "zone-3", relationship: "conditions" },
  { from: "chiller-1", to: "ahu-1", relationship: "chilled_water" },
  { from: "chiller-1", to: "ahu-2", relationship: "chilled_water" },
  { from: "chiller-2", to: "ahu-3", relationship: "chilled_water" },
];

// ── Assets ────────────────────────────────────────────────────
export const assets = [
  {
    id: "ups-1", name: "UPS-1", type: "UPS", parentId: "site",
    telemetry: { activePower: 850, voltage: 480, current: 1771, loadPercent: 68, batteryTemp: 25.2, runtime: 42 },
  },
  {
    id: "chiller-1", name: "Chiller-1", type: "Chiller", parentId: "site",
    telemetry: { coolingCapacity: 1200, chwSupplyTemp: 44.2, chwReturnTemp: 54.8, compressorPower: 340, cop: 3.53, flowRate: 480 },
  },
  {
    id: "bess-1", name: "BESS-1", type: "BESS", parentId: "site",
    telemetry: { soc: 72, capacityKwh: 2000, chargeRateKw: 500, dischargeRateKw: 500, cycleCount: 1247, cellTemp: 26.1 },
  },
  {
    id: "ahu-1", name: "AHU-1", type: "AHU", parentId: "site",
    telemetry: { supplyAirTemp: 55.2, returnAirTemp: 75.8, fanSpeed: 72, outdoorAirFraction: 0.35, coilLoad: 180, damperPosition: 42 },
  },
  {
    id: "ct-1", name: "Cooling Tower-1", type: "Cooling Tower", parentId: "site",
    telemetry: { cwSupplyTemp: 82.4, cwReturnTemp: 92.1, fanSpeed: 65, approachTemp: 7.2, basinTemp: 81.8 },
  },
  {
    id: "chiller-2", name: "Chiller-2", type: "Chiller", parentId: "site",
    telemetry: { coolingCapacity: 1200, chwSupplyTemp: 45.1, chwReturnTemp: 55.3, compressorPower: 355, cop: 3.38, flowRate: 470 },
  },
  {
    id: "ups-2", name: "UPS-2", type: "UPS", parentId: "site",
    telemetry: { activePower: 920, voltage: 480, current: 1917, loadPercent: 74, batteryTemp: 24.8, runtime: 38 },
  },
];

// ── Optimization Data ─────────────────────────────────────────
export function generateOptimizationData() {
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
  const itLoad = [3200, 3150, 3100, 3050, 3000, 3050, 3200, 3500, 3800, 4100, 4250, 4300, 4350, 4300, 4250, 4100, 3900, 3700, 3500, 3400, 3350, 3300, 3250, 3200];
  const hvacLoad = [800, 750, 720, 700, 680, 710, 780, 900, 1050, 1200, 1300, 1350, 1380, 1350, 1300, 1200, 1100, 1000, 900, 850, 830, 820, 810, 800];
  const bessCharge = [0, 0, 200, 300, 400, 300, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const bessDischarge = [0, 0, 0, 0, 0, 0, 0, 0, 200, 400, 500, 500, 500, 400, 300, 200, 0, 0, 0, 0, 0, 0, 0, 0];
  const gridDraw = itLoad.map((it, i) => it + hvacLoad[i] + bessCharge[i] - bessDischarge[i]);
  const price = [0.045, 0.042, 0.038, 0.035, 0.033, 0.036, 0.048, 0.065, 0.095, 0.125, 0.145, 0.155, 0.160, 0.155, 0.140, 0.120, 0.095, 0.078, 0.065, 0.058, 0.052, 0.048, 0.046, 0.045];
  const soc = [72, 72, 76, 82, 90, 95, 95, 95, 90, 80, 68, 56, 44, 36, 30, 26, 26, 26, 26, 26, 26, 26, 26, 26];
  const chwTemp = [44.2, 44.0, 43.8, 43.5, 43.2, 43.5, 44.0, 44.5, 45.0, 45.5, 46.0, 46.2, 46.5, 46.2, 46.0, 45.5, 45.0, 44.8, 44.5, 44.3, 44.2, 44.1, 44.0, 44.2];
  return hours.map((h, i) => ({
    hour: h, itLoad: itLoad[i], hvacLoad: hvacLoad[i], bessCharge: bessCharge[i],
    bessDischarge: bessDischarge[i], gridDraw: gridDraw[i], price: price[i],
    soc: soc[i], chwTemp: chwTemp[i],
    cost: Math.round(gridDraw[i] * price[i] * 100) / 100,
  }));
}

// ── SOPs ──────────────────────────────────────────────────────
export const sops = [
  {
    id: "sop-001", title: "Chiller Switchover Procedure", version: "3.2",
    status: "active" as const, category: "HVAC",
    lastUpdated: "2026-03-10", author: "Mike Chen",
    safetyBoundaries: [
      { param: "CHW Supply Temp", min: 42, max: 48, unit: "°F" },
      { param: "Compressor Current", min: 0, max: 450, unit: "A" },
      { param: "Oil Pressure", min: 25, max: 65, unit: "PSI" },
    ],
    steps: ["Verify standby chiller pre-checks", "Open isolation valves", "Start condenser water pump", "Engage compressor soft-start", "Verify CHW temps within bounds", "Transfer load gradually (25% increments)", "Shut down primary chiller", "Document completion"],
  },
  {
    id: "sop-002", title: "BESS Emergency Discharge", version: "1.4",
    status: "active" as const, category: "Electrical",
    lastUpdated: "2026-03-05", author: "Sarah Kim",
    safetyBoundaries: [
      { param: "Cell Temperature", min: 15, max: 45, unit: "°C" },
      { param: "Discharge Rate", min: 0, max: 500, unit: "kW" },
      { param: "SOC", min: 10, max: 100, unit: "%" },
    ],
    steps: ["Confirm grid outage status", "Verify BESS SOC > 20%", "Engage transfer switch", "Ramp discharge to target", "Monitor cell temps continuously", "Coordinate with utility provider", "Document event timeline"],
  },
  {
    id: "sop-003", title: "AHU Economizer Mode Activation", version: "2.1",
    status: "active" as const, category: "HVAC",
    lastUpdated: "2026-02-28", author: "Mike Chen",
    safetyBoundaries: [
      { param: "Outdoor Dew Point", min: -10, max: 55, unit: "°F" },
      { param: "Supply Air Temp", min: 55, max: 65, unit: "°F" },
      { param: "Mixed Air Temp", min: 50, max: 70, unit: "°F" },
    ],
    steps: ["Check outdoor conditions meet ASHRAE TC 9.9", "Open economizer dampers to 100%", "Reduce chiller load", "Monitor zone temperatures", "Set dew-point lockout threshold", "Configure return to mechanical cooling trigger"],
  },
  {
    id: "sop-004", title: "UPS Battery Replacement", version: "1.0",
    status: "draft" as const, category: "Electrical",
    lastUpdated: "2026-03-15", author: "James Lee",
    safetyBoundaries: [
      { param: "DC Bus Voltage", min: 380, max: 440, unit: "V" },
      { param: "String Current", min: 0, max: 200, unit: "A" },
    ],
    steps: ["Schedule maintenance window", "Transfer to bypass", "Isolate battery string", "Replace modules", "Verify string voltage", "Return to online mode", "Run capacity test"],
  },
];

// ── Recommendations ───────────────────────────────────────────
export const recommendations = [
  {
    id: "rec-001", title: "Optimize Chiller Sequencing for Peak Demand",
    status: "review-required" as const, priority: "high" as const,
    createdAt: "2026-03-17T08:00:00Z", expectedSavings: 12400,
    confidence: 0.92, safetyScore: 0.95,
    description: "Adjust chiller staging to reduce peak demand charges during 12:00-16:00 window. Shift Chiller-2 to lead during off-peak with pre-cooling strategy.",
    affectedAssets: ["Chiller-1", "Chiller-2", "Cooling Tower-1"],
    phases: [
      { name: "Pre-cooling", start: "06:00", end: "10:00", action: "Lower CHW setpoint to 42°F" },
      { name: "Peak shaving", start: "12:00", end: "16:00", action: "Switch to Chiller-2 lead, BESS discharge" },
      { name: "Recovery", start: "16:00", end: "20:00", action: "Return to standard sequencing" },
    ],
    generatedBy: "agent-planner",
    approvalRequired: true,
    approvedBy: null as string | null,
  },
  {
    id: "rec-002", title: "BESS Arbitrage — Night Charging Schedule",
    status: "approved" as const, priority: "medium" as const,
    createdAt: "2026-03-16T14:30:00Z", expectedSavings: 8200,
    confidence: 0.88, safetyScore: 0.98,
    description: "Charge BESS during 02:00-06:00 off-peak window ($0.033-0.038/kWh) and discharge during on-peak 10:00-14:00 ($0.125-0.160/kWh).",
    affectedAssets: ["BESS-1"],
    phases: [
      { name: "Charging", start: "02:00", end: "06:00", action: "Charge at 400kW" },
      { name: "Discharge", start: "10:00", end: "14:00", action: "Discharge at 500kW" },
    ],
    generatedBy: "agent-planner",
    approvalRequired: true,
    approvedBy: "Sarah Kim",
  },
  {
    id: "rec-003", title: "Economizer Free Cooling Opportunity",
    status: "denied" as const, priority: "low" as const,
    createdAt: "2026-03-15T10:00:00Z", expectedSavings: 3100,
    confidence: 0.75, safetyScore: 0.82,
    description: "Outdoor conditions forecast to support partial economizer operation 20:00-08:00. Dew point projected below 55°F lockout threshold.",
    affectedAssets: ["AHU-1", "AHU-2", "AHU-3"],
    phases: [
      { name: "Transition", start: "20:00", end: "21:00", action: "Gradual damper opening" },
      { name: "Free cooling", start: "21:00", end: "07:00", action: "Economizer mode" },
      { name: "Return", start: "07:00", end: "08:00", action: "Return to mechanical cooling" },
    ],
    generatedBy: "agent-planner",
    approvalRequired: true,
    approvedBy: null as string | null,
  },
];

// ── Agents ────────────────────────────────────────────────────
export const agents = [
  {
    id: "agent-sop", name: "SOP Agent", status: "active" as const,
    description: "Monitors equipment state and suggests relevant SOPs. Validates operating conditions against safety boundaries in real-time.",
    metrics: { tasksCompleted: 847, avgResponseTime: "1.2s", accuracy: 0.96, uptime: 0.998 },
    capabilities: ["SOP recommendation", "Safety boundary monitoring", "Pre-check validation", "Version management"],
    lastActivity: "2 min ago",
  },
  {
    id: "agent-health", name: "Asset Health Monitor", status: "active" as const,
    description: "Continuously analyzes telemetry streams to detect anomalies, predict failures, and recommend maintenance actions.",
    metrics: { tasksCompleted: 2340, avgResponseTime: "0.8s", accuracy: 0.94, uptime: 0.999 },
    capabilities: ["Anomaly detection", "Predictive maintenance", "Health scoring", "Alert generation"],
    lastActivity: "30 sec ago",
  },
  {
    id: "agent-planner", name: "Action Planner", status: "idle" as const,
    description: "Generates optimization plans by coordinating BESS, HVAC, and tariff data. Produces recommendation plans with cost/safety analysis.",
    metrics: { tasksCompleted: 156, avgResponseTime: "4.5s", accuracy: 0.91, uptime: 0.995 },
    capabilities: ["Optimization planning", "Cost analysis", "Risk assessment", "Schedule generation"],
    lastActivity: "15 min ago",
  },
];

// ── Audit Logs ────────────────────────────────────────────────
export const auditLogs = [
  { id: "a1", timestamp: "2026-03-17T16:45:00Z", action: "optimization.approved", user: "Sarah Kim", target: "Chiller Sequencing Plan", severity: "info" as const },
  { id: "a2", timestamp: "2026-03-17T15:30:00Z", action: "sop.version_created", user: "Mike Chen", target: "SOP-001 v3.2", severity: "info" as const },
  { id: "a3", timestamp: "2026-03-17T14:15:00Z", action: "agent.alert", user: "Asset Health Monitor", target: "Chiller-2 vibration anomaly", severity: "warning" as const },
  { id: "a4", timestamp: "2026-03-17T12:00:00Z", action: "agent.action_approved", user: "Sarah Kim", target: "BESS Arbitrage Schedule", severity: "info" as const },
  { id: "a5", timestamp: "2026-03-17T10:30:00Z", action: "recommendation.denied", user: "Sarah Kim", target: "Economizer Free Cooling", severity: "warning" as const },
  { id: "a6", timestamp: "2026-03-17T08:00:00Z", action: "agent.plan_generated", user: "Action Planner", target: "Day-ahead optimization", severity: "info" as const },
  { id: "a7", timestamp: "2026-03-16T22:00:00Z", action: "bess.charge_started", user: "System", target: "BESS-1 off-peak charging", severity: "info" as const },
  { id: "a8", timestamp: "2026-03-16T18:45:00Z", action: "vendor.access_granted", user: "Federico Imparatta", target: "TechCool Solutions — Chiller-1, Chiller-2, CT-1", severity: "info" as const },
];

// ── Onboarding Steps ──────────────────────────────────────────
export const onboardingSteps = [
  { id: 1, title: "Site Overview", description: "Basic site information, location, and capacity" },
  { id: 2, title: "Org Hierarchy", description: "Place site within the customer's organizational structure" },
  { id: 3, title: "Ontology", description: "Upload as-built drawings to generate equipment topology" },
  { id: 4, title: "Telemetry", description: "Map BMS/EPMS data points to ontology nodes" },
  { id: 5, title: "Access Control", description: "Configure RBAC, vendor access, and agent permissions" },
  { id: 6, title: "Confirm", description: "Review and activate the site" },
];
