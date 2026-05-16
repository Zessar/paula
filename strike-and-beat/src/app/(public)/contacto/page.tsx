import { Metadata } from "next"
import Link from "next/link"
import { Mail, MapPin, Clock, Send, Phone } from "lucide-react"
import { getEventInfo } from "@/lib/supabase/queries"
import { CopyContactCard } from "@/components/ui/copy-contact-card"

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto | Strike & Beat",
  description: "Contacta con el equipo de Strike & Beat para cualquier consulta.",
}

export default async function ContactoPage() {
  const eventData = await getEventInfo()

  return (
    <div className="min-h-screen bg-surface">
      {/* ============================================================ */}
      {/*  HERO SECTION                                                */}
      {/* ============================================================ */}
      <section className="relative h-[48vh] md:h-[70vh] min-h-[420px] md:min-h-[550px] w-full flex flex-col justify-center overflow-hidden border-b-4 border-neon-yellow pt-0 bg-surface">
        {/* Background Image */}
        {eventData.contactHeroImage && (
          <img
            alt="Contact Hero"
            className="absolute inset-0 md:inset-y-0 md:left-auto md:right-0 w-full md:w-1/2 h-full object-cover object-top grayscale opacity-60"
            src={eventData.contactHeroImage}
          />
        )}
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent md:bg-gradient-to-r md:from-surface md:via-surface md:via-[55%] md:to-transparent"></div>
        
        <div className="relative z-10 px-gutter w-full max-w-container-max mx-auto">
          <div className="bg-neon-yellow text-surface inline-block px-md py-xs font-headline-md text-[20px] md:text-[24px] uppercase mb-sm tracking-widest">
            Estamos Aquí
          </div>
          <h1 className="font-display-xl text-[24vw] md:text-[16vw] lg:text-[150px] uppercase text-white leading-[0.85] tracking-[0.02em] flex flex-col items-start overflow-hidden">
            {eventData.contactTitle ? (
              <>
                {eventData.contactTitle.split(' ').map((word, i, arr) => (
                  <span key={i} className={i === arr.length - 1 ? "text-neon-yellow" : ""}>{word} </span>
                ))}
              </>
            ) : (
              <>
                <span>Contacta</span>
                <span className="text-neon-yellow">Con Nosotros</span>
              </>
            )}
          </h1>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CONTACT CONTENT                                             */}
      {/* ============================================================ */}
      <div className="max-w-container-max mx-auto px-gutter py-xl">
        <div className="grid lg:grid-cols-12 gap-xl">
          
          {/* Informacion de contacto (4 cols) */}
          <div className="lg:col-span-5 space-y-lg">
            <div>
              <h2 className="font-display-xl text-[44px] md:text-headline-lg text-white uppercase mb-md leading-[1] md:leading-[1.1]">
                {eventData.contactSubtitle ? (
                  <>
                    {eventData.contactSubtitle.split(' ').slice(0, -2).join(' ')} <br /> 
                    <span className="text-neon-yellow">{eventData.contactSubtitle.split(' ').slice(-2).join(' ')}</span>
                  </>
                ) : (
                  <>Información <br /> <span className="text-neon-yellow">De Enlace</span></>
                )}
              </h2>
              <p className="font-body-lg text-[20px] md:text-[22px] text-on-surface-variant leading-relaxed whitespace-pre-line">
                {eventData.contactDescription || "¿Tienes dudas sobre las entradas, el evento o quieres colaborar? Escríbenos y nuestro equipo te responderá en menos de 48 horas."}
              </p>
            </div>

            <div className="grid gap-md">
              <CopyContactCard 
                type="email" 
                icon="mail" 
                label="Email (Clic para copiar)" 
                value={eventData.contactEmail || "contacto@strikeandbeat.com"} 
              />

              {eventData.contactPhone && (
                <CopyContactCard 
                  type="phone" 
                  icon="phone" 
                  label="Teléfono (Clic para copiar)" 
                  value={eventData.contactPhone} 
                />
              )}

              <CopyContactCard 
                type="location" 
                icon="map" 
                label="Localización" 
                value={eventData.locationName || "Arroyo Vallejo, Pabellón"} 
              />

              <CopyContactCard 
                type="hours" 
                icon="clock" 
                label="Atención" 
                value={eventData.contactHours || "L-V: 10:00 - 18:00"} 
              />
            </div>

            {/* Bloque Asociacion */}
            <div className="bg-neon-yellow p-lg">
              <h3 className="font-display-xl text-headline-md text-surface uppercase mb-xs">
                {eventData.contactAssociationTitle || "Caminando Juntos"}
              </h3>
              <p className="font-body-md text-surface/80 leading-snug whitespace-pre-line">
                {eventData.contactAssociationText || "Strike & Beat es un evento solidario organizado a beneficio de la Asociación Caminando. Cada entrada ayuda directamente a mejorar vidas."}
              </p>
            </div>
          </div>

          {/* Formulario (7 cols) */}
          <div className="lg:col-span-7 bg-surface-variant/5 p-lg md:p-xl border border-outline-variant relative">
            <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-neon-yellow opacity-20"></div>
            
            <form className="space-y-lg">
              <div className="grid md:grid-cols-2 gap-lg">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-on-surface-variant uppercase text-xs">Tu Nombre</label>
                  <input 
                    type="text" 
                    placeholder="EJ: JUAN PÉREZ"
                    className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md uppercase font-body-md"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-on-surface-variant uppercase text-xs">Tu Email</label>
                  <input 
                    type="email" 
                    placeholder="TU@EMAIL.COM"
                    className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md uppercase font-body-md"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-bold text-on-surface-variant uppercase text-xs">Asunto</label>
                <input 
                  type="text" 
                  placeholder="¿EN QUÉ PODEMOS AYUDARTE?"
                  className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md uppercase font-body-md"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-bold text-on-surface-variant uppercase text-xs">Mensaje</label>
                <textarea 
                  rows={6}
                  placeholder="ESCRIBE TU MENSAJE AQUÍ..."
                  className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md uppercase font-body-md resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-neon-yellow text-surface font-display-xl text-headline-md py-lg uppercase tracking-tighter hover:bg-white transition-all active:scale-[0.97] flex items-center justify-center gap-md"
              >
                Enviar Mensaje
                <Send size={24} />
              </button>

              <p className="text-center text-caption font-caption text-on-surface-variant uppercase tracking-widest text-[10px]">
                Al enviar aceptas nuestra política de privacidad
              </p>
            </form>
          </div>
        </div>

        {/* Footer Nav Links */}
        <nav className="mt-xl pt-lg border-t border-outline-variant flex justify-center items-center">
          <Link 
            href="/" 
            className="group flex items-center gap-sm px-xl py-md border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-surface transition-all font-label-bold text-xs uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Volver a la lona
          </Link>
        </nav>
      </div>
    </div>
  )
}
