import { getSponsors } from "@/lib/supabase/queries";

export async function Sponsors() {
  const sponsors = await getSponsors();

  // Triplicamos para asegurar que el efecto infinito cubra pantallas grandes sin huecos
  const sponsorsTriple = [...sponsors, ...sponsors, ...sponsors];

  return (
    <div className="bg-surface-container-high border-y-2 border-outline-variant py-0 overflow-hidden whitespace-nowrap w-full relative">
      <div className="flex gap-2xl animate-marquee items-center w-max">
        {sponsorsTriple.map((sponsor, idx) => (
          <div key={`${sponsor.id}-${idx}`} className="flex-shrink-0 h-38 flex items-center justify-center px-xl">
            {sponsor.logo ? (
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-full w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 py-4"
                style={{ opacity: (sponsor.opacity || 100) / 100 }}
              />
            ) : (
              <span className="font-headline-lg text-[75px] leading-none text-on-surface-variant opacity-50 uppercase tracking-[0.1em]">{sponsor.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
