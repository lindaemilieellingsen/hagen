"use client"

import { useState } from "react"

interface Plant {
  id: number
  name: string
  bloom_color?: string
  status: string
}

interface Zone {
  id: number
  name: string
  description?: string
  sun_condition?: string
  plants: Plant[]
  current_plan?: string
  future_plan?: string
}

const SUN_ICONS: Record<string, string> = {
  full_sun: "☀️ Full sol",
  partial_shade: "⛅ Halvskygge",
  shade: "🌑 Skygge",
}

// Soner basert på faktiske kartkoder (norgeskart + finn)
// Eiendommen: ca 33m bred, 26m dyp, garasje øvre venstre, hus nedre senter
// Guldbergs vei kurver langs nedre venstre
const ZONE_SHAPES: Record<number, { polygon: string; label: [number, number]; fill: string; stroke: string }> = {
  3: { // Bakgarden – øvre grøntareal
    polygon: "115,70 545,70 565,248 115,248",
    label: [370, 208],
    fill: "#9fc99b",
    stroke: "#7aaa76",
  },
  4: { // Sti langs mur – venstre stripe
    polygon: "105,415 115,248 172,248 172,415",
    label: [140, 332],
    fill: "#c0b5ad",
    stroke: "#a09590",
  },
  1: { // Bed ved hus – rundt huset
    polygon: "172,248 462,248 462,415 172,415",
    label: [317, 408],
    fill: "#7cae6e",
    stroke: "#5a9050",
  },
  5: { // Pergola – høyre side
    polygon: "462,248 565,248 570,415 462,415",
    label: [516, 332],
    fill: "#d6c496",
    stroke: "#b8a070",
  },
  2: { // Framsiden – nedre del mot vei
    polygon: "105,415 570,415 495,495 175,490",
    label: [337, 455],
    fill: "#b8dba8",
    stroke: "#90be80",
  },
}

export default function KartSvg({ zones }: { zones: Zone[] }) {
  const [selected, setSelected] = useState<Zone | null>(null)

  const zoneMap = Object.fromEntries(zones.map((z) => [z.id, z]))

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* SVG-kart */}
      <div className="flex-1 min-w-0">
        <svg
          viewBox="0 0 650 580"
          className="w-full rounded-2xl border border-stone-200 bg-white"
          style={{ maxHeight: "600px" }}
        >
          {/* Tomtens ytterkant */}
          <polygon
            points="110,65 550,65 570,415 495,495 175,490 105,415"
            fill="#e8f5e4"
            stroke="#bdd4b5"
            strokeWidth="2"
          />

          {/* Guldbergs vei – kurver langs nedre venstre */}
          <path
            d="M 55,540 Q 335,572 615,510"
            fill="none"
            stroke="#d4ccc0"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M 55,540 Q 335,572 615,510"
            fill="none"
            stroke="#e8e2d8"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <text x="295" y="561" fontSize="11" fill="#9a9080" fontFamily="system-ui" textAnchor="middle">
            Guldbergs vei
          </text>

          {/* Zone-flater */}
          {Object.entries(ZONE_SHAPES).map(([idStr, shape]) => {
            const id = parseInt(idStr)
            const zone = zoneMap[id]
            const isSelected = selected?.id === id
            return (
              <g
                key={id}
                onClick={() => setSelected(selected?.id === id ? null : zone ?? null)}
                style={{ cursor: "pointer" }}
              >
                <polygon
                  points={shape.polygon}
                  fill={shape.fill}
                  stroke={isSelected ? "#333" : shape.stroke}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  opacity={selected && !isSelected ? 0.55 : 1}
                  className="transition-opacity duration-150"
                />
              </g>
            )
          })}

          {/* Huset – tegnes over soner */}
          <rect x="215" y="268" width="200" height="130" rx="3" fill="#f4f0ec" stroke="#9a8a7a" strokeWidth="2" />
          <line x1="215" y1="268" x2="415" y2="398" stroke="#c0b0a0" strokeWidth="1" />
          <line x1="415" y1="268" x2="215" y2="398" stroke="#c0b0a0" strokeWidth="1" />
          <text x="315" y="335" fontSize="10" fill="#7a6a5a" fontFamily="system-ui" textAnchor="middle" fontWeight="600">HUSET</text>
          <text x="315" y="348" fontSize="8.5" fill="#9a8a7a" fontFamily="system-ui" textAnchor="middle">22B</text>

          {/* Garasje – separat bygg øvre venstre */}
          <rect x="133" y="98" width="77" height="57" rx="2" fill="#f0ece6" stroke="#9a8a7a" strokeWidth="1.5" />
          <line x1="133" y1="98" x2="210" y2="155" stroke="#c0b0a0" strokeWidth="1" />
          <line x1="210" y1="98" x2="133" y2="155" stroke="#c0b0a0" strokeWidth="1" />
          <text x="171" y="170" fontSize="9" fill="#6a5a4a" fontFamily="system-ui" textAnchor="middle">Garasje</text>

          {/* Trær i bakgarden */}
          <circle cx="430" cy="138" r="27" fill="#5a9e52" opacity="0.7" />
          <circle cx="430" cy="138" r="13" fill="#3d7a36" opacity="0.8" />
          <text x="430" y="142" fontSize="8" fill="white" textAnchor="middle" fontFamily="system-ui">Gran</text>

          <circle cx="318" cy="115" r="22" fill="#6aaa60" opacity="0.65" />
          <circle cx="318" cy="115" r="11" fill="#4a8a42" opacity="0.7" />
          <text x="318" y="119" fontSize="7.5" fill="white" textAnchor="middle" fontFamily="system-ui">Løvtre</text>

          {/* Trampoline */}
          <circle cx="490" cy="168" r="19" fill="none" stroke="#7a9aba" strokeWidth="2" strokeDasharray="4,2" />
          <text x="490" y="172" fontSize="7" fill="#5a7a9a" textAnchor="middle" fontFamily="system-ui">Trampoline</text>

          {/* Zone-labels (hopper over 1 og 4 – håndteres manuelt) */}
          {Object.entries(ZONE_SHAPES).map(([idStr, shape]) => {
            const id = parseInt(idStr)
            const zone = zoneMap[id]
            if (!zone || id === 1 || id === 4) return null
            const [lx, ly] = shape.label
            return (
              <text
                key={id}
                x={lx}
                y={ly}
                fontSize="10.5"
                fill="#2d4a2a"
                fontFamily="system-ui"
                fontWeight="600"
                textAnchor="middle"
                style={{ pointerEvents: "none" }}
              >
                {zone.name}
              </text>
            )
          })}

          {/* Bed ved hus – label under huset */}
          <text
            x="317"
            y="408"
            fontSize="9.5"
            fill="#2d4a2a"
            fontFamily="system-ui"
            fontWeight="600"
            textAnchor="middle"
            style={{ pointerEvents: "none" }}
          >
            Bed ved hus
          </text>

          {/* Sti langs mur – rotert label (smal sone) */}
          {zoneMap[4] && (
            <text
              transform="rotate(-90, 140, 332)"
              x="140"
              y="332"
              fontSize="8.5"
              fill="#2d4a2a"
              fontFamily="system-ui"
              fontWeight="600"
              textAnchor="middle"
              style={{ pointerEvents: "none" }}
            >
              Sti langs mur
            </text>
          )}

          {/* Nordpil */}
          <g transform="translate(612, 90)">
            <circle cx="0" cy="0" r="18" fill="white" stroke="#c0c0c0" strokeWidth="1" />
            <polygon points="0,-14 4,4 0,1 -4,4" fill="#333" />
            <polygon points="0,14 4,-4 0,-1 -4,-4" fill="#ccc" />
            <text x="0" y="-17" fontSize="8" fill="#333" textAnchor="middle" fontFamily="system-ui" fontWeight="700">N</text>
          </g>

          {/* Målestokk */}
          <g transform="translate(80, 515)">
            <line x1="0" y1="0" x2="50" y2="0" stroke="#6a6a6a" strokeWidth="1.5" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#6a6a6a" strokeWidth="1.5" />
            <line x1="50" y1="-4" x2="50" y2="4" stroke="#6a6a6a" strokeWidth="1.5" />
            <text x="25" y="-7" fontSize="8" fill="#6a6a6a" textAnchor="middle" fontFamily="system-ui">~15 m</text>
          </g>
        </svg>
        <p className="text-xs text-stone-400 mt-2 text-center">Klikk en sone for å se detaljer</p>
      </div>

      {/* Info-panel */}
      <div className="lg:w-72 shrink-0">
        {selected ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-5 sticky top-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-stone-800 text-lg">{selected.name}</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-stone-400 hover:text-stone-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {selected.description && (
              <p className="text-sm text-stone-600 mb-3">{selected.description}</p>
            )}

            {selected.sun_condition && (
              <p className="text-xs text-stone-500 mb-3">
                {SUN_ICONS[selected.sun_condition] ?? selected.sun_condition}
              </p>
            )}

            {selected.plants.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-stone-400 mb-2">Planter</p>
                <div className="flex flex-col gap-1.5">
                  {selected.plants.map((p) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          p.status === "planned"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {p.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected.future_plan && (
              <div className="pt-3 border-t border-stone-100">
                <p className="text-xs font-medium text-stone-400 mb-1">Plan</p>
                <p className="text-xs text-stone-600">{selected.future_plan}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-200 p-5">
            <div className="space-y-3">
              {zones.map((zone) => {
                const shape = ZONE_SHAPES[zone.id]
                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelected(zone)}
                    className="w-full flex items-center gap-2.5 text-left hover:bg-stone-50 rounded-lg p-1.5 transition-colors"
                  >
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ background: shape?.fill ?? "#aaa" }}
                    />
                    <span className="text-sm text-stone-700">{zone.name}</span>
                    <span className="text-xs text-stone-400 ml-auto">{zone.plants.length} planter</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
