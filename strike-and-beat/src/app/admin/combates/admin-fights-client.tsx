"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FighterSchema, type FighterInput } from "@/lib/validations/admin";
import { createFighter, updateFighter, deleteFighter } from "@/app/actions/fighters";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Fighter } from "@/lib/mockData";

export function AdminFightsClient({ initialFights }: { initialFights: Fighter[] }) {
  const [fights, setFights] = useState<Fighter[]>(initialFights);
  const [editingFight, setEditingFight] = useState<Partial<Fighter> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FighterInput>({
    resolver: zodResolver(FighterSchema) as any,
  });

  const handleOpenModal = (fight?: Fighter) => {
    setApiError("");
    if (fight) {
      setEditingFight(fight);
      reset({
        id: fight.id,
        name_a: fight.nameA,
        image_a: fight.imageA,
        alias_a: fight.aliasA,
        name_b: fight.nameB,
        image_b: fight.imageB,
        alias_b: fight.aliasB,
        category: fight.category,
        rounds: fight.rounds,
        rules: fight.rules,
        is_featured: fight.isFeatured,
        badge_text: fight.badgeText || "",
        sort_order: 0,
        description_a: fight.descriptionA || "",
        description_b: fight.descriptionB || "",
        video_url: fight.videoUrl || "",
        slug: fight.slug || "",
      });
    } else {
      setEditingFight(null);
      reset({
        name_a: "",
        image_a: "",
        alias_a: "",
        name_b: "",
        image_b: "",
        alias_b: "",
        category: "",
        rounds: "3x3",
        rules: "Pro MMA",
        is_featured: false,
        badge_text: "",
        sort_order: fights.length,
        description_a: "",
        description_b: "",
        video_url: "",
        slug: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFight(null);
  };

  const onSubmit = async (data: FighterInput) => {
    setApiError("");
    const res = editingFight?.id
      ? await updateFighter({ ...data, id: editingFight.id })
      : await createFighter(data);

    if (res.success) {
      // Optimizacion UI (esperando al revalidate)
      if (!editingFight?.id) {
         window.location.reload();
      } else {
         window.location.reload();
      }
      handleCloseModal();
    } else {
      setApiError(res.error || "Ocurrió un error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este combate?")) {
      const res = await deleteFighter(id);
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error || "Ocurrió un error al eliminar");
      }
    }
  };

  return (
    <div className="space-y-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b-2 border-outline-variant pb-md gap-4">
        <div>
          <h2 className="font-display-xl text-headline-lg uppercase text-white">Gestión de Combates</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Administra la cartelera de peleas</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-neon-yellow text-surface font-label-bold text-label-bold py-sm px-md uppercase hover:bg-white transition-all flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Añadir Nuevo
        </button>
      </div>

      <div className="bg-surface-container border-2 border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-outline-variant bg-surface-container-low">
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase">Luchador A</th>
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase">Luchador B</th>
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase hidden md:table-cell">Categoría</th>
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase hidden lg:table-cell">Estelar</th>
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {fights.map((fight) => (
                <tr key={fight.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td className="p-md">
                    <div className="flex items-center gap-sm">
                      {fight.imageA ? (
                        <img src={fight.imageA} alt={fight.nameA} className="w-10 h-10 object-cover grayscale" />
                      ) : (
                        <div className="w-10 h-10 bg-surface flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline">person</span>
                        </div>
                      )}
                      <div>
                        <p className="font-label-bold uppercase text-white">{fight.nameA}</p>
                        <p className="font-caption text-caption text-outline">{fight.aliasA}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-md">
                    <div className="flex items-center gap-sm">
                      {fight.imageB ? (
                        <img src={fight.imageB} alt={fight.nameB} className="w-10 h-10 object-cover grayscale" />
                      ) : (
                        <div className="w-10 h-10 bg-surface flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline">person</span>
                        </div>
                      )}
                      <div>
                        <p className="font-label-bold uppercase text-white">{fight.nameB}</p>
                        <p className="font-caption text-caption text-outline">{fight.aliasB}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-md hidden md:table-cell font-body-md text-on-surface-variant">
                    {fight.category} <br />
                    <span className="text-xs text-outline">{fight.rounds} - {fight.rules}</span>
                  </td>
                  <td className="p-md hidden lg:table-cell">
                    {fight.badgeText ? (
                      <span className="bg-neon-yellow text-surface px-2 py-1 text-xs font-label-bold uppercase">{fight.badgeText}</span>
                    ) : (
                      <span className="bg-surface-container-high text-on-surface-variant px-2 py-1 text-xs font-label-bold uppercase">Sin etiqueta</span>
                    )}
                  </td>
                  <td className="p-md text-right">
                    <div className="flex justify-end gap-sm">
                      <button onClick={() => handleOpenModal(fight)} className="text-on-surface-variant hover:text-neon-yellow transition-colors" title="Editar">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button onClick={() => handleDelete(fight.id)} className="text-on-surface-variant hover:text-error transition-colors" title="Eliminar">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {fights.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-xl text-center text-on-surface-variant font-body-md">
                    No hay combates registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface-container border-2 border-neon-yellow w-full max-w-4xl my-auto">
            <div className="px-lg py-md border-b-2 border-neon-yellow flex items-center justify-between bg-neon-yellow/5">
              <h3 className="font-headline-md text-headline-md uppercase text-neon-yellow">
                {editingFight ? "Editar Combate" : "Nuevo Combate"}
              </h3>
              <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-lg space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                {/* LUCHADOR A */}
                <div className="space-y-sm bg-surface p-md border border-outline-variant">
                  <h4 className="font-label-bold uppercase text-white border-b border-outline-variant pb-xs">Luchador A</h4>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Nombre</label>
                    <input {...register("name_a")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                    {errors.name_a && <span className="text-error text-xs">{errors.name_a.message}</span>}
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Alias</label>
                    <input {...register("alias_a")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <ImageUpload 
                      label="Foto Luchador A"
                      value={watch("image_a") || ""}
                      onChange={(url) => setValue("image_a", url)}
                      folder="fights"
                    />
                    {errors.image_a && <span className="text-error text-xs">{errors.image_a.message}</span>}
                  </div>
                </div>

                {/* LUCHADOR B */}
                <div className="space-y-sm bg-surface p-md border border-outline-variant">
                  <h4 className="font-label-bold uppercase text-white border-b border-outline-variant pb-xs">Luchador B</h4>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Nombre</label>
                    <input {...register("name_b")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                    {errors.name_b && <span className="text-error text-xs">{errors.name_b.message}</span>}
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Alias</label>
                    <input {...register("alias_b")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <ImageUpload 
                      label="Foto Luchador B"
                      value={watch("image_b") || ""}
                      onChange={(url) => setValue("image_b", url)}
                      folder="fights"
                    />
                    {errors.image_b && <span className="text-error text-xs">{errors.image_b.message}</span>}
                  </div>
                </div>
              </div>

              {/* DETALLES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md bg-surface p-md border border-outline-variant">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Categoría / Peso</label>
                  <input {...register("category")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: Peso Medio - 84kg" />
                  {errors.category && <span className="text-error text-xs">{errors.category.message}</span>}
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Rondas</label>
                  <input {...register("rounds")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: 3x3 min" />
                  {errors.rounds && <span className="text-error text-xs">{errors.rounds.message}</span>}
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Reglas</label>
                  <input {...register("rules")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: Pro MMA" />
                  {errors.rules && <span className="text-error text-xs">{errors.rules.message}</span>}
                </div>
                <div className="flex flex-col gap-xs mt-sm md:col-span-3 border-t border-outline-variant pt-md">
                  <label className="font-label-bold text-xs uppercase text-outline">Etiqueta del Combate (Badge)</label>
                  <input {...register("badge_text")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: MAIN EVENT, CO-MAIN EVENT, COMBATE ESTELAR..." />
                  <div className="flex items-center gap-sm mt-xs">
                    <input type="checkbox" id="is_featured" {...register("is_featured")} className="w-4 h-4 accent-neon-yellow" />
                    <label htmlFor="is_featured" className="font-label-bold text-[10px] uppercase text-outline cursor-pointer italic">Marcar como destacado (uso interno)</label>
                  </div>
                </div>
              </div>

              {/* PERFIL Y BIO */}
              <div className="space-y-md bg-surface p-md border border-outline-variant">
                <p className="font-label-bold text-xs uppercase text-neon-yellow tracking-widest">Perfil publico del combate</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Descripcion {watch("name_a") || "Luchador A"}</label>
                    <textarea {...register("description_a")} rows={3} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" placeholder="Trayectoria, record, estilo de pelea..." />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Descripcion {watch("name_b") || "Luchador B"}</label>
                    <textarea {...register("description_b")} rows={3} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" placeholder="Trayectoria, record, estilo de pelea..." />
                  </div>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Video Promo (URL YouTube)</label>
                  <input {...register("video_url")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="https://youtube.com/watch?v=..." />
                  <span className="text-outline text-[10px]">Video promocional del combate que se mostrara en su pagina de perfil.</span>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Slug (URL del combate)</label>
                  <input {...register("slug")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="lobo-vs-tank (se genera automaticamente)" />
                  <span className="text-outline text-[10px]">Se usara como /combates/&#123;slug&#125;. Si se deja vacio se genera automaticamente.</span>
                </div>
              </div>

              {apiError && (
                <div className="p-3 border-2 border-error bg-error/10 text-error font-label-bold text-sm">
                  {apiError}
                </div>
              )}

              <div className="flex gap-md pt-sm justify-end">
                <button type="button" onClick={handleCloseModal} className="px-md py-sm border-2 border-outline-variant text-on-surface-variant font-label-bold uppercase hover:border-error hover:text-error transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="px-lg py-sm bg-neon-yellow text-surface font-label-bold uppercase hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-xs">
                  {isSubmitting ? "Guardando..." : "Guardar Combate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
