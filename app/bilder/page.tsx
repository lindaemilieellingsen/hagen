import Image from "next/image"
import Link from "next/link"

const GARDEN_PHOTOS = [
  { file: "20260606_170553.jpg", label: "Bed med hosta og peon" },
  { file: "20260606_170556.jpg", label: "Bed med hosta og barkvekst" },
  { file: "20260606_170600.jpg", label: "Steinsti med hagebeder" },
  { file: "20260606_170603.jpg", label: "Framsiden med busker og blomster" },
  { file: "20260606_170604.jpg", label: "Pergola og innkjørsel" },
  { file: "20260606_170614.jpg", label: "Store hostas ved rød villa" },
  { file: "20260606_170616.jpg", label: "Hagebed" },
  { file: "20260606_170619.jpg", label: "Hagen" },
  { file: "20260606_170624.jpg", label: "Frukttre ved hvit villa" },
  { file: "20260606_170629.jpg", label: "Frukttregreiner" },
  { file: "20260606_170645.jpg", label: "Klatrevegetasjon langs mur" },
  { file: "20260606_170658.jpg", label: "Buskas mot steinmur" },
  { file: "20260606_170702.jpg", label: "Vegetasjon langs brostein" },
  { file: "20260606_170704.jpg", label: "Trær og hekk ved innkjørsel" },
  { file: "20260606_170708.jpg", label: "Busker langs gangvei" },
  { file: "20260606_170711.jpg", label: "Stort løvtre og hekk" },
  { file: "20260606_170713.jpg", label: "Tett buskvegetasjon" },
  { file: "20260606_170722.jpg", label: "Tre ved trampoline" },
  { file: "20260606_170723.jpg", label: "Gran og bakgard" },
  { file: "20260606_170730.jpg", label: "Gran med blomstrende busk" },
  { file: "20260606_170734.jpg", label: "Tatarleddved i blomst" },
  { file: "20260606_170750.jpg", label: "Storkenebb i blomst" },
  { file: "20260606_170752.jpg", label: "Pergola med klatrevegetasjon" },
  { file: "20260606_170757.jpg", label: "Huset fra hagen" },
  { file: "20260606_170838.jpg", label: "Hagen med terrassemøbler" },
  { file: "20260606_170842.jpg", label: "Stort tre og plen" },
]

export default function BilderPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 mb-4 block">← Hjem</Link>
        <h1 className="text-3xl font-semibold text-stone-800 mb-1">Bildelogg</h1>
        <p className="text-stone-500 text-sm">Følg hagens utvikling gjennom sesongene</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-medium px-3 py-1 rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">
            Sommer 2026
          </span>
          <div className="flex-1 h-px bg-stone-200" />
          <span className="text-xs text-stone-400">{GARDEN_PHOTOS.length} bilder</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {GARDEN_PHOTOS.map((photo) => (
            <a
              key={photo.file}
              href={`/bilder/${photo.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100">
                <Image
                  src={`/bilder/${photo.file}`}
                  alt={photo.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              </div>
              <p className="text-xs text-stone-500 mt-1.5 px-0.5 truncate">{photo.label}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-stone-300 p-6 text-center">
        <p className="text-sm text-stone-400">
          Legg til nye bilder via <Link href="/logg" className="text-stone-600 underline underline-offset-2">Hageloggen</Link>
        </p>
      </div>
    </main>
  )
}
