"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/combates", label: "Combates" },
    { href: "/artistas", label: "Artistas" },
    { href: "/info", label: "Info" },
    { href: "/entradas", label: "Entradas" },
  ];

  return (
    <header className="bg-surface w-full sticky top-0 z-[100] border-b-2 border-outline-variant">
      <div className="max-w-container-max mx-auto px-gutter min-h-[70px] md:h-16 flex items-center justify-center md:justify-between py-sm md:py-0">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <h1 className="font-display-xl text-[42px] md:text-headline-lg text-primary italic uppercase leading-none tracking-tighter">
            STRIKE <span className="text-white">&amp;</span> BEAT
          </h1>
        </Link>

        {/* NAV - Solo visible en desktop */}
        <nav className="hidden md:flex gap-lg items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`uppercase px-sm py-xs text-label-bold transition-all ${isActive
                  ? "text-primary border-b-2 border-primary"
                  : "text-on-surface hover:text-primary"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
