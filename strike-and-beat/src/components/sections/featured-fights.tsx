import Link from "next/link";
import { getFights } from "@/lib/supabase/queries";

export async function FeaturedFights() {
  const fighters = await getFights();

  return (
    <section className="py-xl bg-surface-container-low px-gutter">
      <div className="max-w-container-max mx-auto">
        <h3 className="font-headline-lg text-headline-lg mb-xl text-center uppercase">Cartelera Estelar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {fighters.map((fight) => {
            const content = (
              <div className="bg-surface-container brutalist-border overflow-hidden group cursor-pointer hover:border-primary transition-all">
                <div className="flex h-64">
                  <div className="w-1/2 overflow-hidden border-r-2 border-outline-variant relative">
                    <img alt={fight.nameA} className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-500" src={fight.imageA}/>
                    <div className="absolute bottom-0 left-0 bg-primary text-on-primary px-sm py-xs font-label-bold">{fight.nameA}</div>
                  </div>
                  <div className="w-1/2 overflow-hidden relative">
                    <img alt={fight.nameB} className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-500" src={fight.imageB}/>
                    <div className="absolute bottom-0 right-0 bg-neon-yellow text-surface px-sm py-xs font-label-bold">{fight.nameB}</div>
                  </div>
                </div>
                <div className="p-md text-center bg-surface-container-highest">
                  <p className="font-headline-md text-headline-md text-primary">{fight.category} | {fight.rounds}</p>
                  {fight.slug && (
                    <p className="font-label-bold text-xs text-on-surface-variant uppercase mt-xs tracking-widest">Ver Detalles &rarr;</p>
                  )}
                </div>
              </div>
            );

            return fight.slug ? (
              <Link key={fight.id} href={`/combates/${fight.slug}`} className="block">
                {content}
              </Link>
            ) : (
              <div key={fight.id}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
