"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FAQSchema, type FAQInput } from "@/lib/validations/faq";
import { createFAQ, updateFAQ, deleteFAQ } from "@/app/actions/faqs";
import type { FAQ } from "@/lib/mockData";

interface AdminFaqClientProps {
  initialFaqs: FAQ[];
}

export default function AdminFaqClient({ initialFaqs }: AdminFaqClientProps) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FAQInput>({
    resolver: zodResolver(FAQSchema),
  });

  const openCreate = () => {
    setIsCreating(true);
    setEditingFaq(null);
    reset({
      question: "",
      answer: "",
      sort_order: faqs.length > 0 ? Math.max(...faqs.map(f => f.sort_order || 0)) + 10 : 10,
    });
  };

  const openEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setIsCreating(false);
    reset({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      sort_order: faq.sort_order || 0,
    });
  };

  const closeEditor = () => {
    setEditingFaq(null);
    setIsCreating(false);
    setApiError("");
    setSaveSuccess(false);
  };

  const onSubmit = async (data: FAQInput) => {
    setIsSubmitting(true);
    setApiError("");
    
    const result = isCreating 
      ? await createFAQ(data)
      : await updateFAQ({ ...data, id: editingFaq?.id });

    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => {
        window.location.reload(); // Recarga simple para ver cambios reflejados
      }, 1500);
    } else {
      setApiError(result.error || "Error al procesar la solicitud");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta pregunta?")) return;
    
    setIsSubmitting(true);
    const result = await deleteFAQ(id);
    if (result.success) {
      window.location.reload();
    } else {
      setApiError(result.error || "Error al eliminar");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
      {/* LISTADO DE FAQS */}
      <div className="lg:col-span-7 space-y-md">
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-headline-md text-headline-md uppercase text-white">Listado Actual</h3>
          <button
            onClick={openCreate}
            className="flex items-center gap-sm px-md py-sm bg-neon-yellow text-surface font-label-bold uppercase tracking-widest hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Nueva FAQ
          </button>
        </div>

        {faqs.length === 0 ? (
          <div className="p-xl border-2 border-dashed border-outline-variant text-center">
            <p className="font-body-md text-on-surface-variant italic">No hay preguntas frecuentes registradas.</p>
          </div>
        ) : (
          <div className="space-y-sm">
            {faqs
              .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
              .map((faq) => (
              <div 
                key={faq.id}
                className={`p-md border-2 transition-all ${
                  editingFaq?.id === faq.id 
                    ? "border-neon-yellow bg-surface-container-high" 
                    : "border-outline-variant bg-surface-container-low hover:border-outline"
                }`}
              >
                <div className="flex justify-between items-start gap-md">
                  <div className="flex-1">
                    <span className="font-label-bold text-[10px] text-neon-yellow uppercase tracking-[0.2em] mb-xs block">
                      Orden: {faq.sort_order}
                    </span>
                    <h4 className="font-headline-sm text-white uppercase mb-xs">{faq.question}</h4>
                    <p className="font-body-sm text-on-surface-variant line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <button
                      onClick={() => openEdit(faq)}
                      className="p-sm bg-surface border border-outline-variant text-white hover:border-neon-yellow transition-colors"
                      title="Editar"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-sm bg-surface border border-outline-variant text-error hover:bg-error hover:text-white transition-all"
                      title="Eliminar"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDITOR */}
      <div className="lg:col-span-5 sticky top-24">
        {(isCreating || editingFaq) ? (
          <div className="p-lg border-2 border-neon-yellow bg-surface-container-high relative overflow-hidden">
            {/* Animación de fondo sutil */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[120px]">help</span>
            </div>

            <div className="relative z-10">
              <h3 className="font-headline-md text-headline-md uppercase text-neon-yellow mb-lg">
                {isCreating ? "Crear FAQ" : "Editar FAQ"}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg">
                {/* Pregunta */}
                <div className="space-y-xs">
                  <label className="font-label-bold text-xs text-on-surface-variant uppercase tracking-widest block">
                    Pregunta
                  </label>
                  <input
                    {...register("question")}
                    className="w-full bg-surface border-2 border-outline-variant p-md font-body-md text-white focus:border-neon-yellow outline-none transition-colors"
                    placeholder="Escribe la pregunta..."
                  />
                  {errors.question && (
                    <p className="text-error font-label-bold text-[10px] uppercase mt-xs italic">
                      {errors.question.message}
                    </p>
                  )}
                </div>

                {/* Respuesta */}
                <div className="space-y-xs">
                  <label className="font-label-bold text-xs text-on-surface-variant uppercase tracking-widest block">
                    Respuesta
                  </label>
                  <textarea
                    {...register("answer")}
                    rows={6}
                    className="w-full bg-surface border-2 border-outline-variant p-md font-body-md text-white focus:border-neon-yellow outline-none transition-colors resize-none"
                    placeholder="Escribe la respuesta detallada..."
                  />
                  {errors.answer && (
                    <p className="text-error font-label-bold text-[10px] uppercase mt-xs italic">
                      {errors.answer.message}
                    </p>
                  )}
                </div>

                {/* Orden */}
                <div className="space-y-xs">
                  <label className="font-label-bold text-xs text-on-surface-variant uppercase tracking-widest block">
                    Orden de Clasificación
                  </label>
                  <input
                    type="number"
                    {...register("sort_order")}
                    className="w-full bg-surface border-2 border-outline-variant p-md font-body-md text-white focus:border-neon-yellow outline-none transition-colors"
                  />
                  <p className="text-[10px] text-outline uppercase font-label-bold italic">
                    Números menores aparecen primero (ej: 10, 20, 30)
                  </p>
                </div>

                {apiError && (
                  <div className="p-md bg-error/10 border border-error text-error font-label-bold text-[11px] uppercase tracking-wider italic">
                    {apiError}
                  </div>
                )}

                {saveSuccess && (
                  <div className="p-md bg-green-500/10 border border-green-500 text-green-500 font-label-bold text-[11px] uppercase tracking-wider italic">
                    ¡Guardado con éxito! Recargando...
                  </div>
                )}

                <div className="flex gap-md pt-md">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-md bg-neon-yellow text-surface font-display-md text-label-lg uppercase tracking-widest hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-sm"
                  >
                    {isSubmitting ? (
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined">save</span>
                    )}
                    {isCreating ? "Crear" : "Guardar"}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditor}
                    className="px-lg py-md border-2 border-outline-variant text-on-surface-variant font-display-md text-label-lg uppercase tracking-widest hover:border-white hover:text-white transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center opacity-40">
            <span className="material-symbols-outlined text-[60px] mb-md text-outline">
              quiz
            </span>
            <p className="font-body-md text-on-surface-variant uppercase tracking-widest">
              Selecciona una FAQ para editar<br />o crea una nueva
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
