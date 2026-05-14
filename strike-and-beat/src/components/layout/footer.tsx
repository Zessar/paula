import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest w-full py-xl border-t-2 border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter px-gutter max-w-container-max mx-auto">
        <div className="md:col-span-6">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">STRIKE &amp; BEAT</h2>
          <p className="font-body-md text-body-md uppercase tracking-tighter opacity-70">
            © 2024 STRIKE &amp; BEAT. RAW INDUSTRIAL ENERGY.
          </p>
        </div>
        <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-md items-start">
          <Link className="text-on-surface-variant font-body-md uppercase tracking-tighter hover:text-primary transition-opacity hover:opacity-80" href="/terminos-de-uso">Términos de Uso</Link>
          <Link className="text-on-surface-variant font-body-md uppercase tracking-tighter hover:text-primary transition-opacity hover:opacity-80" href="/privacidad-de-datos">Política de Privacidad</Link>
          <Link className="text-on-surface-variant font-body-md uppercase tracking-tighter hover:text-primary transition-opacity hover:opacity-80" href="/contacto">Contacto</Link>
          <Link className="text-on-surface-variant font-body-md uppercase tracking-tighter hover:text-primary transition-opacity hover:opacity-80" href="/prensa">Prensa</Link>
        </div>
      </div>
    </footer>
  );
}
