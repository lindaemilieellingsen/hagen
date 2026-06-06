import Link from "next/link"
import sql from "@/lib/db"

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"]

const CURRENT_MONTH = new Date().getMonth() + 1

const BLOOM_COLORS: Record<string, string> = {
  lila: "#9b59b6",
  rosa: "#e91e8c",
  hvit: "#bdbdbd",
  rød: "#e53935",
  gul: "#fdd835",
  blå: "#1976d2",
}

export const dynamic = "force-dynamic"

export default async function BlomstringPage() {
  const plants = (await sql`
    SELECT id, name, bloom_month_start, bloom_month_end, bloom_color, zone_id
    FROM plants
    WHERE bloom_month_start IS NOT NULL
    ORDER BY bloom_month_start, name
  `) as any[]

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 mb-4 block">← Hjem</Link>
        <h1 className="text-3xl font-semibold text-stone-800 mb-1">Blomstringskalender</h1>
        <p className="text-stone-500 text-sm">Guldbergs vei 22B, Oslo</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {/* Month headers */}
        <div className="grid border-b border-stone-100" style={{ gridTemplateColumns: "160px repeat(12, 1fr)" }}>
          <div className="p-3 text-xs text-stone-400 font-medium">Plante</div>
          {MONTH_LABELS.map((m, i) => (
            <div
              key={m}
              className={`p-2 text-center text-xs font-medium border-l border-stone-100 ${
                i + 1 === CURRENT_MONTH ? "bg-green-50 text-green-700" : "text-stone-400"
              }`}
            >
              {m}
            </div>
          ))}
        </div>

        {/* Plant rows */}
        {plants.map((plant, idx) => (
          <div
            key={plant.id}
            className={`grid border-b border-stone-100 last:border-0 ${idx % 2 === 1 ? "bg-stone-50/50" : ""}`}
            style={{ gridTemplateColumns: "160px repeat(12, 1fr)" }}
          >
            <div className="p-3 pr-2">
              <p className="text-sm text-stone-700 font-medium leading-tight">{plant.name}</p>
            </div>
            {Array.from({ length: 12 }, (_, i) => {
              const m = i + 1
              const blooming =
                plant.bloom_month_start <= plant.bloom_month_end
                  ? m >= plant.bloom_month_start && m <= plant.bloom_month_end
                  : m >= plant.bloom_month_start || m <= plant.bloom_month_end
              const color = BLOOM_COLORS[plant.bloom_color] ?? "#9b59b6"
              const isStart = m === plant.bloom_month_start
              const isEnd = m === plant.bloom_month_end
              return (
                <div
                  key={m}
                  className="p-1 border-l border-stone-100 flex items-center"
                >
                  {blooming && (
                    <div
                      className={`h-5 w-full ${isStart ? "rounded-l-full" : ""} ${isEnd ? "rounded-r-full" : ""}`}
                      style={{ background: color, opacity: 0.85 }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {plants.length === 0 && (
          <div className="p-8 text-center text-stone-400 text-sm">
            Ingen blomstringsdata registrert ennå.
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-3">
        {Object.entries(BLOOM_COLORS).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5 text-sm text-stone-600">
            <span className="w-3 h-3 rounded-full" style={{ background: color }} />
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-sm text-stone-500 ml-auto">
          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">Nåværende måned</span>
        </div>
      </div>
    </main>
  )
}
