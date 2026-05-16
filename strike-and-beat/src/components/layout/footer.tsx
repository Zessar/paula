import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest w-full pt-2xl pb-xl border-t border-outline-variant mt-2xl">
      <div className="max-w-container-max mx-auto px-gutter">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row md:justify-between items-end md:items-end gap-y-xl text-right md:text-left mt-[50px]">
          {/* Brand Section */}
          <Link href="/" className="flex flex-col gap-xs items-end md:items-start group">
            <h2 className="font-display-xl text-[48px] sm:text-[56px] md:text-[80px] leading-[0.8] uppercase text-white tracking-tighter group-hover:text-neon-yellow transition-colors">
              STRIKE <span className="text-neon-yellow">&</span> BEAT
            </h2>
          </Link>

          {/* Links Section */}
          <nav className="flex flex-wrap justify-end md:justify-end gap-x-lg gap-y-sm w-full md:w-auto">
            <Link
              className="text-on-surface-variant font-label-bold uppercase tracking-widest hover:text-neon-yellow transition-colors text-base md:text-sm relative group whitespace-nowrap"
              href="/terminos-de-uso"
            >
              Términos de Uso
              <span className="absolute -bottom-1 left-0 right-0 mx-auto w-0 h-[2px] bg-neon-yellow transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              className="text-on-surface-variant font-label-bold uppercase tracking-widest hover:text-neon-yellow transition-colors text-base md:text-sm relative group whitespace-nowrap"
              href="/privacidad-de-datos"
            >
              Privacidad
              <span className="absolute -bottom-1 left-0 right-0 mx-auto w-0 h-[2px] bg-neon-yellow transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              className="text-on-surface-variant font-label-bold uppercase tracking-widest hover:text-neon-yellow transition-colors text-base md:text-sm relative group whitespace-nowrap"
              href="/contacto"
            >
              Contacto
              <span className="absolute -bottom-1 left-0 right-0 mx-auto w-0 h-[2px] bg-neon-yellow transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-xl pt-lg pb-[20px] border-t border-outline-variant/30 flex justify-center">
          <p className="font-label-bold text-[10px] md:text-[12px] uppercase tracking-[0.2em] text-on-surface-variant/50">
            © 2026 STRIKE & BEAT. TODOS LOS DERECHOS RESERVADOS.
          </p>
        </div>
      </div>
    </footer>
  );
}
