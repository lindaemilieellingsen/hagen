import Image from "next/image"
import Link from "next/link"
import sql from "@/lib/db"
import { SUN_LABELS } from "@/lib/types"

const SUN_ICONS: Record<string, string> = {
  full_sun: "☀️",
  partial_shade: "⛅",
  shade: "🌑",
}

export const dynamic = "force-dynamic"

export default async function KartPage() {
  const zones = (await sql`
    SELECT z.*,
      COALESCE(
        json_agg(
          json_build_object('id', p.id, 'name', p.name, 'bloom_color', p.bloom_color, 'status', p.status)
          ORDER BY p.name
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'
      ) AS plants
    FROM zones z
    LEFT JOIN plants p ON p.zone_id = z.id
    GROUP BY z.id
    ORDER BY z.name
  `) as any[]

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 mb-4 block">← Hjem</Link>
        <h1 className="text-3xl font-semibold text-stone-800 mb-1">Tomtekart</h1>
        <p className="text-stone-500 text-sm">Guldbergs vei 22B, Borgen, Oslo &mdash; 865 m²</p>
      </div>

      {/* Map images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="rounded-2xl overflow-hidden border border-stone-200">
          <div className="relative h-56">
            <Image
              src="/kart/norgeskart.jpg"
              alt="Norgeskart"
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="p-3 bg-white">
            <p className="text-xs text-stone-500 font-medium">Norgeskart</p>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border border-stone-200">
          <div className="relative h-56">
            <Image
              src="/kart/finn-kart.jpg"
              alt="Finn kart"
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="p-3 bg-white">
            <p className="text-xs text-stone-500 font-medium">kart.finn.no</p>
          </div>
        </div>
      </div>

      {/* Zones */}
      <h2 className="text-xl font-semibold text-stone-800 mb-4">Soner</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {zones.map((zone) => (
          <div key={zone.id} className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-2">
              {zone.color && (
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: zone.color }}
                />
              )}
              <h3 className="font-medium text-stone-800">{zone.name}</h3>
            </div>

            {zone.description && (
              <p className="text-xs text-stone-500 mb-3">{zone.description}</p>
            )}

            <div className="flex gap-2 flex-wrap mb-3">
              {zone.sun_condition && (
                <span className="text-xs bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded-full">
                  {SUN_ICONS[zone.sun_condition]} {SUN_LABELS[zone.sun_condition as keyof typeof SUN_LABELS]}
                </span>
              )}
              {zone.direction && (
                <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                  {zone.direction}
                </span>
              )}
            </div>

            {zone.plants.length > 0 && (
              <div>
                <p className="text-xs text-stone-400 mb-1.5">Planter:</p>
                <div className="flex flex-wrap gap-1.5">
                  {zone.plants.map((p: any) => (
                    <span
                      key={p.id}
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        p.status === "planned"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {p.name}
                      {p.status === "planned" && " (planlagt)"}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {zone.future_plan && (
              <div className="mt-3 pt-3 border-t border-stone-100">
                <p className="text-xs text-stone-400 mb-0.5">Plan:</p>
                <p className="text-xs text-stone-600">{zone.future_plan}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
