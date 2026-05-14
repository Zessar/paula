"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

/* ------------------------------------------------------------------ */
/*  SIDEBAR NAVIGATION                                                 */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/ventas", label: "Ventas", icon: "receipt_long" },
  { href: "/admin/combates", label: "Combates", icon: "sports_mma" },
  { href: "/admin/artistas", label: "Artistas", icon: "mic_external_on" },
  { href: "/admin/patrocinadores", label: "Sponsors", icon: "handshake" },
  { href: "/admin/entradas", label: "Entradas", icon: "confirmation_number" },
  { href: "/admin/ajustes", label: "Ajustes", icon: "settings" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Cerrar el menu en movil cuando cambie la ruta
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* ============================================================ */}
      {/*  MOBILE OVERLAY                                              */}
      {/* ============================================================ */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ============================================================ */}
      {/*  SIDEBAR                                                     */}
      {/* ============================================================ */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[70] w-64 bg-surface-container-lowest border-r-2 border-outline-variant flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo / Branding */}
        <div className="p-lg border-b-2 border-outline-variant flex items-center justify-between">
          <Link href="/admin" className="block" onClick={() => setIsMobileMenuOpen(false)}>
            <h1 className="font-display-xl text-headline-md text-neon-yellow uppercase tracking-wider">
              S&B
            </h1>
            <p className="font-label-bold text-xs text-outline uppercase tracking-[0.3em] mt-xs">
              Admin Panel
            </p>
          </Link>
          <button 
            className="lg:hidden text-on-surface-variant hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Cerrar menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-md overflow-y-auto">
          <ul className="space-y-0">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-md px-lg py-md font-label-bold text-label-bold uppercase tracking-wider transition-all border-l-4 ${
                      active
                        ? "border-neon-yellow text-neon-yellow bg-surface-container"
                        : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low hover:border-outline"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer / Version */}
        <div className="p-md border-t-2 border-outline-variant">
          <div className="flex items-center gap-sm">
            <span className="w-2 h-2 bg-green-500 flex-shrink-0"></span>
            <span className="font-caption text-caption text-outline uppercase tracking-wider">
              Sistema Activo
            </span>
          </div>
          <p className="font-caption text-caption text-outline mt-xs">
            v0.1.0-dev
          </p>
        </div>
      </aside>

      {/* ============================================================ */}
      {/*  MAIN CONTENT                                                */}
      {/* ============================================================ */}
      <main className="flex-1 min-h-screen overflow-x-hidden w-full lg:w-[calc(100%-16rem)]">
        {/* Header bar */}
        <header className="sticky top-0 z-30 bg-surface-container-low/80 backdrop-blur-sm border-b-2 border-outline-variant px-md lg:px-lg py-md flex items-center justify-between">
          <div className="flex items-center gap-md">
            <button 
              className="lg:hidden text-on-surface-variant hover:text-white flex items-center justify-center w-10 h-10 border border-outline-variant bg-surface-container"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Abrir menu"
            >
              <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
            </button>
            <span className="material-symbols-outlined text-on-surface-variant hidden sm:block">terminal</span>
            <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-widest hidden sm:block">
              {NAV_ITEMS.find((i) => isActive(i.href))?.label || "Admin"}
            </span>
          </div>
          <div className="flex items-center gap-md">
            <span className="font-caption text-caption text-outline uppercase hidden sm:block">
              {new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
            <div className="w-8 h-8 bg-neon-yellow flex items-center justify-center">
              <span className="material-symbols-outlined text-surface text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                person
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-md lg:p-lg w-full max-w-[100vw]">
          {children}
        </div>
      </main>
    </div>
  )
}
