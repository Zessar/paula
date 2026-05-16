import { getEventInfo } from "@/lib/supabase/queries";

export async function AboutEvent() {
  const eventData = await getEventInfo();

  return (
    <section className="py-xl px-gutter max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-lg items-center">
      <div className="md:col-span-7">
        <h3 className="font-headline-lg text-headline-lg mb-lg uppercase">
          {eventData.aboutTitle.split(/(Benéfica|Azuqueca)/i).map((part, i) => {
            const isHighlighted = part.toLowerCase() === "benéfica" || part.toLowerCase() === "azuqueca";
            return (
              <span key={i} className={isHighlighted ? "text-neon-yellow" : ""}>
                {part}
              </span>
            );
          })}
        </h3>
        <p className="font-body-lg text-body-lg mb-md leading-relaxed">
          {eventData.aboutText.split("Asociación Caminando").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && <span className="text-neon-yellow font-bold underline">Asociación Caminando</span>}
            </span>
          ))}
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {eventData.aboutSecondaryText}
        </p>
      </div>
      <div className="md:col-span-5">
        <div className="brutalist-border p-sm bg-surface-container">
          <img alt="Boxing solidarity" className="w-full" src={eventData.aboutImage}/>
        </div>
      </div>
    </section>
  );
}
