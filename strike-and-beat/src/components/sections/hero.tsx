import Link from "next/link";
import { getEventInfo } from "@/lib/supabase/queries";

export async function Hero() {
  const eventData = await getEventInfo();

  return (
    <section className="relative min-h-[795px] flex flex-col items-center justify-center text-center px-gutter py-xl">
      <div className="absolute inset-0 z-0 opacity-40 lg:p-x5">
        <img alt="Boxing Gym Atmosphere" className="w-full h-full object-cover grayscale brutalist-border" src={eventData.heroImage} />
      </div>
      <div className="relative z-10 max-w-4xl">
        <h2 className="font-display-xl text-display-xl mb-md leading-none">{eventData.title}</h2>
        <div className="flex flex-col md:flex-row gap-md justify-center items-center mb-xl">
          <div className="brutalist-border px-lg py-md bg-surface-container-lowest">
            <p className="font-headline-md text-headline-md">{eventData.date}</p>
          </div>
          <div className="brutalist-border px-lg py-md bg-surface-container-lowest">
            <p className="font-headline-md text-headline-md uppercase">{eventData.locationName}</p>
          </div>
        </div>
        <Link className="inline-block bg-neon-yellow text-surface font-display-xl text-[48px] px-xl py-lg uppercase hover:bg-white transition-colors tracking-tighter" href="/entradas">
          COMPRA TUS <br />ENTRADAS
        </Link>
      </div>
    </section>
  );
}
