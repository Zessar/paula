import { Music } from "lucide-react"

interface ArtistCardProps {
  name: string
  genre: string
}

export function ArtistCard({ name, genre }: ArtistCardProps) {
  return (
    <div className="group relative border-2 border-neutral-charcoal bg-surface hover:border-primary transition-colors">
      {/* Etiqueta genero */}
      <div className="absolute -top-3 -left-3 bg-tertiary px-3 py-1 font-label font-bold text-xs uppercase border-2 border-background text-tertiary-foreground z-10 tracking-wider">
        {genre}
      </div>

      {/* Zona visual */}
      <div className="aspect-[3/4] bg-surface-container-high border-b-2 border-neutral-charcoal flex flex-col items-center justify-center overflow-hidden relative">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] font-display text-[18vw] leading-none select-none pointer-events-none">
          RAP
        </div>

        {/* Placeholder visual */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-24 h-24 md:w-32 md:h-32 border-2 border-neutral-charcoal bg-surface flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
            <Music className="w-10 h-10 md:w-14 md:h-14 text-primary group-hover:text-tertiary transition-colors" strokeWidth={2} />
          </div>
          <div className="font-display text-4xl md:text-5xl text-foreground text-center leading-none uppercase px-4">
            {name}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 md:p-6 flex items-center gap-3">
        <div className="w-2 h-2 bg-primary group-hover:bg-tertiary transition-colors flex-shrink-0" />
        <p className="font-body text-outline text-base uppercase">
          Actuacion en directo
        </p>
      </div>
    </div>
  )
}
