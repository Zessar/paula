import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Politica de Privacidad | Strike & Beat",
  description: "Politica de privacidad y proteccion de datos de Strike & Beat.",
}

export default function PoliticaDePrivacidadPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-surface-dim border-b-[4px] border-primary py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="font-label font-bold text-xs uppercase tracking-wider text-outline mb-2">Legal</div>
          <h1 className="font-display text-5xl md:text-7xl text-foreground uppercase leading-[0.9]">
            Politica de <span className="text-primary">Privacidad</span>
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <div className="space-y-10 font-body text-lg text-outline leading-relaxed">

          <div className="p-4 border-2 border-tertiary bg-surface-dim">
            <p className="font-label font-bold text-sm uppercase tracking-wider text-tertiary mb-1">Aviso importante</p>
            <p className="text-foreground">
              Completar con los datos de <strong className="text-tertiary">[RAZON SOCIAL]</strong> CIF <strong className="text-tertiary">[CIF]</strong> antes de publicar.
            </p>
          </div>

          <section>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4 pb-2 border-b border-neutral-charcoal">1. Responsable del tratamiento</h2>
            <ul className="list-none space-y-2 pl-4 border-l-2 border-neutral-charcoal">
              <li><strong className="text-foreground">Responsable:</strong> <span className="text-tertiary">[RAZON SOCIAL / Asociacion Caminando]</span></li>
              <li><strong className="text-foreground">CIF:</strong> <span className="text-tertiary">[CIF]</span></li>
              <li><strong className="text-foreground">Domicilio:</strong> <span className="text-tertiary">[DIRECCION]</span></li>
              <li><strong className="text-foreground">Email DPD:</strong> <span className="text-tertiary">[EMAIL]</span></li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4 pb-2 border-b border-neutral-charcoal">2. Datos que recogemos</h2>
            <p>En el marco de la compra de entradas recogemos:</p>
            <ul className="list-none space-y-3 mt-4 pl-4 border-l-2 border-neutral-charcoal">
              <li><strong className="text-foreground">Datos identificativos:</strong> Nombre completo, DNI/NIF/NIE, direccion postal, email.</li>
              <li><strong className="text-foreground">Datos de transaccion:</strong> Historial de compras, importes. Stripe gestiona los datos de tarjeta; no los almacenamos.</li>
              <li><strong className="text-foreground">Datos de navegacion:</strong> IP, navegador, paginas visitadas. Recogidos mediante cookies tecnicas.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4 pb-2 border-b border-neutral-charcoal">3. Finalidad del tratamiento</h2>
            <ul className="list-none space-y-3 pl-4 border-l-2 border-neutral-charcoal">
              <li><strong className="text-foreground">Gestion de compra:</strong> Procesar pedidos, emitir facturas y enviar confirmaciones con QR.</li>
              <li><strong className="text-foreground">Obligaciones legales:</strong> Normativa fiscal espanola (factura con DNI/NIF/NIE).</li>
              <li><strong className="text-foreground">Comunicaciones:</strong> Informar sobre cambios o cancelaciones. Comunicaciones comerciales solo con consentimiento expreso.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4 pb-2 border-b border-neutral-charcoal">4. Base legal</h2>
            <p>
              Ejecucion de contrato (compra de entradas), cumplimiento de obligaciones legales (facturacion) y
              consentimiento del interesado (comunicaciones comerciales), conforme al RGPD y LOPDGDD 3/2018.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4 pb-2 border-b border-neutral-charcoal">5. Destinatarios</h2>
            <ul className="list-none space-y-3 pl-4 border-l-2 border-neutral-charcoal">
              <li><strong className="text-foreground">Stripe, Inc.:</strong> Pasarela de pago segura, encargado del tratamiento bajo RGPD.</li>
              <li><strong className="text-foreground">Supabase, Inc.:</strong> Infraestructura de base de datos.</li>
              <li><strong className="text-foreground">Administraciones publicas:</strong> Cuando exista obligacion legal.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4 pb-2 border-b border-neutral-charcoal">6. Conservacion</h2>
            <p>Datos de facturacion: minimo 4 anos (normativa fiscal). Datos de navegacion: 13 meses.</p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4 pb-2 border-b border-neutral-charcoal">7. Derechos del usuario</h2>
            <p>
              Acceso, rectificacion, supresion, oposicion, limitacion y portabilidad. Ejercitables enviando email
              a <span className="text-tertiary">[EMAIL DPD]</span> con copia del DNI. Derecho a reclamar ante la AEPD.
            </p>
          </section>

          <div className="pt-6 border-t-2 border-neutral-charcoal text-sm text-outline">
            <p>Ultima actualizacion: <span className="text-tertiary">[FECHA]</span></p>
          </div>
        </div>

        <nav className="mt-12 pt-8 border-t-2 border-neutral-charcoal flex flex-wrap gap-6 font-label font-bold text-sm uppercase tracking-wider">
          <Link href="/terminos-de-servicio" className="text-outline hover:text-tertiary transition-colors">Terminos de Servicio</Link>
          <Link href="/contacto" className="text-outline hover:text-tertiary transition-colors">Contacto</Link>
          <Link href="/" className="text-outline hover:text-primary transition-colors ml-auto">&larr; Volver al inicio</Link>
        </nav>
      </div>
    </div>
  )
}
