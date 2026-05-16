import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtistBySlug, getArtists } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  const artists = await getArtists();
  return artists
    .filter((a) => a.slug)
    .map((a) => ({ slug: a.slug! }));
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}


/**
 * Sanitiza HTML basico para la biografia.
 * Solo permite: <strong>, <em>, <span class="text-primary">, <span class="text-neon-yellow">, <br>
 */
function sanitizeBioHtml(html: string): string {
  // Permitir solo tags seguros
  return html
    .replace(/<(?!\/?(?:strong|em|br|span)\b)[^>]*>/gi, '')
    // Solo permitir class con text-primary o text-neon-yellow en span
    .replace(/<span(?:\s+(?:class="(?:text-primary|text-neon-yellow)"))?>/gi, (match) => match)
    .replace(/\n/g, '<br />');
}

export default async function ArtistProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  const videoId = artist.videoUrl ? extractYouTubeId(artist.videoUrl) : null;


  // Detectar si la descripcion contiene HTML
  const descriptionHasHtml = artist.description
    ? /<[a-z][\s\S]*>/i.test(artist.description)
    : false;

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[520px] md:min-h-[600px] flex items-end overflow-hidden">
        {/* Fondo */}
        <div className="absolute inset-0 z-0">
          {artist.heroImage ? (
            <img
              className="w-full h-full object-cover grayscale contrast-125 brightness-[0.35] scale-105"
              alt={artist.name}
              src={artist.heroImage}
            />
          ) : artist.image ? (
            <img
              className="w-full h-full object-cover grayscale contrast-125 brightness-[0.35] scale-105"
              alt={artist.name}
              src={artist.image}
            />
          ) : (
            <div className="w-full h-full bg-surface-container" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-container-max mx-auto w-full px-gutter pb-xl pt-[220px]">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-xl">
            {/* Foto de perfil */}
            {artist.image && (
              <div className="w-[200px] h-[260px] md:w-[280px] md:h-[360px] overflow-hidden brutalist-border bg-surface-container shrink-0 shadow-2xl">
                <img
                  className="w-full h-full object-cover"
                  alt={artist.name}
                  src={artist.image}
                />
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <span className="bg-primary text-surface px-md py-xs font-label-bold uppercase text-xs tracking-widest mb-md inline-block">
                Artista
              </span>
              <h1 className="font-display-xl text-display-md md:text-display-xl leading-none uppercase mb-md">
                {artist.name}
              </h1>
              <div className="flex flex-wrap gap-sm mb-lg">
                {artist.genre.split("/").map((tag) => (
                  <span
                    key={tag}
                    className="font-label-bold border border-outline-variant px-md py-xs text-xs uppercase tracking-widest"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>

              {/* Redes sociales - ICONOS MAS GRANDES */}
              <div className="flex gap-xl items-center">
                {artist.instagramUrl && (
                  <Link
                    href={artist.instagramUrl}
                    target="_blank"
                    className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-sm group"
                  >
                    <span className="material-symbols-outlined transition-transform group-hover:scale-110" style={{ fontSize: "36px" }}>
                      photo_camera
                    </span>
                    <span className="font-label-bold text-sm uppercase hidden md:inline">Instagram</span>
                  </Link>
                )}
                {artist.spotifyUrl && (
                  <Link
                    href={artist.spotifyUrl}
                    target="_blank"
                    className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-sm group"
                  >
                    <span className="material-symbols-outlined transition-transform group-hover:scale-110" style={{ fontSize: "36px" }}>
                      headphones
                    </span>
                    <span className="font-label-bold text-sm uppercase hidden md:inline">Spotify</span>
                  </Link>
                )}
                {artist.youtubeUrl && (
                  <Link
                    href={artist.youtubeUrl}
                    target="_blank"
                    className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-sm group"
                  >
                    <span className="material-symbols-outlined transition-transform group-hover:scale-110" style={{ fontSize: "36px" }}>
                      play_circle
                    </span>
                    <span className="font-label-bold text-sm uppercase hidden md:inline">YouTube</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="max-w-container-max mx-auto px-gutter py-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
          {/* Columna Principal */}
          <div className="md:col-span-8 space-y-xl">
            {/* Descripcion / Biografia */}
            {artist.description && (
              <div>
                <h2 className="font-display-xl text-headline-lg uppercase mb-md border-l-4 border-primary pl-md">
                  Biografia
                </h2>
                {descriptionHasHtml ? (
                  <div
                    className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant prose-artist"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeBioHtml(artist.description),
                    }}
                  />
                ) : (
                  <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant whitespace-pre-line">
                    {artist.description}
                  </p>
                )}
              </div>
            )}

            {/* Video de YouTube */}
            {videoId && (
              <div>
                <h2 className="font-display-xl text-headline-lg uppercase mb-md border-l-4 border-primary pl-md">
                  En Accion
                </h2>
                <div className="brutalist-border overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`${artist.name} - Video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            )}


          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 space-y-lg">
            {/* Ficha */}
            <div className="bg-surface-container brutalist-border p-lg space-y-md">
              <h3 className="font-display-xl text-headline-md uppercase text-primary">
                Ficha Artista
              </h3>
              <div className="space-y-sm">
                <div className="flex justify-between border-b border-outline-variant pb-sm">
                  <span className="font-label-bold text-xs uppercase text-on-surface-variant">
                    Nombre
                  </span>
                  <span className="font-body-md text-white uppercase">{artist.name}</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant pb-sm">
                  <span className="font-label-bold text-xs uppercase text-on-surface-variant">
                    Genero
                  </span>
                  <span className="font-body-md text-white uppercase">{artist.genre}</span>
                </div>
              </div>

              {/* Redes - Sidebar - ICONOS MAS GRANDES */}
              <div className="pt-sm space-y-sm">
                {artist.instagramUrl && (
                  <Link
                    href={artist.instagramUrl}
                    target="_blank"
                    className="flex items-center gap-sm text-on-surface-variant hover:text-primary transition-colors group"
                  >
                    <span className="material-symbols-outlined transition-transform group-hover:scale-110" style={{ fontSize: "28px" }}>
                      photo_camera
                    </span>
                    <span className="font-body-md">Instagram</span>
                  </Link>
                )}
                {artist.spotifyUrl && (
                  <Link
                    href={artist.spotifyUrl}
                    target="_blank"
                    className="flex items-center gap-sm text-on-surface-variant hover:text-primary transition-colors group"
                  >
                    <span className="material-symbols-outlined transition-transform group-hover:scale-110" style={{ fontSize: "28px" }}>
                      headphones
                    </span>
                    <span className="font-body-md">Spotify</span>
                  </Link>
                )}
                {artist.youtubeUrl && (
                  <Link
                    href={artist.youtubeUrl}
                    target="_blank"
                    className="flex items-center gap-sm text-on-surface-variant hover:text-primary transition-colors group"
                  >
                    <span className="material-symbols-outlined transition-transform group-hover:scale-110" style={{ fontSize: "28px" }}>
                      play_circle
                    </span>
                    <span className="font-body-md">YouTube</span>
                  </Link>
                )}
              </div>
            </div>

            {/* CTA - MISMOS ESTILOS QUE PESAJE */}
            <div className="bg-primary text-surface p-xl space-y-md relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 rotate-45 transform translate-x-1/4 -translate-y-1/4">
                <span className="material-symbols-outlined text-[200px]">confirmation_number</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-display-xl text-display-sm md:text-display-md uppercase leading-none mb-sm">
                  No te lo pierdas
                </h3>
                <p className="text-xl md:text-2xl font-body-lg uppercase tracking-tight mb-lg leading-snug">
                  {artist.name} actuara en Strike & Beat. Consigue tu entrada antes de que se agoten.
                </p>
                <Button asChild variant="dark" size="lg" className="w-full font-headline-md text-xl uppercase tracking-[0.2em]">
                  <Link href="/entradas">
                    ENTRADAS
                  </Link>
                </Button>
              </div>
            </div>

            {/* Volver */}
            <Link
              href="/artistas"
              className="flex items-center gap-xs font-label-bold uppercase text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Volver a Artistas
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
