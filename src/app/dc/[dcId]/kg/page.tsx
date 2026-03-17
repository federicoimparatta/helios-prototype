"use client";

import { useState, useMemo } from "react";
import { knowledgeGraphNodes, knowledgeGraphEdges } from "@/lib/mock-data";
import {
  X,
  Zap,
  Server,
  Snowflake,
  Fan,
  Battery,
  Wind,
  MapPin,
  Cpu,
  Activity,
  Circle,
} from "lucide-react";

const statusColorMap: Record<string, { border: string; bg: string; fill: string; text: string }> = {
  normal: {
    border: "#10b981",
    bg: "#ecfdf5",
    fill: "#d1fae5",
    text: "text-emerald-700",
  },
  warning: {
    border: "#f59e0b",
    bg: "#fffbeb",
    fill: "#fef3c7",
    text: "text-amber-700",
  },
  charging: {
    border: "#0095D6",
    bg: "#eff6ff",
    fill: "#dbeafe",
    text: "text-blue-700",
  },
  standby: {
    border: "#0095D6",
    bg: "#f0f9ff",
    fill: "#e0f2fe",
    text: "text-blue-600",
  },
  offline: {
    border: "#94a3b8",
    bg: "#f8fafc",
    fill: "#e2e8f0",
    text: "text-slate-600",
  },
};

const typeIcons: Record<string, typeof Zap> = {
  site: MapPin,
  ups: Zap,
  generator: Cpu,
  bess: Battery,
  pdu: Server,
  chiller: Snowflake,
  cooling_tower: Wind,
  ahu: Fan,
  zone: Activity,
};

const typeLabels: Record<string, string> = {
  site: "Site",
  ups: "UPS",
  generator: "Generator",
  bess: "Battery Storage",
  pdu: "Power Distribution",
  chiller: "Chiller",
  cooling_tower: "Cooling Tower",
  ahu: "Air Handling Unit",
  zone: "Thermal Zone",
};

export default function KnowledgeGraphPage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const selectedNode = useMemo(
    () => knowledgeGraphNodes.find((n) => n.id === selectedNodeId),
    [selectedNodeId]
  );

  // Compute connected edges for highlighting
  const connectedEdges = useMemo(() => {
    if (!hoveredNodeId && !selectedNodeId) return new Set<string>();
    const activeId = hoveredNodeId || selectedNodeId;
    const set = new Set<string>();
    knowledgeGraphEdges.forEach((e) => {
      if (e.from === activeId || e.to === activeId) {
        set.add(`${e.from}-${e.to}`);
      }
    });
    return set;
  }, [hoveredNodeId, selectedNodeId]);

  const connectedNodeIds = useMemo(() => {
    if (!hoveredNodeId && !selectedNodeId) return new Set<string>();
    const activeId = hoveredNodeId || selectedNodeId;
    const set = new Set<string>();
    set.add(activeId!);
    knowledgeGraphEdges.forEach((e) => {
      if (e.from === activeId) set.add(e.to);
      if (e.to === activeId) set.add(e.from);
    });
    return set;
  }, [hoveredNodeId, selectedNodeId]);

  // SVG dimensions
  const svgWidth = 860;
  const svgHeight = 650;
  const nodeWidth = 130;
  const nodeHeight = 46;

  // Get node positions with center point
  function getNodeCenter(node: (typeof knowledgeGraphNodes)[number]) {
    return { cx: node.x + nodeWidth / 2, cy: node.y + nodeHeight / 2 };
  }

  const hasActive = hoveredNodeId !== null || selectedNodeId !== null;

  return (
    <div className="flex gap-6 h-[calc(100vh-220px)]">
      {/* Graph Area */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden relative">
        {/* Legend */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 px-4 py-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Status Legend
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { status: "normal", label: "Normal" },
              { status: "warning", label: "Warning" },
              { status: "charging", label: "Charging" },
              { status: "standby", label: "Standby" },
            ].map((s) => (
              <div key={s.status} className="flex items-center gap-1.5">
                <Circle
                  className="w-2.5 h-2.5"
                  fill={statusColorMap[s.status].border}
                  stroke={statusColorMap[s.status].border}
                />
                <span className="text-xs text-slate-600">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
          style={{ minHeight: 500 }}
        >
          <defs>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#000"
                floodOpacity="0.08"
              />
            </filter>
            <filter
              id="glow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                fill="#94a3b8"
                opacity="0.6"
              />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#001C77" opacity="0.8" />
            </marker>
          </defs>

          {/* Edges */}
          {knowledgeGraphEdges.map((edge) => {
            const fromNode = knowledgeGraphNodes.find(
              (n) => n.id === edge.from
            );
            const toNode = knowledgeGraphNodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const from = getNodeCenter(fromNode);
            const to = getNodeCenter(toNode);

            const edgeKey = `${edge.from}-${edge.to}`;
            const isConnected = connectedEdges.has(edgeKey);
            const dimmed = hasActive && !isConnected;

            // Curved path
            const midX = (from.cx + to.cx) / 2;
            const midY = (from.cy + to.cy) / 2;
            const dx = to.cx - from.cx;
            const dy = to.cy - from.cy;
            const curvature = 0.08;
            const ctrlX = midX - dy * curvature;
            const ctrlY = midY + dx * curvature;

            return (
              <path
                key={edgeKey}
                d={`M ${from.cx} ${from.cy} Q ${ctrlX} ${ctrlY} ${to.cx} ${to.cy}`}
                fill="none"
                stroke={isConnected ? "#001C77" : "#cbd5e1"}
                strokeWidth={isConnected ? 2.5 : 1.5}
                strokeDasharray={isConnected ? "none" : "none"}
                opacity={dimmed ? 0.15 : isConnected ? 0.8 : 0.4}
                markerEnd={
                  isConnected
                    ? "url(#arrowhead-active)"
                    : "url(#arrowhead)"
                }
                style={{ transition: "all 0.3s ease" }}
              />
            );
          })}

          {/* Nodes */}
          {knowledgeGraphNodes.map((node) => {
            const status = (node as { status?: string }).status || "normal";
            const colors = statusColorMap[status] || statusColorMap.normal;
            const isSelected = node.id === selectedNodeId;
            const isHovered = node.id === hoveredNodeId;
            const isConnected = connectedNodeIds.has(node.id);
            const dimmed = hasActive && !isConnected;
            const isSite = node.type === "site";

            return (
              <g
                key={node.id}
                onClick={() =>
                  setSelectedNodeId(
                    node.id === selectedNodeId ? null : node.id
                  )
                }
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                style={{
                  cursor: "pointer",
                  transition: "opacity 0.3s ease",
                  opacity: dimmed ? 0.25 : 1,
                }}
              >
                {/* Selection ring */}
                {(isSelected || isHovered) && (
                  <rect
                    x={node.x - 4}
                    y={node.y - 4}
                    width={nodeWidth + 8}
                    height={nodeHeight + 8}
                    rx={14}
                    fill="none"
                    stroke={isSelected ? "#001C77" : colors.border}
                    strokeWidth={2}
                    strokeDasharray={isHovered && !isSelected ? "4 2" : "none"}
                    opacity={0.4}
                  />
                )}

                {/* Node body */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx={10}
                  fill={isSite ? "#001C77" : colors.bg}
                  stroke={isSite ? "#001C77" : colors.border}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  filter={isSelected || isHovered ? "url(#glow)" : "url(#shadow)"}
                />

                {/* Status dot */}
                {!isSite && (
                  <circle
                    cx={node.x + 14}
                    cy={node.y + nodeHeight / 2}
                    r={4}
                    fill={colors.border}
                  />
                )}

                {/* Label */}
                <text
                  x={isSite ? node.x + nodeWidth / 2 : node.x + 26}
                  y={node.y + nodeHeight / 2 + 1}
                  dominantBaseline="central"
                  textAnchor={isSite ? "middle" : "start"}
                  fontSize={isSite ? 13 : 11.5}
                  fontWeight={isSite ? 700 : 600}
                  fill={isSite ? "#ffffff" : "#334155"}
                  style={{ userSelect: "none" }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail Panel */}
      {selectedNode && (
        <div className="w-80 bg-white rounded-xl border border-slate-200 p-6 flex-shrink-0 overflow-y-auto">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedNode.label}
              </h3>
              <p className="text-sm text-slate-500">
                {typeLabels[selectedNode.type] || selectedNode.type}
              </p>
            </div>
            <button
              onClick={() => setSelectedNodeId(null)}
              className="p-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Status Badge */}
          {(selectedNode as { status?: string }).status && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Status
              </p>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  statusColorMap[
                    (selectedNode as { status?: string }).status || "normal"
                  ]?.text || "text-slate-600"
                }`}
                style={{
                  backgroundColor:
                    statusColorMap[
                      (selectedNode as { status?: string }).status || "normal"
                    ]?.fill || "#e2e8f0",
                }}
              >
                <Circle
                  className="w-2 h-2"
                  fill={
                    statusColorMap[
                      (selectedNode as { status?: string }).status || "normal"
                    ]?.border || "#94a3b8"
                  }
                  stroke="none"
                />
                {(selectedNode as { status?: string }).status}
              </span>
            </div>
          )}

          {/* Node Details */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Properties
              </p>
              <div className="space-y-2">
                <div className="flex justify-between py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-500">ID</span>
                  <span className="text-sm font-mono font-medium text-slate-700">
                    {selectedNode.id}
                  </span>
                </div>
                <div className="flex justify-between py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-500">Type</span>
                  <span className="text-sm font-medium text-slate-700">
                    {typeLabels[selectedNode.type] || selectedNode.type}
                  </span>
                </div>
                <div className="flex justify-between py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-500">Position</span>
                  <span className="text-sm font-mono font-medium text-slate-700">
                    ({selectedNode.x}, {selectedNode.y})
                  </span>
                </div>
              </div>
            </div>

            {/* Connections */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Connections
              </p>
              <div className="space-y-1.5">
                {knowledgeGraphEdges
                  .filter(
                    (e) =>
                      e.from === selectedNode.id || e.to === selectedNode.id
                  )
                  .map((e) => {
                    const targetId =
                      e.from === selectedNode.id ? e.to : e.from;
                    const targetNode = knowledgeGraphNodes.find(
                      (n) => n.id === targetId
                    );
                    const direction =
                      e.from === selectedNode.id ? "downstream" : "upstream";
                    const Icon = typeIcons[targetNode?.type || ""] || Server;
                    return (
                      <button
                        key={`${e.from}-${e.to}`}
                        onClick={() => setSelectedNodeId(targetId)}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                      >
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-navy transition-colors" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 group-hover:text-navy truncate transition-colors">
                            {targetNode?.label || targetId}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                            {direction}
                          </p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
