import Image from "next/image"
import Link from "next/link"

const sections = [
  {
    href: "/kart",
    title: "Tomtekart",
    description: "Interaktivt kart over tomten med soner og solforhold",
    icon: "🗺️",
  },
  {
    href: "/planter",
    title: "Plantekatalog",
    description: "Alle planter med blomstringstid, stell og bilder",
    icon: "🌿",
  },
  {
    href: "/blomstring",
    title: "Blomstringskalender",
    description: "Se hva som blomstrer når gjennom sesongen",
    icon: "🌸",
  },
  {
    href: "/logg",
    title: "Hagelogg",
    description: "Skriv observasjoner og last opp bilder fra hagen",
    icon: "📓",
  },
  {
    href: "/oppgaver",
    title: "Oppgaver",
    description: "Sesongoppgaver og vedlikehold tilpasset Oslo-klima",
    icon: "✅",
  },
  {
    href: "/bilder",
    title: "Bildelogg",
    description: "Følg hagens utvikling gjennom sesongene",
    icon: "📷",
  },
]

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 rounded-2xl overflow-hidden relative h-64 sm:h-80">
        <Image
          src="/huset.avif"
          alt="Guldbergs vei 22B"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-3xl font-semibold text-white mb-1">Hagen</h1>
          <p className="text-white/80 text-sm">Guldbergs vei 22B, Oslo &mdash; 865 m²</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group block rounded-2xl border border-stone-200 bg-white p-6 hover:border-stone-300 hover:shadow-sm transition-all"
          >
            <span className="text-3xl mb-3 block">{s.icon}</span>
            <h2 className="font-medium text-stone-800 group-hover:text-stone-900 mb-1">
              {s.title}
            </h2>
            <p className="text-sm text-stone-500">{s.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
