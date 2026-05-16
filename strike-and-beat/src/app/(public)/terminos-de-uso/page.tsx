import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Términos de Uso | Strike & Beat",
  description: "Términos y condiciones de uso del sitio web y compra de entradas para Strike & Beat.",
}

export default function TerminosDeUsoPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-surface-dim border-b-[4px] border-neon-yellow py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="font-label-bold text-xs uppercase tracking-[0.3em] text-outline mb-4">Sección Legal</div>
          <h1 className="font-display-xl text-5xl md:text-8xl text-white uppercase leading-[0.85] tracking-tighter">
            Términos <br/><span className="text-neon-yellow">de Uso</span>
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <div className="space-y-12 font-body-md text-lg text-on-surface-variant leading-relaxed">

          <section className="space-y-4">
            <h2 className="font-headline-md text-3xl text-white uppercase border-b-2 border-outline-variant pb-2">1. Objeto y Aceptación</h2>
            <p>
              El presente documento establece las condiciones que regulan el acceso y uso del sitio web de <strong>Strike & Beat</strong> y la adquisición de entradas para el evento. Al utilizar este sitio o comprar una entrada, aceptas íntegramente estas condiciones.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline-md text-3xl text-white uppercase border-b-2 border-outline-variant pb-2">2. Proceso de Compra y Facturación</h2>
            <p>
              Para adquirir entradas, el usuario debe proporcionar sus datos reales y completos. De acuerdo con la normativa vigente en España, es obligatorio proporcionar el <strong>DNI, NIF o NIE</strong> para la emisión de la factura correspondiente.
            </p>
            <p>
              Una vez completado el pago a través de la pasarela segura Stripe, recibirás un correo electrónico de confirmación con tu(s) entrada(s) en formato digital (Código QR).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline-md text-3xl text-white uppercase border-b-2 border-outline-variant pb-2">3. Política de Devoluciones</h2>
            <p>
              Dado que se trata de un evento de ocio con una fecha específica, y de acuerdo con la legislación de consumo aplicable, <strong>no se admitirán devoluciones ni cambios de entradas</strong> una vez adquiridas, salvo en caso de cancelación o aplazamiento del evento por parte de la organización.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline-md text-3xl text-white uppercase border-b-2 border-outline-variant pb-2">4. Acceso al Evento</h2>
            <ul className="list-none space-y-4 pl-4 border-l-2 border-neon-yellow/50">
              <li>
                <strong className="text-white uppercase text-sm block">Identificación:</strong> 
                Es imprescindible presentar la entrada (digital o impresa) junto con un documento de identidad original para acceder al recinto.
              </li>
              <li>
                <strong className="text-white uppercase text-sm block">Derecho de Admisión:</strong> 
                La organización se reserva el derecho de admisión por motivos de seguridad, estado de embriaguez o comportamiento inapropiado.
              </li>
              <li>
                <strong className="text-white uppercase text-sm block">Edad Mínima:</strong> 
                El evento es para mayores de 18 años (salvo que se indique lo contrario en la descripción de la entrada específica).
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline-md text-3xl text-white uppercase border-b-2 border-outline-variant pb-2">5. Propiedad Intelectual</h2>
            <p>
              Todo el contenido del sitio web (logos, textos, imágenes de luchadores y artistas) está protegido por derechos de propiedad intelectual. Queda prohibida su reproducción o uso sin autorización expresa.
            </p>
          </section>

          <div className="pt-8 border-t border-outline-variant text-sm text-outline flex justify-between items-center">
            <p>Última actualización: 16 de Mayo, 2026</p>
            <p>Strike & Beat © 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}
