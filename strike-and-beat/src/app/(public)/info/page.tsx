import { Button } from "@/components/ui/button";
import { getEventInfo } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function InfoPage() {
  const eventData = await getEventInfo();

  return (
    <main className="max-w-container-max mx-auto px-gutter py-xl">
      {/* POSTER HEADER SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-xl">
        <div className="md:col-span-8 flex flex-col justify-end">
          {/* BADGE CON ESTILOS DE /ENTRADAS PERO EN COLOR PRIMARY */}
          <div className="bg-primary text-surface inline-block px-md py-xs font-headline-md text-[32px] md:text-[40px] uppercase mb-sm tracking-widest w-fit">
            DOSSIER OFICIAL
          </div>
          
          {/* TITULO CON ESTILOS DE /ENTRADAS PERO EN COLOR PRIMARY */}
          <h1 className="font-display-xl text-[18vw] md:text-[12vw] lg:text-[120px] uppercase text-white leading-[0.85] tracking-[0.02em] flex flex-col items-start mb-lg">
            <span>06 JUNIO</span>
            <span>2026</span>
            <span className="text-neon-yellow">{eventData.locationName}</span>
          </h1>

          <div className="flex flex-wrap gap-lg">
            <div className="border-l-4 border-primary pl-md">
              <p className="font-label-bold text-label-bold uppercase opacity-60">UBICACIÓN</p>
              <p className="font-headline-md text-headline-md uppercase text-white">{eventData.locationName}</p>
            </div>
            <div className="border-l-4 border-primary pl-md">
              <p className="font-label-bold text-label-bold uppercase opacity-60">APERTURA DE PUERTAS</p>
              <p className="font-headline-md text-headline-md uppercase text-white">{eventData.doorsOpen || "17:15H"}</p>
            </div>
            <div className="border-l-4 border-primary pl-md">
              <p className="font-label-bold text-label-bold uppercase opacity-60">PRIMER COMBATE</p>
              <p className="font-headline-md text-headline-md uppercase text-white">{eventData.firstFightTime || "17:35H"}</p>
            </div>
          </div>
        </div>
        <div className="md:col-span-4 relative group">
          <div className="aspect-[3/4] bg-surface-container-highest border-2 border-outline-variant overflow-hidden">
            <img
              alt="Detalle del evento"
              className="w-full h-full object-cover grayscale contrast-125"
              src={eventData.infoImage || eventData.aboutImage}
            />
          </div>
        </div>
      </section>

      {/* EVENT STATS / ASYMMETRIC GRID */}
      {/* EVENT STATS / ASYMMETRIC GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter mb-xl">
        {/* Card 1 - Primary */}
        <div className="bg-surface-container-high p-lg border-2 border-outline-variant flex flex-col justify-between h-full overflow-hidden">
          <div>
            <span className="material-symbols-outlined text-primary text-4xl mb-md block">
              sports_martial_arts
            </span>
            <h4 className="font-headline-lg text-headline-lg leading-none">
              {String(eventData.totalFights || 10).padStart(2, '0')}
            </h4>
            <p className="font-display-md text-[32px] font-bold leading-tight uppercase text-primary mt-sm">COMBATES ÉLITE</p>
            <div className="mt-md h-1 w-full bg-outline-variant">
              <div className="h-full w-full bg-primary"></div>
            </div>
          </div>
          {eventData.cardFightsText && (
            <p className="mt-md font-body-lg text-[20px] text-on-surface leading-snug">
              {eventData.cardFightsText}
            </p>
          )}
        </div>

        {/* Card 2 - Yellow */}
        <div className="bg-surface-container-high p-lg border-2 border-outline-variant flex flex-col justify-between h-full overflow-hidden">
          <div>
            <span className="material-symbols-outlined text-neon-yellow text-4xl mb-md block">
              mic_external_on
            </span>
            <h4 className="font-headline-lg text-headline-lg leading-none">
              {String(eventData.totalArtists || 3).padStart(2, '0')}
            </h4>
            <p className="font-display-md text-[32px] font-bold leading-tight uppercase text-neon-yellow mt-sm">CONCIERTOS RAP</p>
            <div className="mt-md h-1 w-full bg-outline-variant">
              <div className="h-full w-full bg-neon-yellow"></div>
            </div>
          </div>
          {eventData.cardArtistsText && (
            <p className="mt-md font-body-lg text-[20px] text-on-surface leading-snug">
              {eventData.cardArtistsText}
            </p>
          )}
        </div>

        {/* Card 3 - Primary */}
        <div className="bg-surface-container-high p-lg border-2 border-outline-variant flex flex-col justify-between h-full overflow-hidden">
          <div>
            <span className="material-symbols-outlined text-primary text-4xl mb-md block">
              local_bar
            </span>
            <h4 className="font-headline-lg text-headline-lg leading-none">
              {eventData.hasBars === false ? "0" : (eventData.totalBars !== undefined ? String(eventData.totalBars).padStart(2, '0') : "02")}
            </h4>
            <p className="font-display-md text-[32px] font-bold leading-tight uppercase text-primary mt-sm">{eventData.hasBars === false ? "SIN BARRAS" : "BARRAS"}</p>
            <div className="mt-md h-1 w-full bg-outline-variant">
              <div className="h-full w-full bg-primary"></div>
            </div>
          </div>
          {eventData.cardBarsText && (
            <p className="mt-md font-body-lg text-[20px] text-on-surface leading-snug">
              {eventData.cardBarsText}
            </p>
          )}
        </div>

        {/* Card 4 - Yellow */}
        <div className="bg-surface-container-high p-lg border-2 border-outline-variant flex flex-col justify-between h-full overflow-hidden">
          <div>
            <span className="material-symbols-outlined text-neon-yellow text-4xl mb-md block">
              pause_circle
            </span>
            <h4 className="font-headline-lg text-headline-lg leading-none">
              {String(eventData.totalBreaks || 0).padStart(2, '0')}
            </h4>
            <p className="font-display-md text-[32px] font-bold leading-tight uppercase text-neon-yellow mt-sm">DESCANSOS</p>
            <div className="mt-md h-1 w-full bg-outline-variant">
              <div className="h-full w-full bg-neon-yellow"></div>
            </div>
          </div>
          {eventData.breakTimes && (
            <p className="mt-md font-body-lg text-[20px] text-on-surface leading-snug">
              {eventData.breakTimes}
            </p>
          )}
        </div>
      </section>

      {/* WEIGH-IN DETAIL SECTION */}
      <section className="bg-primary text-surface p-xl mb-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 rotate-45 transform translate-x-1/4 -translate-y-1/4">
          <span className="material-symbols-outlined text-[300px]">scale</span>
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
          <div>
            <h2 className="font-display-xl text-display-xl uppercase mb-sm">{eventData.weighInTitle || "EL PESAJE"}</h2>
            <p className="font-headline-md text-headline-md mb-md">MAÑANA DEL {eventData.weighInDate || "06 JUNIO"}</p>
            <div className="bg-surface text-primary inline-block px-6 py-2 font-headline-md uppercase tracking-widest border-2 border-surface">
              {eventData.weighInIsFree === false ? "ENTRADA DE PAGO" : "ENTRADA GRATUITA"}
            </div>
          </div>
          <div className="text-xl md:text-2xl font-body-lg uppercase tracking-tight leading-snug">
            <p className="mb-md">
              {eventData.weighInText || "SÉ TESTIGO DEL PRIMER ENFRENTAMIENTO. LOS ATLETAS SE ENFRENTAN A LA BÁSCULA ANTES DE LA JAULA. ACCESO COMPLETO A PRENSA. INCLUYE SESIÓN DE MEET & GREET CON FANS."}
            </p>
            <div className="flex gap-md mt-lg">
              <div className="border-2 border-surface px-4 py-2">
                <span className="font-label-bold block">PUERTAS</span>
                <span className="font-headline-md">{eventData.weighInDoors || "10:00 AM"}</span>
              </div>
              <div className="border-2 border-surface px-4 py-2">
                <span className="font-label-bold block">BÁSCULA</span>
                <span className="font-headline-md">{eventData.weighInTime || "11:00 AM"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VENUE INFO & LOGISTICS */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-xl">
        <div className="md:col-span-7">
          <div className="border-t-4 border-on-surface pt-md mb-lg">
            <h3 className="font-headline-lg text-headline-lg uppercase mb-md italic">{eventData.locationLogisticsTitle || "LOGÍSTICA DEL RECINTO"}</h3>
            <div className="space-y-md">
              {eventData.locationLogistics ? (
                eventData.locationLogistics.split('\n').filter(line => line.trim()).map((line, idx) => {
                  const [label, ...valueParts] = line.split(':');
                  const value = valueParts.join(':')?.trim();
                  
                  return (
                    <div key={idx} className="flex justify-between items-center border-b border-outline-variant py-sm gap-md">
                      <span className="font-label-bold uppercase text-on-surface whitespace-nowrap text-[14px]">
                        {value ? label.trim() : "DETALLE"}
                      </span>
                      <span className="font-body-md text-white text-right text-[14px]">
                        {value || label.trim()}
                      </span>
                    </div>
                  );
                })
              ) : (
                <>
                  <div className="flex justify-between items-center border-b border-outline-variant py-sm">
                    <span className="font-label-bold uppercase text-on-surface text-[14px]">AFORO</span>
                    <span className="font-body-md text-white text-[14px]">2,500 ESPECTADORES</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-outline-variant py-sm">
                    <span className="font-label-bold uppercase text-on-surface text-[14px]">COMIDA Y BEBIDA</span>
                    <span className="font-body-md text-white text-[14px]">2 BARRAS COMPLETAS + SNACKS</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-outline-variant py-sm">
                    <span className="font-label-bold uppercase text-on-surface text-[14px]">INSTALACIONES</span>
                    <span className="font-body-md text-white text-[14px]">ASEOS + PUESTOS DE MERCH</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-outline-variant py-sm">
                    <span className="font-label-bold uppercase text-on-surface text-[14px]">PARKING</span>
                    <span className="font-body-md text-white text-[14px]">APARCAMIENTO PÚBLICO ADYACENTE</span>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Important Notice */}
          <div className="bg-surface-container-low p-lg border-2 border-outline mt-lg">
            <div className="flex items-center gap-md mb-md text-primary">
              <span className="material-symbols-outlined">info</span>
              <h4 className="text-[32px] md:text-[42px] font-headline-md uppercase leading-tight">AVISO IMPORTANTE</h4>
            </div>
            <p className="font-body-md uppercase text-on-surface-variant">
              {eventData.weighInNotice || "NO SE PERMITE LA ENTRADA DE COMIDA O BEBIDA EXTERNA. CONTROLES DE SEGURIDAD EN LA ENTRADA. UNA VEZ FUERA, NO SE PERMITE VOLVER A ENTRAR SIN UNA NUEVA ENTRADA. ADVERTENCIA DE VOLUMEN INDUSTRIAL."}
            </p>
          </div>
        </div>
        {/* Map / Location */}
        <div className="md:col-span-5 h-full">
          <div className="h-full bg-surface-container p-gutter border-2 border-outline-variant flex flex-col justify-between">
            <div>
              <p className="text-[32px] md:text-[42px] font-headline-md uppercase text-primary mb-sm leading-tight">UBICACIÓN MAPA</p>
              <h4 className="font-body-md uppercase text-on-surface-variant mb-lg leading-relaxed">{eventData.locationName}</h4>
            </div>
            <div className="grow relative bg-background border border-outline-variant grayscale opacity-70 mb-lg min-h-[200px] overflow-hidden group">
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
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData.locationAddress || eventData.locationName)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="primary" size="lg" className="w-full font-headline-md text-xl uppercase">
                CÓMO LLEGAR
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
