import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Política de Privacidad | Strike & Beat",
  description: "Política de privacidad y protección de datos de Strike & Beat.",
}

export default function PoliticaDePrivacidadPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-surface-dim border-b-[4px] border-neon-yellow py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="font-label-bold text-xs uppercase tracking-[0.3em] text-outline mb-4">Sección Legal</div>
          <h1 className="font-display-xl text-5xl md:text-8xl text-white uppercase leading-[0.85] tracking-tighter">
            Política de <br/><span className="text-neon-yellow">Privacidad</span>
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <div className="space-y-12 font-body-md text-lg text-on-surface-variant leading-relaxed">

          <div className="p-6 border-2 border-neon-yellow/30 bg-neon-yellow/5 flex gap-4 items-start">
             <span className="material-symbols-outlined text-neon-yellow" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
             <div>
                <p className="font-label-bold text-sm uppercase tracking-wider text-neon-yellow mb-1">Nota para el Administrador</p>
                <p className="text-on-surface text-sm">
                  Este documento es una base legal robusta. Asegúrate de sustituir los campos entre corchetes <strong>[ ]</strong> con los datos reales de tu entidad o asociación antes del lanzamiento definitivo.
                </p>
             </div>
          </div>

          <section className="space-y-4">
            <h2 className="font-headline-md text-3xl text-white uppercase border-b-2 border-outline-variant pb-2">1. Responsable del tratamiento</h2>
            <p>
              El presente documento establece la política de privacidad de <strong>Strike & Beat</strong>, gestionada por <strong>[RAZON SOCIAL / ASOCIACIÓN CAMINANDO]</strong>, con domicilio en [DIRECCIÓN COMPLETA] y CIF [CIF].
            </p>
            <p>
              Puedes contactar con nuestro Delegado de Protección de Datos en: <span className="text-neon-yellow">[EMAIL DE CONTACTO]</span>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline-md text-3xl text-white uppercase border-b-2 border-outline-variant pb-2">2. Información que recopilamos</h2>
            <p>Para la correcta gestión del evento y la venta de entradas, recopilamos los siguientes datos:</p>
            <ul className="list-none space-y-4 pl-4 border-l-2 border-neon-yellow/50">
              <li>
                <strong className="text-white uppercase text-sm block">Datos de Identificación:</strong> 
                Nombre completo, DNI/NIF/NIE (requerido legalmente para facturación) y dirección de correo electrónico.
              </li>
              <li>
                <strong className="text-white uppercase text-sm block">Datos de Contacto:</strong> 
                Número de teléfono (opcional, para comunicaciones urgentes o marketing si lo autorizas).
              </li>
              <li>
                <strong className="text-white uppercase text-sm block">Datos de Facturación:</strong> 
                Dirección física completa para la emisión de la factura legal.
              </li>
              <li>
                <strong className="text-white uppercase text-sm block">Datos de Pago:</strong> 
                Las transacciones son procesadas íntegramente por <strong>Stripe</strong>. No almacenamos ni tenemos acceso a los números de tu tarjeta de crédito o débito.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline-md text-3xl text-white uppercase border-b-2 border-outline-variant pb-2">3. Uso de los datos (Finalidad)</h2>
            <p>Utilizamos tu información exclusivamente para:</p>
            <ol className="list-decimal space-y-3 pl-6">
              <li>Procesar la compra de tus entradas y enviarte el código QR de acceso.</li>
              <li>Cumplir con las obligaciones fiscales vigentes en España.</li>
              <li>Notificarte cualquier cambio, aplazamiento o cancelación del evento.</li>
              <li>Si has dado tu consentimiento, informarte sobre futuros eventos de Strike & Beat.</li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline-md text-3xl text-white uppercase border-b-2 border-outline-variant pb-2">4. Cookies y Seguimiento</h2>
            <p>
              Utilizamos cookies técnicas esenciales para el funcionamiento del carrito de compra y la seguridad del sitio. No utilizamos cookies de rastreo de terceros para publicidad sin tu consentimiento previo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline-md text-3xl text-white uppercase border-b-2 border-outline-variant pb-2">5. Derechos del Usuario</h2>
            <p>
              De acuerdo con el RGPD, tienes derecho a acceder, rectificar, suprimir o limitar el tratamiento de tus datos personales. 
            </p>
            <p>
              Para ejercer estos derechos, envía un correo a <span className="text-neon-yellow">[EMAIL]</span> adjuntando una copia de tu documento de identidad. También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).
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
