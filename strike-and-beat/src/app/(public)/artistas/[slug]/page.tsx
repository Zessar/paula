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

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[500px] flex items-end overflow-hidden">
        {/* Fondo */}
        <div className="absolute inset-0 z-0">
          {artist.heroImage ? (
            <img
              className="w-full h-full object-cover grayscale contrast-125 brightness-50"
              alt={artist.name}
              src={artist.heroImage}
            />
          ) : artist.image ? (
            <img
              className="w-full h-full object-cover grayscale contrast-125 brightness-50"
              alt={artist.name}
              src={artist.image}
            />
          ) : (
            <div className="w-full h-full bg-surface-container" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-container-max mx-auto w-full px-gutter pb-xl pt-[200px]">
          <div className="flex flex-col md:flex-row items-end gap-xl">
            {/* Foto de perfil */}
            {artist.image && (
              <div className="w-[200px] h-[260px] md:w-[280px] md:h-[360px] overflow-hidden brutalist-border bg-surface-container shrink-0">
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

              {/* Redes sociales */}
              <div className="flex gap-lg items-center">
                {artist.instagramUrl && (
                  <Link
                    href={artist.instagramUrl}
                    target="_blank"
                    className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
                      photo_camera
                    </span>
                    <span className="font-label-bold text-xs uppercase hidden md:inline">Instagram</span>
                  </Link>
                )}
                {artist.spotifyUrl && (
                  <Link
                    href={artist.spotifyUrl}
                    target="_blank"
                    className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
                      headphones
                    </span>
                    <span className="font-label-bold text-xs uppercase hidden md:inline">Spotify</span>
                  </Link>
                )}
                {artist.youtubeUrl && (
                  <Link
                    href={artist.youtubeUrl}
                    target="_blank"
                    className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
                      play_circle
                    </span>
                    <span className="font-label-bold text-xs uppercase hidden md:inline">YouTube</span>
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
            {/* Descripcion */}
            {artist.description && (
              <div>
                <h2 className="font-headline-md text-headline-md uppercase mb-md border-l-4 border-primary pl-md">
                  Biografia
                </h2>
                <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant whitespace-pre-line">
                  {artist.description}
                </p>
              </div>
            )}

            {/* Video */}
            {videoId && (
              <div>
                <h2 className="font-headline-md text-headline-md uppercase mb-md border-l-4 border-primary pl-md">
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
              <h3 className="font-headline-md text-headline-sm uppercase text-primary">
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

              {/* Redes - Sidebar */}
              <div className="pt-sm space-y-sm">
                {artist.instagramUrl && (
                  <Link
                    href={artist.instagramUrl}
                    target="_blank"
                    className="flex items-center gap-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                      photo_camera
                    </span>
                    <span className="font-body-sm text-sm">Instagram</span>
                  </Link>
                )}
                {artist.spotifyUrl && (
                  <Link
                    href={artist.spotifyUrl}
                    target="_blank"
                    className="flex items-center gap-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                      headphones
                    </span>
                    <span className="font-body-sm text-sm">Spotify</span>
                  </Link>
                )}
                {artist.youtubeUrl && (
                  <Link
                    href={artist.youtubeUrl}
                    target="_blank"
                    className="flex items-center gap-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                      play_circle
                    </span>
                    <span className="font-body-sm text-sm">YouTube</span>
                  </Link>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary p-lg space-y-md">
              <h3 className="font-headline-md text-headline-sm uppercase text-on-primary">
                No te lo pierdas
              </h3>
              <p className="font-body-md text-on-primary/80">
                {artist.name} actuara en Strike & Beat. Consigue tu entrada antes de que se agoten.
              </p>
              <Button asChild variant="outline" size="lg" className="w-full font-headline-md text-xl bg-surface text-primary border-0 hover:bg-white">
                <Link href="/entradas" className="flex items-center justify-center gap-2">
                  <span>COMPRAR ENTRADAS</span>
                  <span className="material-symbols-outlined">confirmation_number</span>
                </Link>
              </Button>
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
