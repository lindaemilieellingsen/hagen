import Link from "next/link"
import sql from "@/lib/db"
import { MONTHS, SUN_LABELS } from "@/lib/types"

const BLOOM_COLORS: Record<string, string> = {
  lila: "#9b59b6",
  rosa: "#e91e8c",
  hvit: "#e0e0e0",
  rød: "#e53935",
  gul: "#fdd835",
  blå: "#1976d2",
}

const SUN_ICONS: Record<string, string> = {
  full_sun: "☀️",
  partial_shade: "⛅",
  shade: "🌑",
}

export const dynamic = "force-dynamic"

export default async function PlanterPage() {
  const plants = (await sql`
    SELECT p.*, z.name AS zone_name
    FROM plants p
    LEFT JOIN zones z ON z.id = p.zone_id
    ORDER BY p.bloom_month_start NULLS LAST, p.name
  `) as any[]

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 mb-4 block">← Hjem</Link>
        <h1 className="text-3xl font-semibold text-stone-800 mb-1">Plantekatalog</h1>
        <p className="text-stone-500 text-sm">{plants.length} planter registrert</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {plants.map((plant) => (
          <div key={plant.id} className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-medium text-stone-800">{plant.name}</h2>
                {plant.latin_name && (
                  <p className="text-xs text-stone-400 italic">{plant.latin_name}</p>
                )}
              </div>
              {plant.bloom_color && (
                <span
                  className="w-4 h-4 rounded-full mt-0.5 shrink-0 border border-stone-200"
                  style={{ background: BLOOM_COLORS[plant.bloom_color] ?? "#ccc" }}
                  title={plant.bloom_color}
                />
              )}
            </div>

            {plant.bloom_month_start && (
              <div className="mb-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 12 }, (_, i) => {
                    const m = i + 1
                    const blooming =
                      plant.bloom_month_start <= plant.bloom_month_end
                        ? m >= plant.bloom_month_start && m <= plant.bloom_month_end
                        : m >= plant.bloom_month_start || m <= plant.bloom_month_end
                    return (
                      <div
                        key={m}
                        title={MONTHS[i]}
                        className="h-2 flex-1 rounded-sm"
                        style={{
                          background: blooming
                            ? BLOOM_COLORS[plant.bloom_color] ?? "#9b59b6"
                            : "#f0ece8",
                        }}
                      />
                    )
                  })}
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  {MONTHS[plant.bloom_month_start - 1]}
                  {plant.bloom_month_end !== plant.bloom_month_start &&
                    ` – ${MONTHS[plant.bloom_month_end - 1]}`}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 text-xs">
              {plant.zone_name && (
                <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                  {plant.zone_name}
                </span>
              )}
              {plant.sun_requirement && (
                <span className="bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded-full">
                  {SUN_ICONS[plant.sun_requirement]} {SUN_LABELS[plant.sun_requirement as keyof typeof SUN_LABELS]}
                </span>
              )}
              {plant.status === "planned" && (
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Planlagt</span>
              )}
            </div>

            {plant.care_notes && (
              <p className="text-xs text-stone-500 mt-3 leading-relaxed border-t border-stone-100 pt-3">
                {plant.care_notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
