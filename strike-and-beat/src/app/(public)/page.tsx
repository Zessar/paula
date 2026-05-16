import { Hero } from "@/components/sections/hero";
import { Sponsors } from "@/components/sections/sponsors";
import { AboutEvent } from "@/components/sections/about-event";
import { FeaturedFights } from "@/components/sections/featured-fights";
import { ArtistsSection } from "@/components/sections/artists-section";
import { FAQ } from "@/components/sections/faq";
import { Location } from "@/components/sections/location";
import { getFaqs } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const faqs = await getFaqs();

  return (
    <main>
      <Hero />
      <Sponsors />
      <AboutEvent />
      <FeaturedFights />
      <ArtistsSection />
      <FAQ faqs={faqs} />
      <Location />
    </main>
  );
}
