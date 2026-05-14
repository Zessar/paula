import Link from "next/link";
import { getEventInfo } from "@/lib/supabase/queries";

export async function Location() {
  const eventData = await getEventInfo();

  return (
    <section className="py-xl px-gutter max-w-container-max mx-auto mb-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg brutalist-border p-lg bg-surface-container">
        <div>
          <h3 className="font-headline-md text-headline-md mb-md uppercase">Ubicación</h3>
          <h4 className="font-display-xl text-[48px] text-primary mb-sm leading-none">{eventData.locationName}</h4>
          <p className="font-body-lg text-body-lg mb-lg">{eventData.locationAddress}</p>
          <div className="flex gap-md">
            <Link 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData.locationAddress || eventData.locationName)}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <button className="bg-white text-black px-md py-sm font-label-bold uppercase flex items-center gap-xs hover:bg-gray-200 transition-colors">
                <span className="material-symbols-outlined">map</span> CÓMO LLEGAR
              </button>
            </Link>
          </div>
        </div>
        <div className="h-64 brutalist-border grayscale overflow-hidden relative bg-surface-container-high group">
          <iframe 
            src={`https://www.google.com/maps?q=${encodeURIComponent(eventData.locationAddress || eventData.locationName)}&output=embed`}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 transition-all duration-500 group-hover:grayscale-0"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
