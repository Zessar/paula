import Link from "next/link";
import { notFound } from "next/navigation";
import { getFightBySlug, getFights } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  const fights = await getFights();
  return fights
    .filter((f) => f.slug)
    .map((f) => ({ slug: f.slug! }));
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default async function FightProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fight = await getFightBySlug(slug);

  if (!fight) {
    notFound();
  }

  const videoId = fight.videoUrl ? extractYouTubeId(fight.videoUrl) : null;

  return (
    <main className="min-h-screen">
      {/* HERO VS */}
      <section className="relative bg-surface-container overflow-hidden">
        <div className="max-w-container-max mx-auto px-gutter py-xl">
          {/* Etiqueta */}
          <div className="text-center mb-lg">
            <span className="bg-primary text-surface px-lg py-xs font-label-bold uppercase text-xs tracking-widest">
              {fight.badgeText || (fight.isFeatured ? "Main Event" : "Under Card")} — {fight.category}
            </span>
          </div>

          {/* VS Card */}
          <div className="flex flex-col md:flex-row items-stretch gap-0 brutalist-border overflow-hidden">
            {/* Peleador A */}
            <div className="flex-1 relative group">
              <div className="aspect-[3/4] md:aspect-auto md:h-[500px] overflow-hidden">
                {fight.imageA ? (
                  <img
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                    alt={fight.nameA}
                    src={fight.imageA}
                  />
                ) : (
                  <div className="w-full h-full bg-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-[80px] text-outline">person</span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-lg">
                <h2 className="font-display-xl text-[36px] md:text-[52px] leading-none uppercase text-white">
                  {fight.nameA}
                </h2>
                {fight.aliasA && (
                  <p className="font-label-bold text-primary text-sm uppercase tracking-widest mt-xs">
                    &quot;{fight.aliasA}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* VS Divider */}
            <div className="flex items-center justify-center bg-primary px-lg py-md md:py-0 md:min-w-[80px]">
              <span className="font-display-xl text-[40px] md:text-[60px] text-on-primary italic leading-none">
                VS
              </span>
            </div>

            {/* Peleador B */}
            <div className="flex-1 relative group">
              <div className="aspect-[3/4] md:aspect-auto md:h-[500px] overflow-hidden">
                {fight.imageB ? (
                  <img
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                    alt={fight.nameB}
                    src={fight.imageB}
                  />
                ) : (
                  <div className="w-full h-full bg-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-[80px] text-outline">person</span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-lg text-right">
                <h2 className="font-display-xl text-[36px] md:text-[52px] leading-none uppercase text-white">
                  {fight.nameB}
                </h2>
                {fight.aliasB && (
                  <p className="font-label-bold text-primary text-sm uppercase tracking-widest mt-xs">
                    &quot;{fight.aliasB}&quot;
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-0 brutalist-border border-t-0 bg-surface-container-low">
            <div className="p-md text-center border-r border-outline-variant">
              <p className="font-caption text-on-surface-variant uppercase text-xs mb-xs">Categoria</p>
              <p className="font-headline-md text-headline-sm uppercase text-primary">{fight.category}</p>
            </div>
            <div className="p-md text-center border-r border-outline-variant">
              <p className="font-caption text-on-surface-variant uppercase text-xs mb-xs">Asaltos</p>
              <p className="font-headline-md text-headline-sm uppercase text-primary">{fight.rounds}</p>
            </div>
            <div className="p-md text-center">
              <p className="font-caption text-on-surface-variant uppercase text-xs mb-xs">Reglas</p>
              <p className="font-headline-md text-headline-sm uppercase text-primary">{fight.rules}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="max-w-container-max mx-auto px-gutter py-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
          {/* Descripcion Peleador A */}
          {fight.descriptionA && (
            <div className="bg-surface-container brutalist-border p-lg">
              <div className="flex items-center gap-sm mb-md">
                <div className="w-2 h-8 bg-primary" />
                <h3 className="font-display-xl text-[32px] md:text-[42px] uppercase leading-none">{fight.nameA}</h3>
              </div>
              <p className="font-body-lg text-xl leading-relaxed text-on-surface-variant whitespace-pre-line">
                {fight.descriptionA}
              </p>
            </div>
          )}

          {/* Descripcion Peleador B */}
          {fight.descriptionB && (
            <div className="bg-surface-container brutalist-border p-lg">
              <div className="flex items-center gap-sm mb-md">
                <div className="w-2 h-8 bg-primary" />
                <h3 className="font-display-xl text-[32px] md:text-[42px] uppercase leading-none">{fight.nameB}</h3>
              </div>
              <p className="font-body-lg text-xl leading-relaxed text-on-surface-variant whitespace-pre-line">
                {fight.descriptionB}
              </p>
            </div>
          )}
        </div>

        {/* Video Promo */}
        {videoId && (
          <div className="mt-xl">
            <h2 className="font-headline-md text-headline-md uppercase mb-md border-l-4 border-primary pl-md">
              Video Promocional
            </h2>
            <div className="brutalist-border overflow-hidden">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`${fight.nameA} vs ${fight.nameB} - Promo`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* CTA + Volver */}
        <div className="mt-xl flex flex-col md:flex-row items-center justify-between gap-lg">
          <Link
            href="/combates"
            className="flex items-center gap-xs font-label-bold uppercase text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Volver a Combates
          </Link>
          <Button asChild variant="primary" size="lg" className="w-full md:w-auto font-headline-md text-xl uppercase">
            <Link href="/entradas" className="flex items-center gap-2">
              <span>COMPRAR ENTRADAS</span>
              <span className="material-symbols-outlined">confirmation_number</span>
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
