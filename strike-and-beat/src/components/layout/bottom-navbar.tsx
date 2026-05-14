"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNavBar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: "home", label: "Home" },
    { href: "/combates", icon: "sports_martial_arts", label: "Fights" },
    { href: "/artistas", icon: "album", label: "Music" },
    { href: "/info", icon: "info", label: "Info" },
    { href: "/entradas", icon: "local_activity", label: "Tickets" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface-container-highest dark:bg-surface-container-highest border-t-4 border-primary h-16 flex justify-around items-center">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center p-2 w-full h-full active:scale-90 transition-colors ${
              isActive
                ? "bg-primary text-surface"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-caption text-caption uppercase">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
