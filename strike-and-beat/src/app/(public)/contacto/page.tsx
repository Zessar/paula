import { Metadata } from "next"
import Link from "next/link"
import { Mail, MapPin, Clock, Send, Phone } from "lucide-react"
import { getEventInfo } from "@/lib/supabase/queries"

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
      <section className="relative h-[40vh] min-h-[350px] w-full flex flex-col justify-center overflow-hidden border-b-4 border-neon-yellow pt-12">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-surface"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
        
        <div className="relative z-10 px-gutter w-full max-w-container-max mx-auto">
          <div className="bg-neon-yellow text-surface inline-block px-md py-xs font-headline-md text-[20px] md:text-[24px] uppercase mb-sm tracking-widest">
            Estamos Aquí
          </div>
          <h1 className="font-display-xl text-[18vw] md:text-[10vw] lg:text-[100px] uppercase text-white leading-[0.9] tracking-[0.02em] flex flex-col items-start">
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
              <h2 className="font-display-xl text-headline-lg text-white uppercase mb-md">
                {eventData.contactSubtitle ? (
                  <>
                    {eventData.contactSubtitle.split(' ').slice(0, -2).join(' ')} <br /> 
                    <span className="text-neon-yellow">{eventData.contactSubtitle.split(' ').slice(-2).join(' ')}</span>
                  </>
                ) : (
                  <>Información <br /> <span className="text-neon-yellow">De Enlace</span></>
                )}
              </h2>
              <p className="font-body-lg text-on-surface-variant leading-relaxed">
                {eventData.contactDescription || "¿Tienes dudas sobre las entradas, el evento o quieres colaborar? Escríbenos y nuestro equipo te responderá en menos de 48 horas."}
              </p>
            </div>

            <div className="grid gap-md">
              <div className="group flex items-center gap-md p-lg border border-outline-variant bg-surface-variant/10 hover:border-neon-yellow transition-all">
                <div className="w-14 h-14 bg-neon-yellow/10 flex items-center justify-center group-hover:bg-neon-yellow transition-colors">
                  <Mail className="text-neon-yellow group-hover:text-surface transition-colors" />
                </div>
                <div>
                  <p className="font-label-bold text-on-surface-variant text-xs uppercase tracking-widest">Email</p>
                  <p className="font-headline-md text-white">{eventData.contactEmail || "contacto@strikeandbeat.com"}</p>
                </div>
              </div>

              {eventData.contactPhone && (
                <div className="group flex items-center gap-md p-lg border border-outline-variant bg-surface-variant/10 hover:border-neon-yellow transition-all">
                  <div className="w-14 h-14 bg-neon-yellow/10 flex items-center justify-center group-hover:bg-neon-yellow transition-colors">
                    <Phone className="text-neon-yellow group-hover:text-surface transition-colors" />
                  </div>
                  <div>
                    <p className="font-label-bold text-on-surface-variant text-xs uppercase tracking-widest">Teléfono</p>
                    <p className="font-headline-md text-white">{eventData.contactPhone}</p>
                  </div>
                </div>
              )}

              <div className="group flex items-center gap-md p-lg border border-outline-variant bg-surface-variant/10 hover:border-neon-yellow transition-all">
                <div className="w-14 h-14 bg-neon-yellow/10 flex items-center justify-center group-hover:bg-neon-yellow transition-colors">
                  <MapPin className="text-neon-yellow group-hover:text-surface transition-colors" />
                </div>
                <div>
                  <p className="font-label-bold text-on-surface-variant text-xs uppercase tracking-widest">Localización</p>
                  <p className="font-headline-md text-white uppercase">{eventData.locationName || "Arroyo Vallejo, Pabellón"}</p>
                </div>
              </div>

              <div className="group flex items-center gap-md p-lg border border-outline-variant bg-surface-variant/10 hover:border-neon-yellow transition-all">
                <div className="w-14 h-14 bg-neon-yellow/10 flex items-center justify-center group-hover:bg-neon-yellow transition-colors">
                  <Clock className="text-neon-yellow group-hover:text-surface transition-colors" />
                </div>
                <div>
                  <p className="font-label-bold text-on-surface-variant text-xs uppercase tracking-widest">Atención</p>
                  <p className="font-headline-md text-white uppercase">{eventData.contactHours || "L-V: 10:00 - 18:00"}</p>
                </div>
              </div>
            </div>

            {/* Bloque Asociacion */}
            <div className="bg-neon-yellow p-lg">
              <h3 className="font-display-xl text-headline-md text-surface uppercase mb-xs">
                {eventData.contactAssociationTitle || "Caminando Juntos"}
              </h3>
              <p className="font-body-md text-surface/80 leading-snug">
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
        <nav className="mt-xl pt-lg border-t border-outline-variant flex flex-wrap gap-md justify-between items-center font-label-bold text-xs uppercase tracking-widest text-on-surface-variant">
          <div className="flex gap-lg">
            <Link href="/terminos" className="hover:text-neon-yellow transition-colors">Términos</Link>
            <Link href="/privacidad" className="hover:text-neon-yellow transition-colors">Privacidad</Link>
          </div>
          <Link href="/" className="text-neon-yellow hover:text-white transition-colors">
            &larr; Volver a la lona
          </Link>
        </nav>
      </div>
    </div>
  )
}
