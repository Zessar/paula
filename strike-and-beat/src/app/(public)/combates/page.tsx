import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFights, getEventInfo } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function CombatesPage() {
  const [fights, eventInfo] = await Promise.all([
    getFights(),
    getEventInfo()
  ]);

  return (
    <main className="max-w-container-max mx-auto px-0 md:px-gutter py-xl">
      {/* Header */}
      <div className="mb-xl border-l-8 border-neon-yellow pl-lg mx-gutter md:mx-0">
        <h2 className="font-headline-lg text-headline-lg uppercase text-primary">
          {eventInfo.fightsTitle || "Próximos Combates"}
        </h2>
        <p className="font-display-md text-[24px] md:text-[36px] text-white max-w-4xl mt-lg uppercase leading-none italic">
          {eventInfo.fightsDescription || "RAW INDUSTRIAL ENERGY. La élite del underground se enfrenta en el cuadrilátero. Sin piedad. Sin límites."}
        </p>
      </div>

      {/* Fight List */}
      <div className="flex flex-col space-y-gutter">
        {fights.map((fight, index) => {
          const isEven = index % 2 === 0;
          const accentColor = isEven ? "bg-primary" : "bg-neon-yellow";
          const accentText = isEven ? "text-primary" : "text-neon-yellow";
          const accentBorder = isEven ? "border-primary" : "border-neon-yellow";

          return (
            <div 
              key={fight.id} 
              className={`group relative bg-surface-container border-2 border-outline-variant hover:${accentBorder} transition-colors duration-300`}
            >
              <div className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                {/* Image */}
                <div className="w-full md:w-1/2 aspect-video md:aspect-auto h-[300px] md:h-[400px] relative overflow-hidden">
                  <div className="flex h-full">
                    <div className="w-1/2 overflow-hidden border-r border-outline-variant/30 bg-surface-container-highest flex items-center justify-center">
                      {fight.imageA ? (
                        <img
                          className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                          alt={fight.nameA}
                          src={fight.imageA}
                        />
                      ) : (
                        <span className="text-outline-variant font-headline-sm uppercase opacity-50">SIN FOTO</span>
                      )}
                    </div>
                    <div className="w-1/2 overflow-hidden bg-surface-container-highest flex items-center justify-center">
                      {fight.imageB ? (
                        <img
                          className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                          alt={fight.nameB}
                          src={fight.imageB}
                        />
                      ) : (
                        <span className="text-outline-variant font-headline-sm uppercase opacity-50">SIN FOTO</span>
                      )}
                    </div>
                  </div>
                  {/* Removed gradient overlay to maximize image brightness */}
                  <div className={`absolute bottom-md ${index % 2 === 0 ? "left-md" : "right-md"}`}>
                    <span className={`${accentColor} ${isEven ? "text-surface" : "text-surface"} font-label-bold px-md py-xs uppercase tracking-widest`}>
                      {fight.badgeText || (fight.isFeatured ? "Main Event" : "Under Card")}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="w-full md:w-1/2 p-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-md">
                      <h3 className="font-headline-md text-headline-md uppercase text-on-surface leading-tight">
                        {fight.nameA} {fight.aliasA && <span className={`${accentText} opacity-60 text-sm block`}>"{fight.aliasA}"</span>}
                        <span className={`${accentText} italic my-1 block`}>vs</span>
                        {fight.nameB} {fight.aliasB && <span className={`${accentText} opacity-60 text-sm block`}>"{fight.aliasB}"</span>}
                      </h3>
                    </div>
                    <div className={`grid grid-cols-2 gap-lg border-y-2 border-outline-variant py-md mb-lg`}>
                      <div>
                        <p className="font-caption text-on-surface-variant uppercase mb-xs">Categoría</p>
                        <p className="font-label-bold uppercase">{fight.category}</p>
                      </div>
                      <div>
                        <p className="font-caption text-on-surface-variant uppercase mb-xs">Asaltos</p>
                        <p className="font-label-bold uppercase">{fight.rounds}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-caption text-on-surface-variant uppercase mb-xs">Reglas</p>
                        <p className="font-label-bold uppercase">{fight.rules}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-md">
                    {fight.slug && (
                      <Button 
                        asChild 
                        variant="outline" 
                        size="lg" 
                        className={`w-full md:w-auto font-headline-md text-xl !border-2 transition-all ${
                          isEven 
                            ? "!border-primary !text-primary hover:!bg-primary hover:!text-surface" 
                            : "!border-neon-yellow !text-neon-yellow hover:!bg-neon-yellow hover:!text-surface"
                        }`}
                      >
                        <Link href={`/combates/${fight.slug}`} className="flex items-center gap-2">
                          <span>VER COMBATE</span>
                        </Link>
                      </Button>
                    )}
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg" 
                      className={`w-full md:w-auto font-headline-md text-xl !border-2 transition-all ${
                          isEven 
                            ? "!bg-primary !border-primary !text-surface hover:!bg-white hover:!border-white" 
                            : "!bg-neon-yellow !border-neon-yellow !text-surface hover:!bg-white hover:!border-white"
                        }`}
                    >
                      <Link href="/entradas" className="flex items-center gap-2">
                        <span>COMPRA TUS ENTRADAS</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

