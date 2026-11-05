"use client";

import geo from "@/data/bd-geo.json";
import { districtById } from "@/data/districts";

/**
 * Real Bangladesh choropleth — 64 districts from GADM boundaries.
 * Active districts fill with the theme color + Bangla label & dot
 * (like the viral Unseen-Bangladesh style reference).
 *
 * Single-map build: this is the ONLY map component. It carries its own
 * small-corner "🗺️ ভাইবম্যাপ" watermark inside the SVG so both the live
 * view and the 1080 JPG export stay branded without a second map node.
 *
 * Animated live view: active districts remount on toggle (key flip) so the
 * .bd-district-on pop runs every time a district is (de)selected. An
 * optional expanding ripple (pulseId + pulseKey) marks the last-picked
 * district — pass it from the live tracker only, never from the poster.
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
  pulseId = null,
  pulseKey = 0,
  showWatermark = true,
}) {
  const active = new Set(activeIds);
  const pulseDist = pulseId ? geo.districts.find((d) => d.id === pulseId) : null;
  const showPulse = Boolean(pulseDist && pulseKey > 0 && active.has(pulseId));

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
            key={`${d.id}-${on ? "on" : "off"}`}
            d={d.d}
            fill={on ? activeFill : idleFill}
            stroke={idleStroke}
            strokeWidth={on ? 1.4 : 0.8}
            onClick={() => onToggle?.(d.id)}
            className={
              on
                ? `bd-district bd-district-on${onToggle ? " cursor-pointer" : ""}`
                : `bd-district${onToggle ? " cursor-pointer" : ""}`
            }
          >
            <title>{districtById(d.id)?.name ?? d.id}</title>
          </path>
        );
      })}
      {showPulse && (
        <g key={`pulse-${pulseKey}`} pointerEvents="none">
          <circle
            cx={pulseDist.cx}
            cy={pulseDist.cy}
            r={9}
            fill="none"
            stroke={activeFill}
            strokeWidth={3}
            opacity={0.9}
            className="bd-ping"
          />
          <circle cx={pulseDist.cx} cy={pulseDist.cy} r={4} fill={activeFill} stroke="#ffffff" strokeWidth={1.5} />
        </g>
      )}
      {showLabels &&
        geo.districts
          .filter((d) => active.has(d.id))
          .slice(0, labelLimit)
          .map((d) => (
            <g key={`lbl-${d.id}`} pointerEvents="none" className="bd-label-in">
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
      {showWatermark && (
        <g pointerEvents="none" aria-hidden="true">
          <rect
            x={geo.width - 124}
            y={geo.height - 28}
            width={116}
            height={22}
            rx={11}
            fill="#ffffff"
            opacity={0.92}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
          <text
            x={geo.width - 14}
            y={geo.height - 12.5}
            textAnchor="end"
            fontSize={13}
            fontWeight={800}
            fill="#451a03"
            opacity={0.85}
          >
            🗺️ ভাইবম্যাপ
          </text>
        </g>
      )}
    </svg>
  );
}
