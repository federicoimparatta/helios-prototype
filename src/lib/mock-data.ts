export const dataCenters = [
  {
    id: "dc-site-001",
    name: "DC Site 001 (Atlanta)",
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
    name: "DC Site 002 (Dallas)",
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
    name: "DC Site 003 (Phoenix)",
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
    name: "DC Site 004 (Chicago)",
    location: "Chicago, IL",
    lat: 41.878,
    lng: -87.629,
    status: "operational" as const,
    reviewNeeded: false,
    metrics: { power: 2900, voltage: 480, current: 6042, pue: 1.35, temperature: 71.8 },
    equipment: { chillers: 2, ahu: 5, bess: 1, coolingTowers: 2, ups: 4, pdu: 14 },
  },
];

export const knowledgeGraphNodes = [
  { id: "site", label: "DC Site 001", type: "site", x: 400, y: 50 },
  { id: "ups-1", label: "UPS-1", type: "ups", x: 150, y: 170, status: "normal" },
  { id: "ups-2", label: "UPS-2", type: "ups", x: 350, y: 170, status: "normal" },
  { id: "gen-1", label: "Generator-1", type: "generator", x: 550, y: 170, status: "standby" },
  { id: "bess-1", label: "BESS-1", type: "bess", x: 700, y: 170, status: "charging" },
  { id: "pdu-1", label: "PDU-A1", type: "pdu", x: 100, y: 310, status: "normal" },
  { id: "pdu-2", label: "PDU-A2", type: "pdu", x: 250, y: 310, status: "normal" },
  { id: "pdu-3", label: "PDU-B1", type: "pdu", x: 400, y: 310, status: "normal" },
  { id: "chiller-1", label: "Chiller-1", type: "chiller", x: 550, y: 310, status: "normal" },
  { id: "chiller-2", label: "Chiller-2", type: "chiller", x: 700, y: 310, status: "warning" },
  { id: "ct-1", label: "Cooling Tower-1", type: "cooling_tower", x: 625, y: 440, status: "normal" },
  { id: "ahu-1", label: "AHU-1", type: "ahu", x: 100, y: 440, status: "normal" },
  { id: "ahu-2", label: "AHU-2", type: "ahu", x: 250, y: 440, status: "normal" },
  { id: "ahu-3", label: "AHU-3", type: "ahu", x: 400, y: 440, status: "normal" },
  { id: "zone-1", label: "Zone A (Cold)", type: "zone", x: 100, y: 570, status: "normal" },
  { id: "zone-2", label: "Zone B (Hot)", type: "zone", x: 250, y: 570, status: "warning" },
  { id: "zone-3", label: "Zone C (Cold)", type: "zone", x: 400, y: 570, status: "normal" },
];

export const knowledgeGraphEdges = [
  { from: "site", to: "ups-1" }, { from: "site", to: "ups-2" },
  { from: "site", to: "gen-1" }, { from: "site", to: "bess-1" },
  { from: "ups-1", to: "pdu-1" }, { from: "ups-1", to: "pdu-2" },
  { from: "ups-2", to: "pdu-3" },
  { from: "site", to: "chiller-1" }, { from: "site", to: "chiller-2" },
  { from: "chiller-1", to: "ct-1" }, { from: "chiller-2", to: "ct-1" },
  { from: "site", to: "ahu-1" }, { from: "site", to: "ahu-2" }, { from: "site", to: "ahu-3" },
  { from: "ahu-1", to: "zone-1" }, { from: "ahu-2", to: "zone-2" }, { from: "ahu-3", to: "zone-3" },
  { from: "chiller-1", to: "ahu-1" }, { from: "chiller-1", to: "ahu-2" }, { from: "chiller-2", to: "ahu-3" },
];

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
];

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
    lastUpdated: "2026-03-05", author: "Sarah Park",
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
  },
];

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

export const auditLogs = [
  { id: "a1", timestamp: "2026-03-17T16:45:00Z", action: "optimization.approved", user: "Federico Imparatta", target: "Chiller Sequencing Plan", severity: "info" as const },
  { id: "a2", timestamp: "2026-03-17T15:30:00Z", action: "sop.version_created", user: "Mike Chen", target: "SOP-001 v3.2", severity: "info" as const },
  { id: "a3", timestamp: "2026-03-17T14:15:00Z", action: "agent.alert", user: "Asset Health Monitor", target: "Chiller-2 vibration anomaly", severity: "warning" as const },
  { id: "a4", timestamp: "2026-03-17T12:00:00Z", action: "bess.discharge_started", user: "System", target: "BESS-1 peak shaving", severity: "info" as const },
  { id: "a5", timestamp: "2026-03-17T10:30:00Z", action: "recommendation.denied", user: "Sarah Park", target: "Economizer Free Cooling", severity: "warning" as const },
  { id: "a6", timestamp: "2026-03-17T08:00:00Z", action: "optimization.generated", user: "Action Planner", target: "Day-ahead optimization", severity: "info" as const },
  { id: "a7", timestamp: "2026-03-16T22:00:00Z", action: "bess.charge_started", user: "System", target: "BESS-1 off-peak charging", severity: "info" as const },
  { id: "a8", timestamp: "2026-03-16T18:45:00Z", action: "sop.executed", user: "James Lee", target: "Chiller Switchover Procedure", severity: "info" as const },
];

export const onboardingSteps = [
  { id: 1, title: "Site Overview", description: "Basic site information, location, and capacity" },
  { id: 2, title: "People", description: "Assign operators, admins, and stakeholders" },
  { id: 3, title: "Ontology", description: "Upload electrical one-lines, mechanical layouts" },
  { id: 4, title: "Telemetry", description: "Configure data sources and sensor mappings" },
  { id: 5, title: "Checks", description: "Grid connection and generation verification" },
  { id: 6, title: "Confirm", description: "Review and activate the site" },
];

export const users = [
  { id: "u1", name: "Federico Imparatta", email: "federico.imparatta@us.q-cells.com", role: "super_admin" as const, sites: ["dc-site-001", "dc-site-002", "dc-site-003", "dc-site-004"] },
  { id: "u2", name: "Mike Chen", email: "mike.chen@us.q-cells.com", role: "dc_admin" as const, sites: ["dc-site-001"] },
  { id: "u3", name: "Sarah Park", email: "sarah.park@us.q-cells.com", role: "operator" as const, sites: ["dc-site-001", "dc-site-002"] },
  { id: "u4", name: "James Lee", email: "james.lee@us.q-cells.com", role: "operator" as const, sites: ["dc-site-001", "dc-site-003"] },
  { id: "u5", name: "Maria Gonzalez", email: "maria.gonzalez@us.q-cells.com", role: "dc_admin" as const, sites: ["dc-site-002"] },
  { id: "u6", name: "Tom Wilson", email: "tom.wilson@us.q-cells.com", role: "viewer" as const, sites: ["dc-site-003"] },
];
