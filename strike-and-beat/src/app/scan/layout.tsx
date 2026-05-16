import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "S&B - Validador de Entradas",
  description: "Escáner de entradas QR para el evento Strike & Beat",
  robots: "noindex, nofollow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#121212",
};

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
      />
      {children}
    </>
  );
}
