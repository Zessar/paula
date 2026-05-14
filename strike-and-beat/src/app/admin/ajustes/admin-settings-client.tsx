"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventInfoSchema, type EventInfoInput } from "@/lib/validations/admin";
import { updateEventInfo } from "@/app/actions/event";
import { ImageUpload } from "@/components/admin/ImageUpload";

export function AdminSettingsClient({ initialEventInfo }: { initialEventInfo: any }) {
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventInfoInput>({
    resolver: zodResolver(EventInfoSchema) as any,
    defaultValues: {
      id: initialEventInfo.id,
      title: initialEventInfo.title,
      event_date: initialEventInfo.date,
      doors_open_time: initialEventInfo.doorsOpen,
      location_name: initialEventInfo.locationName,
      location_address: initialEventInfo.locationAddress,
      location_logistics: initialEventInfo.locationLogistics || "",
      hero_image: initialEventInfo.heroImage || "",
      about_title: initialEventInfo.aboutTitle,
      about_text: initialEventInfo.aboutText,
      about_secondary_text: initialEventInfo.aboutSecondaryText || "",
      about_image: initialEventInfo.aboutImage || "",
      weigh_in_date: initialEventInfo.weighInDate || "",
      weigh_in_doors: initialEventInfo.weighInDoors || "",
      weigh_in_time: initialEventInfo.weighInTime || "",
      weigh_in_is_free: initialEventInfo.weighInIsFree ?? true,
      total_fights: initialEventInfo.totalFights || 0,
      total_artists: initialEventInfo.totalArtists || 0,
      total_bars: initialEventInfo.totalBars || 0,
      has_bars: initialEventInfo.hasBars ?? true,
      break_times: initialEventInfo.breakTimes || "",
      first_fight_time: initialEventInfo.firstFightTime || "",
      info_image: initialEventInfo.infoImage || "",
      location_logistics_title: initialEventInfo.locationLogisticsTitle || "Logística del recinto",
      weigh_in_title: initialEventInfo.weighInTitle || "Pesaje Oficial",
      weigh_in_text: initialEventInfo.weighInText || "",
      weigh_in_notice: initialEventInfo.weighInNotice || "",
      // Campos de contacto
      contact_title: initialEventInfo.contactTitle || "Contacta Con Nosotros",
      contact_subtitle: initialEventInfo.contactSubtitle || "Información De Enlace",
      contact_description: initialEventInfo.contactDescription || "",
      contact_email: initialEventInfo.contactEmail || "",
      contact_phone: initialEventInfo.contactPhone || "",
      contact_hours: initialEventInfo.contactHours || "L-V: 10:00 - 18:00",
      contact_association_title: initialEventInfo.contactAssociationTitle || "Caminando Juntos",
      contact_association_text: initialEventInfo.contactAssociationText || "",
    },
  });

  const onSubmit = async (data: EventInfoInput) => {
    setApiError("");
    setSuccessMsg("");
    
    const res = await updateEventInfo(data);

    if (res.success) {
      setSuccessMsg("Ajustes actualizados correctamente.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setApiError(res.error || "Ocurrió un error al guardar");
    }
  };

  return (
    <div className="space-y-lg max-w-4xl mx-auto">
      <div className="border-b-2 border-outline-variant pb-md">
        <h2 className="font-display-xl text-headline-lg uppercase text-white">Ajustes del Evento</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Configura la información general, ubicación y textos principales.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-xl">
        
        {/* INFORMACIÓN PRINCIPAL */}
        <div className="bg-surface-container border-2 border-outline-variant p-lg space-y-md">
          <h3 className="font-headline-md text-headline-sm uppercase text-neon-yellow border-b border-outline-variant pb-xs">Información Principal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="flex flex-col gap-xs md:col-span-2">
              <label className="font-label-bold text-xs uppercase text-outline">Título del Evento</label>
              <input {...register("title")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md w-full" />
              {errors.title && <span className="text-error text-xs">{errors.title.message}</span>}
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Fecha</label>
              <input {...register("event_date")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: 21 de Julio, 2024" />
              {errors.event_date && <span className="text-error text-xs">{errors.event_date.message}</span>}
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Apertura de Puertas</label>
              <input {...register("doors_open_time")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: Apertura de puertas 18:00H" />
              {errors.doors_open_time && <span className="text-error text-xs">{errors.doors_open_time.message}</span>}
            </div>
            
            <div className="flex flex-col gap-xs">
              <ImageUpload 
                label="Imagen Hero (Portada)"
                value={watch("hero_image") || ""}
                onChange={(url) => setValue("hero_image", url)}
                folder="event"
              />
              {errors.hero_image && <span className="text-error text-xs">{errors.hero_image.message}</span>}
            </div>

            <div className="flex flex-col gap-xs">
              <ImageUpload 
                label="Imagen Página Información"
                value={watch("info_image") || ""}
                onChange={(url) => setValue("info_image", url)}
                folder="event"
              />
              {errors.info_image && <span className="text-error text-xs">{errors.info_image.message}</span>}
            </div>
          </div>
        </div>

        {/* UBICACIÓN */}
        <div className="bg-surface-container border-2 border-outline-variant p-lg space-y-md">
          <h3 className="font-headline-md text-headline-sm uppercase text-neon-yellow border-b border-outline-variant pb-xs">Ubicación (Google Maps)</h3>
          <p className="text-sm text-on-surface-variant mb-4">El frontend utilizará esta dirección para incrustar el mapa.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Nombre del Recinto</label>
              <input {...register("location_name")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
              {errors.location_name && <span className="text-error text-xs">{errors.location_name.message}</span>}
            </div>

            <div className="flex flex-col gap-xs md:col-span-2">
              <label className="font-label-bold text-xs uppercase text-outline">Dirección Completa</label>
              <input {...register("location_address")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
              {errors.location_address && <span className="text-error text-xs">{errors.location_address.message}</span>}
            </div>
            
            <div className="flex flex-col gap-xs md:col-span-2">
              <label className="font-label-bold text-xs uppercase text-outline">Título de Sección Logística</label>
              <input {...register("location_logistics_title")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: Logística del recinto" />
            </div>

            <div className="flex flex-col gap-xs md:col-span-2">
              <label className="font-label-bold text-xs uppercase text-outline">Contenido de Logística</label>
              <textarea {...register("location_logistics")} rows={2} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" placeholder="Ej: Accesos, parking, transporte..." />
            </div>
          </div>
        </div>

        {/* LOGÍSTICA DEL EVENTO */}
        <div className="bg-surface-container border-2 border-outline-variant p-lg space-y-md">
          <h3 className="font-headline-md text-headline-sm uppercase text-neon-yellow border-b border-outline-variant pb-xs">Detalles del Evento</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Cantidad de Combates</label>
              <input type="number" {...register("total_fights")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Cantidad de Conciertos</label>
              <input type="number" {...register("total_artists")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Cantidad de Barras</label>
              <input type="number" {...register("total_bars")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Hora del Primer Combate</label>
              <input {...register("first_fight_time")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: 19:30H" />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Horarios de Descanso</label>
              <input {...register("break_times")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: 15 min después del 3er combate" />
            </div>

            <div className="flex items-center gap-sm md:col-span-2 mt-2">
              <input type="checkbox" id="has_bars" {...register("has_bars")} className="w-5 h-5 accent-neon-yellow" />
              <label htmlFor="has_bars" className="font-label-bold text-sm uppercase text-white">¿Habrá barras de bar / comida?</label>
            </div>
          </div>
        </div>

        {/* PESAJE */}
        <div className="bg-surface-container border-2 border-outline-variant p-lg space-y-md">
          <h3 className="font-headline-md text-headline-sm uppercase text-neon-yellow border-b border-outline-variant pb-xs">Información del Pesaje</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="flex flex-col gap-xs md:col-span-2">
              <label className="font-label-bold text-xs uppercase text-outline">Título de la Sección Pesaje</label>
              <input {...register("weigh_in_title")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
            </div>

            <div className="flex flex-col gap-xs md:col-span-2">
              <label className="font-label-bold text-xs uppercase text-outline">Texto Descriptivo Pesaje</label>
              <textarea {...register("weigh_in_text")} rows={3} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" placeholder="Ej: El pesaje se realizará en..." />
            </div>

            <div className="flex flex-col gap-xs md:col-span-2">
              <label className="font-label-bold text-xs uppercase text-outline">Aviso Importante (Pesaje)</label>
              <textarea {...register("weigh_in_notice")} rows={2} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" placeholder="Ej: Entrada libre hasta completar aforo..." />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Fecha del Pesaje</label>
              <input {...register("weigh_in_date")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: 20 de Julio, 2024" />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Apertura de Puertas (Pesaje)</label>
              <input {...register("weigh_in_doors")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: 17:00H" />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Hora de Báscula</label>
              <input {...register("weigh_in_time")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: 18:00H" />
            </div>

            <div className="flex items-center gap-sm mt-6">
              <input type="checkbox" id="weigh_in_is_free" {...register("weigh_in_is_free")} className="w-5 h-5 accent-neon-yellow" />
              <label htmlFor="weigh_in_is_free" className="font-label-bold text-sm uppercase text-white">¿Entrada gratuita al pesaje?</label>
            </div>
          </div>
        </div>

        {/* CONFIGURACIÓN DE CONTACTO */}
        <div className="bg-surface-container border-2 border-outline-variant p-lg space-y-md">
          <h3 className="font-headline-md text-headline-sm uppercase text-neon-yellow border-b border-outline-variant pb-xs">Configuración de Contacto</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="flex flex-col gap-xs md:col-span-2">
              <label className="font-label-bold text-xs uppercase text-outline">Título Principal (Contacto)</label>
              <input {...register("contact_title")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: Contacta Con Nosotros" />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Subtítulo (Enlace)</label>
              <input {...register("contact_subtitle")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: Información De Enlace" />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Horario de Atención</label>
              <input {...register("contact_hours")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: L-V: 10:00 - 18:00" />
            </div>

            <div className="flex flex-col gap-xs md:col-span-2">
              <label className="font-label-bold text-xs uppercase text-outline">Descripción / Párrafo</label>
              <textarea {...register("contact_description")} rows={2} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Email de Contacto</label>
              <input {...register("contact_email")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="contacto@ejemplo.com" />
              {errors.contact_email && <span className="text-error text-xs">{errors.contact_email.message}</span>}
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Teléfono de Contacto</label>
              <input {...register("contact_phone")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="+34 600 000 000" />
            </div>

            <div className="md:col-span-2 pt-4 border-t border-outline-variant">
              <h4 className="font-label-bold text-sm uppercase text-primary mb-md">Información de Asociación (Bloque Inferior)</h4>
              <div className="grid grid-cols-1 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Título de Asociación</label>
                  <input {...register("contact_association_title")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Texto de Asociación</label>
                  <textarea {...register("contact_association_text")} rows={3} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN "ACERCA DE" */}
        <div className="bg-surface-container border-2 border-outline-variant p-lg space-y-md">
          <h3 className="font-headline-md text-headline-sm uppercase text-neon-yellow border-b border-outline-variant pb-xs">Sección "Acerca De"</h3>
          
          <div className="grid grid-cols-1 gap-lg">
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Título</label>
              <input {...register("about_title")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
              {errors.about_title && <span className="text-error text-xs">{errors.about_title.message}</span>}
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Texto Principal</label>
              <textarea {...register("about_text")} rows={4} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" />
              {errors.about_text && <span className="text-error text-xs">{errors.about_text.message}</span>}
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Texto Secundario (Opcional)</label>
              <textarea {...register("about_secondary_text")} rows={3} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" />
            </div>

            <div className="flex flex-col gap-xs">
              <ImageUpload 
                label="Imagen Sección Acerca De"
                value={watch("about_image") || ""}
                onChange={(url) => setValue("about_image", url)}
                folder="event"
              />
              {errors.about_image && <span className="text-error text-xs">{errors.about_image.message}</span>}
            </div>
          </div>
        </div>

        {apiError && (
          <div className="p-3 border-2 border-error bg-error/10 text-error font-label-bold text-sm">
            {apiError}
          </div>
        )}

        {successMsg && (
          <div className="p-3 border-2 border-green-500 bg-green-500/10 text-green-500 font-label-bold text-sm">
            {successMsg}
          </div>
        )}

        <div className="flex justify-end pt-md">
          <button type="submit" disabled={isSubmitting} className="px-xl py-md bg-neon-yellow text-surface font-label-bold uppercase text-lg hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-sm shadow-[4px_4px_0px_#fff] hover:shadow-[2px_2px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px]">
            <span className="material-symbols-outlined">save</span>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>

      </form>
    </div>
  );
}
