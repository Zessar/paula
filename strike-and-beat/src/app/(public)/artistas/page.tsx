import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getArtists } from "@/lib/supabase/queries";

export default async function ArtistasPage() {
  const artists = await getArtists();

  return (
    <main className="min-h-screen py-xl">
      <section className="px-gutter max-w-container-max mx-auto">
        {/* Header Section */}
        <div className="mb-xl border-l-8 border-primary pl-lg">
          <h1 className="font-headline-lg text-headline-lg uppercase text-neon-yellow">Artistas</h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mt-md uppercase leading-tight">
            LA ALINEACIÓN MÁS AGRESIVA DE LA ESCENA URBANA. RITMOS PESADOS, LÍRICAS CRUDAS Y ENERGÍA INDUSTRIAL PURA.
          </p>
        </div>

        {/* Vertical List of Artist Profiles */}
        <div className="flex flex-col gap-lg">
          {artists.map((artist, index) => {
            const isEven = index % 2 === 0;
            const accentColor = isEven ? "bg-primary" : "bg-neon-yellow";
            const accentText = isEven ? "text-primary" : "text-neon-yellow";
            const accentBorder = isEven ? "border-primary" : "border-neon-yellow";
            const accentOnColor = isEven ? "text-surface" : "text-black";
            const hoverBorder = isEven ? "hover:border-primary" : "hover:border-neon-yellow";
            const hoverText = isEven ? "group-hover:text-primary" : "group-hover:text-neon-yellow";
            const buttonStyle = isEven 
              ? "bg-primary text-surface hover:bg-primary/90" 
              : "bg-neon-yellow text-black hover:bg-neon-yellow/90";

            return (
              <div 
                key={artist.id} 
                className={`group relative flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} bg-surface-container border-2 border-outline-variant ${hoverBorder} transition-all duration-300 overflow-hidden`}
              >
                <div className="w-full md:w-1/3 aspect-[4/5] md:aspect-square overflow-hidden grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500">
                  <img className="w-full h-full object-cover" alt={artist.name} src={artist.image}/>
                </div>
                <div className="flex-1 p-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className={`font-headline-md text-headline-md ${accentText} opacity-50`}>{(index + 1).toString().padStart(2, '0')}</span>
                      <span className={`${accentColor} ${accentOnColor} px-md py-xs font-label-bold uppercase`}>Artist</span>
                    </div>
                    <h3 className={`font-display-xl text-[60px] md:text-[80px] leading-none uppercase text-on-surface mt-sm ${hoverText} transition-colors`}>{artist.name}</h3>
                    <p className="font-body-md text-on-surface-variant mt-md pr-lg">
                      LA ENERGÍA DE {artist.name.toUpperCase()} LLEGA PARA HACER VIBRAR EL ESCENARIO. RITMOS QUE DEFINEN EL SONIDO INDUSTRIAL DE LA CALLE.
                    </p>
                  </div>
                  <div className="mt-lg flex flex-col md:flex-row md:items-end justify-between gap-lg">
                    <div className="space-y-md">
                      <div className="flex gap-md">
                        {artist.genre.split("/").map((tag) => (
                          <span key={tag} className="font-label-bold border border-outline-variant px-sm py-xs text-[12px] uppercase">{tag.trim()}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-md w-full md:w-auto">
                      <Button asChild variant="primary" size="lg" className={`w-full md:w-auto font-headline-md text-xl ${buttonStyle}`}>
                        <Link href="/entradas" className="flex items-center gap-2">
                          <span>RESERVAR ENTRADA</span>
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

