import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getArtists } from "@/lib/supabase/queries";

export async function ArtistsSection() {
  const artists = await getArtists();

  return (
    <section className="py-xl px-gutter max-w-container-max mx-auto">
      <h3 className="font-headline-lg text-headline-lg mb-xl uppercase text-white">
        The <span className="text-primary">Beat</span>: Artistas <span className="text-neon-yellow">Invitados</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {artists.map((artist, index) => {
          const isEven = index % 2 === 0;
          const accentColor = isEven ? "text-primary" : "text-neon-yellow";
          const hoverBorderColor = isEven ? "hover:border-primary" : "hover:border-neon-yellow";

          return (
            <div key={artist.id} className={`relative overflow-hidden group border-2 border-transparent ${hoverBorderColor} transition-all`}>
              <img alt={artist.name} className="w-full aspect-[3/4] object-cover grayscale" src={artist.image}/>
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
              <div className="absolute bottom-0 p-md w-full">
                <h4 className="font-display-md font-bold text-[32px] md:text-[40px] text-white uppercase leading-none mb-xs">{artist.name}</h4>
                <p className={`font-caption ${accentColor} mb-md uppercase tracking-widest`}>{artist.genre}</p>
                <div className="flex gap-4 mb-md">
                  {artist.instagramUrl && (
                    <Link href={artist.instagramUrl} target="_blank" className="text-white hover:text-primary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>photo_camera</span>
                    </Link>
                  )}
                  {artist.spotifyUrl && (
                    <Link href={artist.spotifyUrl} target="_blank" className="text-white hover:text-primary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>headphones</span>
                    </Link>
                  )}
                  {artist.youtubeUrl && (
                    <Link href={artist.youtubeUrl} target="_blank" className="text-white hover:text-primary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>play_circle</span>
                    </Link>
                  )}
                </div>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className={`w-full font-headline-md text-xl !border-2 transition-all ${
                    isEven 
                      ? "!border-primary !text-primary hover:!bg-primary hover:!text-surface" 
                      : "!border-neon-yellow !text-neon-yellow hover:!bg-neon-yellow hover:!text-surface"
                  }`}
                >
                  <Link href={artist.profileLink}>
                    VER PERFIL
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
