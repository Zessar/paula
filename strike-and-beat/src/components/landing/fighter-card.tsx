interface FighterCardProps {
  nameA: string
  nameB: string
  category: string
  rounds: string
  rules: string
}

export function FighterCard({ nameA, nameB, category, rounds, rules }: FighterCardProps) {
  return (
    <div className="group relative border-2 border-neutral-charcoal bg-surface hover:border-tertiary transition-colors">
      {/* Etiqueta de categoria */}
      <div className="absolute -top-3 -right-3 bg-primary px-3 py-1 font-label font-bold text-xs uppercase border-2 border-background text-primary-foreground z-10 tracking-wider">
        {category}
      </div>

      {/* Zona visual con VS */}
      <div className="aspect-[4/3] bg-surface-container-high border-b-2 border-neutral-charcoal flex items-center justify-center overflow-hidden relative">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 font-display text-[20vw] leading-none select-none pointer-events-none">
          VS
        </div>

        {/* Contenido del combate */}
        <div className="relative z-10 flex items-center gap-4 md:gap-6 px-4 w-full">
          {/* Peleador A */}
          <div className="flex-1 text-right">
            <div className="w-full aspect-square bg-surface-container border-2 border-neutral-charcoal flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
              <div className="font-display text-3xl md:text-4xl text-outline/30 text-center leading-tight p-2">
                {nameA.split(" ").map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </div>
            </div>
          </div>

          {/* VS central */}
          <div className="flex-shrink-0">
            <span className="font-display text-4xl md:text-5xl text-tertiary drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
              VS
            </span>
          </div>

          {/* Peleador B */}
          <div className="flex-1 text-left">
            <div className="w-full aspect-square bg-surface-container border-2 border-neutral-charcoal flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
              <div className="font-display text-3xl md:text-4xl text-outline/30 text-center leading-tight p-2">
                {nameB.split(" ").map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info del combate */}
      <div className="p-4 md:p-6">
        <h3 className="font-display text-2xl md:text-3xl uppercase text-foreground leading-tight mb-1">
          {nameA} <span className="text-tertiary">vs</span> {nameB}
        </h3>
        <p className="font-body text-outline text-base">
          {rounds} &middot; {rules}
        </p>
      </div>
    </div>
  )
}
