import Link from "next/link"
import sql from "@/lib/db"
import KartSvg from "./KartSvg"

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
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 mb-4 block">← Hjem</Link>
        <h1 className="text-3xl font-semibold text-stone-800 mb-1">Tomtekart</h1>
        <p className="text-stone-500 text-sm">Guldbergs vei 22B, Borgen, Oslo &mdash; 865 m²</p>
      </div>

      <KartSvg zones={zones} />
    </main>
  )
}
