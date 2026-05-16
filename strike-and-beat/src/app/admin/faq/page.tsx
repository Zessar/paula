import { getFaqs } from "@/lib/supabase/queries";
import AdminFaqClient from "./admin-faq-client";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const faqs = await getFaqs();

  return (
    <div className="space-y-lg">
      <div className="flex flex-col gap-sm">
        <h2 className="font-display-xl text-headline-lg uppercase text-white tracking-wider">
          Gestión de <span className="text-neon-yellow">FAQs</span>
        </h2>
        <p className="font-body-md text-on-surface-variant max-w-2xl">
          Administra las preguntas frecuentes que aparecen en la página principal. 
          Puedes crear nuevas preguntas, editar las existentes o eliminarlas.
        </p>
      </div>

      <AdminFaqClient initialFaqs={faqs} />
    </div>
  );
}
