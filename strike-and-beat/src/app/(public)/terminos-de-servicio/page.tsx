import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terminos de Servicio | Strike & Beat",
  description: "Terminos y condiciones de uso de la plataforma Strike & Beat.",
}

export default function TerminosDeServicioPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Cabecera */}
      <section className="bg-surface-dim border-b-[4px] border-primary py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="font-label font-bold text-xs uppercase tracking-wider text-outline mb-2">
            Legal
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-foreground uppercase leading-[0.9]">
            Terminos de <span className="text-primary">Servicio</span>
          </h1>
        </div>
      </section>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <div className="space-y-10 font-body text-lg text-outline leading-relaxed">

          <div className="p-4 border-2 border-tertiary bg-surface-dim">
            <p className="font-label font-bold text-sm uppercase tracking-wider text-tertiary mb-1">
              Aviso importante
            </p>
            <p className="text-foreground">
              Este documento contiene textos de ejemplo que deben ser revisados y adaptados por
              el departamento legal de <strong className="text-tertiary">[RAZON SOCIAL]</strong> con
              CIF <strong className="text-tertiary">[CIF]</strong> antes de su publicacion definitiva.
            </p>
          </div>

          <section>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4 pb-2 border-b border-neutral-charcoal">
              1. Identificacion del titular
            </h2>
            <p>
              En cumplimiento del deber de informacion establecido en la Ley 34/2002, de 11 de julio,
              de Servicios de la Sociedad de la Informacion y del Comercio Electronico (LSSI-CE), se
              facilitan los siguientes datos del titular de este sitio web:
            </p>
            <ul className="list-none space-y-2 mt-4 pl-4 border-l-2 border-neutral-charcoal">
              <li><strong className="text-foreground">Denominacion social:</strong> <span className="text-tertiary">[RAZON SOCIAL / Asociacion Caminando]</span></li>
              <li><strong className="text-foreground">CIF:</strong> <span className="text-tertiary">[CIF]</span></li>
              <li><strong className="text-foreground">Domicilio:</strong> <span className="text-tertiary">[DIRECCION FISCAL COMPLETA]</span></li>
              <li><strong className="text-foreground">Email de contacto:</strong> <span className="text-tertiary">[EMAIL]</span></li>
              <li><strong className="text-foreground">Telefono:</strong> <span className="text-tertiary">[TELEFONO]</span></li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4 pb-2 border-b border-neutral-charcoal">
              2. Objeto y ambito de aplicacion
            </h2>
            <p>
              Los presentes Terminos de Servicio regulan el acceso y uso de la plataforma Strike &amp; Beat
              (en adelante, "la Plataforma"), accesible a traves de la URL <span className="text-tertiary">[URL DEL SITIO]</span>,
              asi como la compra de entradas para los eventos organizados bajo esta marca.
            </p>
            <p className="mt-4">
              El acceso a la Plataforma implica la aceptacion integra y sin reservas de todos y cada uno
              de los terminos recogidos en este documento. Si el usuario no esta de acuerdo con alguno de
              los terminos aqui expuestos, debera abstenerse de utilizar la Plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4 pb-2 border-b border-neutral-charcoal">
              3. Condiciones de compra de entradas
            </h2>
            <p>
              La adquisicion de entradas a traves de la Plataforma esta sujeta a las siguientes condiciones:
            </p>
            <ul className="list-none space-y-3 mt-4 pl-4 border-l-2 border-neutral-charcoal">
              <li>
                <strong className="text-foreground">Limite por pedido:</strong> Se establece un maximo de 10 entradas
                por transaccion y tipo de entrada.
              </li>
              <li>
                <strong className="text-foreground">Datos de facturacion:</strong> Para la emision de la factura correspondiente,
                el comprador debera facilitar obligatoriamente su nombre completo, DNI/NIF/NIE, email y direccion postal.
              </li>
              <li>
                <strong className="text-foreground">Metodo de pago:</strong> El pago se realiza a traves de la pasarela segura
                Stripe. En ningun momento la Plataforma almacena datos de tarjetas de credito o debito.
              </li>
              <li>
                <strong className="text-foreground">Confirmacion:</strong> Tras completar la compra, el usuario recibira un
                email de confirmacion con un codigo QR unico que servira como entrada al evento.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4 pb-2 border-b border-neutral-charcoal">
              4. Politica de devoluciones y cancelaciones
            </h2>
            <p>
              Las solicitudes de devolucion se aceptaran hasta <strong className="text-foreground">48 horas antes</strong> del
              inicio del evento. Una vez transcurrido ese plazo, no se realizaran reembolsos.
            </p>
            <p className="mt-4">
              En caso de cancelacion del evento por causas de fuerza mayor, los compradores seran informados
              por email y se procedera al reembolso integro del importe abonado en un plazo maximo de 14 dias
              habiles a traves del mismo metodo de pago utilizado en la compra.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4 pb-2 border-b border-neutral-charcoal">
              5. Propiedad intelectual e industrial
            </h2>
            <p>
              Todos los contenidos de la Plataforma, incluyendo imagenes, textos, logos, disenos graficos,
              marcas, nombres comerciales y cualquier otro signo distintivo, son propiedad exclusiva de
              <span className="text-tertiary"> [RAZON SOCIAL]</span> o de terceros que han autorizado su uso.
              Queda expresamente prohibida la reproduccion, distribucion o transformacion de dichos contenidos
              sin autorizacion expresa y por escrito.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4 pb-2 border-b border-neutral-charcoal">
              6. Limitacion de responsabilidad
            </h2>
            <p>
              <span className="text-tertiary">[RAZON SOCIAL]</span> no se hace responsable de los danos y perjuicios
              derivados del uso inadecuado de la Plataforma por parte del usuario, ni de la imposibilidad
              temporal de acceso a la misma por razones tecnicas, de mantenimiento o causas ajenas a su voluntad.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4 pb-2 border-b border-neutral-charcoal">
              7. Legislacion aplicable y jurisdiccion
            </h2>
            <p>
              Los presentes Terminos se rigen por la legislacion espanola vigente. Para la resolucion de
              cualquier controversia derivada del uso de la Plataforma, las partes se someten a la jurisdiccion
              de los Juzgados y Tribunales de <span className="text-tertiary">[CIUDAD]</span>, renunciando
              expresamente a cualquier otro fuero que pudiera corresponderles.
            </p>
          </section>

          <div className="pt-6 border-t-2 border-neutral-charcoal text-sm text-outline">
            <p>Ultima actualizacion: <span className="text-tertiary">[FECHA]</span></p>
          </div>

        </div>

        {/* Navegacion entre paginas legales */}
        <nav className="mt-12 pt-8 border-t-2 border-neutral-charcoal flex flex-wrap gap-6 font-label font-bold text-sm uppercase tracking-wider">
          <Link href="/politica-de-privacidad" className="text-outline hover:text-tertiary transition-colors">
            Politica de Privacidad
          </Link>
          <Link href="/contacto" className="text-outline hover:text-tertiary transition-colors">
            Contacto
          </Link>
          <Link href="/" className="text-outline hover:text-primary transition-colors ml-auto">
            &larr; Volver al inicio
          </Link>
        </nav>
      </div>
    </div>
  )
}
