import type { Metadata } from "next";
import { Bebas_Neue, Barlow_Condensed, Atkinson_Hyperlegible, Inter } from "next/font/google";
import "./globals.css";
import { getEventInfo } from "@/lib/supabase/queries";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: ["400"],
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson-hyperlegible",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strike & Beat",
  description: "Eventos de Combate y Urbano",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const eventInfo = await getEventInfo();
  
  // Custom Dynamic Theme
  const primaryColor = eventInfo.themePrimaryColor || "#cfbdff";
  const neonColor = eventInfo.themeNeonColor || "#facc15";
  const marqueeSpeed = eventInfo.marqueeSpeed ?? 50;

  return (
    <html
      lang="es"
      className={`dark ${bebasNeue.variable} ${barlowCondensed.variable} ${atkinson.variable} ${inter.variable} antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary-color: ${primaryColor};
            --neon-color: ${neonColor};
            --marquee-speed: ${marqueeSpeed}s;
          }
        `}} />
      </head>
      <body className="font-body-md bg-[#0a0a0a] text-[#e6e0e9]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
