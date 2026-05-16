import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFights } from "@/lib/supabase/queries";

export async function FeaturedFights() {
  const fighters = await getFights();

  return (
    <section className="py-xl bg-surface-container-low px-gutter">
      <div className="max-w-container-max mx-auto">
        <h3 className="font-headline-lg text-headline-lg mb-xl text-center uppercase">Cartelera Estelar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {fighters.map((fight, index) => {
            const isEven = index % 2 === 0;
            const content = (
              <div className="bg-surface-container brutalist-border overflow-hidden group cursor-pointer hover:border-primary transition-all flex flex-col h-full">
                <div className="flex h-64 shrink-0">
                  <div className="w-1/2 overflow-hidden border-r-2 border-outline-variant relative">
                    <img alt={fight.nameA} className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-500" src={fight.imageA}/>
                    <div className="absolute bottom-0 left-0 bg-primary text-on-primary px-sm py-xs font-label-bold">{fight.nameA}</div>
                  </div>
                  <div className="w-1/2 overflow-hidden relative">
                    <img alt={fight.nameB} className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-500" src={fight.imageB}/>
                    <div className="absolute bottom-0 right-0 bg-neon-yellow text-surface px-sm py-xs font-label-bold">{fight.nameB}</div>
                  </div>
                </div>
                <div className="p-md text-center bg-surface-container-highest flex-1 flex flex-col justify-between items-center gap-md">
                  <p className="font-headline-md text-headline-md text-primary">{fight.category} | {fight.rounds}</p>
                  {fight.slug && (
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg"
                      className={`w-full max-w-[240px] font-headline-md text-xl !border-2 transition-all ${
                        isEven 
                          ? "!border-primary !text-primary hover:!bg-primary hover:!text-surface" 
                          : "!border-neon-yellow !text-neon-yellow hover:!bg-neon-yellow hover:!text-surface"
                      }`}
                    >
                      <Link href={`/combates/${fight.slug}`}>
                        VER DETALLES
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );

            return (
              <div key={fight.id} className="h-full">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
