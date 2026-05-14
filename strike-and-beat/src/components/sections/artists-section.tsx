import Link from "next/link";
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
          const borderColor = isEven ? "border-primary" : "border-neon-yellow";
          const hoverBgColor = isEven ? "hover:bg-primary" : "hover:bg-neon-yellow";
          const hoverBorderColor = isEven ? "hover:border-primary" : "hover:border-neon-yellow";

          return (
            <div key={artist.id} className={`relative overflow-hidden group border-2 border-transparent ${hoverBorderColor} transition-all`}>
              <img alt={artist.name} className="w-full aspect-[3/4] object-cover grayscale" src={artist.image}/>
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
              <div className="absolute bottom-0 p-md w-full">
                <h4 className="font-headline-md text-headline-md text-white">{artist.name}</h4>
                <p className={`font-caption ${accentColor} mb-md uppercase tracking-widest`}>{artist.genre}</p>
                <div className="flex gap-2 mb-sm">
                  {artist.instagramUrl && (
                    <Link href={artist.instagramUrl} target="_blank" className="text-white hover:text-primary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>photo_camera</span>
                    </Link>
                  )}
                  {artist.spotifyUrl && (
                    <Link href={artist.spotifyUrl} target="_blank" className="text-white hover:text-primary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>headphones</span>
                    </Link>
                  )}
                  {artist.youtubeUrl && (
                    <Link href={artist.youtubeUrl} target="_blank" className="text-white hover:text-primary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>play_circle</span>
                    </Link>
                  )}
                </div>
                <Link 
                  href={artist.profileLink} 
                  className={`block w-full bg-surface ${accentColor} border ${borderColor} py-xs font-label-bold ${hoverBgColor} hover:text-surface text-center transition-all`}
                >
                  VER PERFIL
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
