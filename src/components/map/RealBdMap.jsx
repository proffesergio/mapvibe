"use client";

import geo from "@/data/bd-geo.json";
import { districtById } from "@/data/districts";

/**
 * Real Bangladesh choropleth — 64 districts from GADM boundaries.
 * Active districts fill with the theme color + Bangla label & dot
 * (like the viral Unseen-Bangladesh style reference).
 */
export function RealBdMap({
  activeIds = [],
  activeFill = "#4f46e5",
  onToggle,
  idleFill = "#e8e2d5",
  idleStroke = "#ffffff",
  labelFill = "#1f2937",
  labelHalo = "#ffffff",
  showLabels = true,
  labelLimit = 64,
  className,
}) {
  const active = new Set(activeIds);

  return (
    <svg
      viewBox={`0 0 ${geo.width} ${geo.height}`}
      role="img"
      aria-label="বাংলাদেশের আসল জেলা ম্যাপ"
      className={className ?? "h-auto w-full"}
    >
      {geo.districts.map((d) => {
        const on = active.has(d.id);
        return (
          <path
            key={d.id}
            d={d.d}
            fill={on ? activeFill : idleFill}
            stroke={idleStroke}
            strokeWidth={on ? 1.4 : 0.8}
            onClick={() => onToggle?.(d.id)}
            className={onToggle ? "cursor-pointer transition-colors" : undefined}
          >
            <title>{districtById(d.id)?.name ?? d.id}</title>
          </path>
        );
      })}
      {showLabels &&
        geo.districts
          .filter((d) => active.has(d.id))
          .slice(0, labelLimit)
          .map((d) => (
            <g key={`lbl-${d.id}`} pointerEvents="none">
              <circle cx={d.cx} cy={d.cy - 9} r={3.2} fill="#ef4444" stroke="#ffffff" strokeWidth={1.2} />
              <text
                x={d.cx}
                y={d.cy - 16}
                textAnchor="middle"
                fontSize={13}
                fontWeight={800}
                fill={labelFill}
                stroke={labelHalo}
                strokeWidth={3}
                paintOrder="stroke"
              >
                {districtById(d.id)?.name}
              </text>
            </g>
          ))}
    </svg>
  );
}
