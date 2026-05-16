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
      total_breaks: initialEventInfo.totalBreaks || 0,
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
      artists_title: initialEventInfo.artistsTitle || "Artistas",
      artists_description: initialEventInfo.artistsDescription || "",
      fights_title: initialEventInfo.fightsTitle || "Combates",
      fights_description: initialEventInfo.fightsDescription || "",
      card_fights_text: initialEventInfo.cardFightsText || "",
      card_artists_text: initialEventInfo.cardArtistsText || "",
      card_bars_text: initialEventInfo.cardBarsText || "",
      theme_primary_color: initialEventInfo.themePrimaryColor || "#cfbdff",
      theme_neon_color: initialEventInfo.themeNeonColor || "#facc15",
      marquee_speed: initialEventInfo.marqueeSpeed ?? 50,
      contact_hero_image: initialEventInfo.contactHeroImage || "",
      tickets_hero_image: initialEventInfo.ticketsHeroImage || "",
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

  const [activeTab, setActiveTab] = useState("general");

  const TABS = [
    { id: "general", label: "General" },
    { id: "logistics", label: "Logística" },
    { id: "texts", label: "Textos y Contacto" },
    { id: "appearance", label: "Apariencia" },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-3xl relative">
      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* Sticky Header con Botón de Guardar */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b-2 border-outline-variant py-md mb-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <h2 className="font-display-xl text-headline-md uppercase text-white leading-none">Ajustes Generales</h2>
            <p className="font-body-md text-sm text-on-surface-variant mt-xs">Configura la información y apariencia de la web.</p>
          </div>
          
          <div className="flex items-center gap-md w-full md:w-auto">
            {successMsg && (
              <span className="text-neon-yellow font-label-bold text-sm uppercase animate-pulse">Guardado ✓</span>
            )}
            {apiError && (
              <span className="text-error font-label-bold text-sm uppercase">Error al guardar</span>
            )}
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full md:w-auto px-lg py-sm bg-on-surface text-surface font-label-bold uppercase tracking-widest hover:bg-neon-yellow hover:text-black transition-colors disabled:opacity-50 flex items-center justify-center gap-sm brutalist-border"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>

        {/* Navegación de Pestañas */}
        <div className="flex overflow-x-auto border-b-2 border-outline-variant/50 no-scrollbar mb-xl gap-sm">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-lg py-sm font-label-bold uppercase text-sm tracking-widest whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? "border-neon-yellow text-neon-yellow" 
                  : "border-transparent text-on-surface-variant hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido de las Pestañas */}
        <div className="space-y-xl">
          
          {/* TAB: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-xl animate-fade-in">
              {/* INFORMACIÓN PRINCIPAL */}
              <div className="bg-surface-container border-2 border-outline-variant p-lg space-y-md">
                <h3 className="font-headline-md text-2xl uppercase text-neon-yellow border-b border-outline-variant pb-md mb-md">Información Principal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-bold text-xs uppercase text-outline">Título del Evento</label>
                    <input {...register("title")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md w-full" />
                    {errors.title && <span className="text-error text-xs">{errors.title.message}</span>}
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Fecha</label>
                    <input {...register("event_date")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Apertura de Puertas</label>
                    <input {...register("doors_open_time")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <ImageUpload label="Imagen Hero (Portada)" value={watch("hero_image") || ""} onChange={(url) => setValue("hero_image", url)} folder="event" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <ImageUpload label="Imagen Página Información" value={watch("info_image") || ""} onChange={(url) => setValue("info_image", url)} folder="event" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <ImageUpload label="Imagen Hero Entradas" value={watch("tickets_hero_image") || ""} onChange={(url) => setValue("tickets_hero_image", url)} folder="event" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <ImageUpload label="Imagen Hero Contacto" value={watch("contact_hero_image") || ""} onChange={(url) => setValue("contact_hero_image", url)} folder="event" />
                  </div>
                </div>
              </div>

              {/* UBICACIÓN */}
              <div className="bg-surface-container border-2 border-outline-variant p-lg space-y-md">
                <h3 className="font-headline-md text-headline-sm uppercase text-neon-yellow border-b border-outline-variant pb-xs">Ubicación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Nombre del Recinto</label>
                    <input {...register("location_name")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-bold text-xs uppercase text-outline">Dirección Completa (Mapas)</label>
                    <input {...register("location_address")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-bold text-xs uppercase text-outline">Título de Logística</label>
                    <input {...register("location_logistics_title")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-bold text-xs uppercase text-outline">Contenido de Logística</label>
                    <textarea {...register("location_logistics")} rows={2} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LOGÍSTICA */}
          {activeTab === "logistics" && (
            <div className="space-y-xl animate-fade-in">
              {/* DETALLES DEL EVENTO */}
              <div className="bg-surface-container border-2 border-outline-variant p-lg space-y-md">
                <h3 className="font-headline-md text-headline-sm uppercase text-neon-yellow border-b border-outline-variant pb-xs">Detalles del Evento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Cant. Combates</label>
                    <input type="number" {...register("total_fights")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Desc. Combates</label>
                    <input {...register("card_fights_text")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Cant. Conciertos</label>
                    <input type="number" {...register("total_artists")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Desc. Conciertos</label>
                    <input {...register("card_artists_text")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Cant. Barras</label>
                    <input type="number" {...register("total_bars")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Desc. Barras</label>
                    <input {...register("card_bars_text")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Hora Primer Combate</label>
                    <input {...register("first_fight_time")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Cant. Descansos</label>
                    <input type="number" {...register("total_breaks")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex items-center gap-sm md:col-span-2 mt-2">
                    <input type="checkbox" id="has_bars" {...register("has_bars")} className="w-5 h-5 accent-neon-yellow" />
                    <label htmlFor="has_bars" className="font-label-bold text-sm uppercase text-white">¿Habrá barras de bar / comida?</label>
                  </div>
                </div>
              </div>

              {/* PESAJE */}
              <div className="bg-surface-container border-2 border-outline-variant p-lg space-y-md">
                <h3 className="font-headline-md text-headline-sm uppercase text-neon-yellow border-b border-outline-variant pb-xs">Pesaje</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-bold text-xs uppercase text-outline">Título Pesaje</label>
                    <input {...register("weigh_in_title")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-bold text-xs uppercase text-outline">Texto Pesaje</label>
                    <textarea {...register("weigh_in_text")} rows={2} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" />
                  </div>
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-bold text-xs uppercase text-outline">Aviso Importante</label>
                    <textarea {...register("weigh_in_notice")} rows={2} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Fecha</label>
                    <input {...register("weigh_in_date")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Apertura Puertas Pesaje</label>
                    <input {...register("weigh_in_doors")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Hora de Pesaje</label>
                    <input {...register("weigh_in_time")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex items-center gap-sm mt-6">
                    <input type="checkbox" id="weigh_in_is_free" {...register("weigh_in_is_free")} className="w-5 h-5 accent-neon-yellow" />
                    <label htmlFor="weigh_in_is_free" className="font-label-bold text-sm uppercase text-white">¿Entrada gratuita al pesaje?</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TEXTOS Y CONTACTO */}
          {activeTab === "texts" && (
            <div className="space-y-xl animate-fade-in">
              {/* CONTACTO */}
              <div className="bg-surface-container border-2 border-outline-variant p-lg space-y-md">
                <h3 className="font-headline-md text-headline-sm uppercase text-neon-yellow border-b border-outline-variant pb-xs">Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-bold text-xs uppercase text-outline">Título</label>
                    <input {...register("contact_title")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Subtítulo</label>
                    <input {...register("contact_subtitle")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Horario</label>
                    <input {...register("contact_hours")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-bold text-xs uppercase text-outline">Descripción (Bajo el título)</label>
                    <textarea {...register("contact_description")} rows={3} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Email</label>
                    <input {...register("contact_email")} className={`bg-surface border ${errors.contact_email ? 'border-error' : 'border-outline-variant'} focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md`} />
                    {errors.contact_email && <p className="text-error text-[10px] uppercase font-label-bold">{errors.contact_email.message}</p>}
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Teléfono</label>
                    <input {...register("contact_phone")} className={`bg-surface border ${errors.contact_phone ? 'border-error' : 'border-outline-variant'} focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md`} />
                    {errors.contact_phone && <p className="text-error text-[10px] uppercase font-label-bold">{errors.contact_phone.message}</p>}
                  </div>
                  
                  {/* Info Asociación */}
                  <div className="flex flex-col gap-xs md:col-span-2 mt-md">
                    <h4 className="font-headline-md text-neon-yellow text-sm border-b border-outline-variant pb-1">Caja Asociación Caminando</h4>
                  </div>
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-bold text-xs uppercase text-outline">Título Asociación</label>
                    <input {...register("contact_association_title")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-bold text-xs uppercase text-outline">Texto Asociación</label>
                    <textarea {...register("contact_association_text")} rows={4} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" />
                  </div>
                </div>
              </div>

              {/* TÍTULOS DE SECCIONES (ARTISTAS Y COMBATES) */}
              <div className="bg-surface-container border-2 border-outline-variant p-lg space-y-md">
                <h3 className="font-headline-md text-headline-sm uppercase text-neon-yellow border-b border-outline-variant pb-xs">Títulos de Secciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Título de Artistas</label>
                    <input {...register("artists_title")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Descripción de Artistas</label>
                    <textarea {...register("artists_description")} rows={2} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Título de Combates</label>
                    <input {...register("fights_title")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Descripción de Combates</label>
                    <textarea {...register("fights_description")} rows={2} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" />
                  </div>
                </div>
              </div>

              {/* ACERCA DE */}
              <div className="bg-surface-container border-2 border-outline-variant p-lg space-y-md">
                <h3 className="font-headline-md text-2xl uppercase text-neon-yellow border-b border-outline-variant pb-md mb-md">Sección "Acerca De"</h3>
                <div className="grid grid-cols-1 gap-lg">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Título</label>
                    <input {...register("about_title")} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Texto Principal</label>
                    <textarea {...register("about_text")} rows={4} className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <ImageUpload label="Imagen Acerca De" value={watch("about_image") || ""} onChange={(url) => setValue("about_image", url)} folder="event" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: APARIENCIA */}
          {activeTab === "appearance" && (
            <div className="space-y-xl animate-fade-in">
              <div className="bg-surface-container border-2 border-outline-variant p-lg space-y-md">
                <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
                  <h3 className="font-headline-md text-2xl uppercase text-neon-yellow">Apariencia y Theming</h3>
                </div>
                <p className="text-on-surface-variant text-sm mb-lg">
                  Personaliza la paleta de colores y el estilo de los botones dinámicamente.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Color Principal (Primary)</label>
                    <div className="flex gap-2">
                      <div className="relative group w-12 h-12 brutalist-border overflow-hidden cursor-pointer">
                        <div 
                          className="w-full h-full transition-transform group-hover:scale-110" 
                          style={{ backgroundColor: watch("theme_primary_color") }}
                        ></div>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
                        <input 
                          type="color" 
                          value={watch("theme_primary_color")}
                          onChange={(e) => setValue("theme_primary_color", e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                        />
                      </div>
                      <input 
                        type="text" 
                        {...register("theme_primary_color")} 
                        className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md w-full" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-bold text-xs uppercase text-outline">Color de Acento (Neon Yellow)</label>
                    <div className="flex gap-2">
                      <div className="relative group w-12 h-12 brutalist-border overflow-hidden cursor-pointer">
                        <div 
                          className="w-full h-full transition-transform group-hover:scale-110" 
                          style={{ backgroundColor: watch("theme_neon_color") }}
                        ></div>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
                        <input 
                          type="color" 
                          value={watch("theme_neon_color")}
                          onChange={(e) => setValue("theme_neon_color", e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                        />
                      </div>
                      <input 
                        type="text" 
                        {...register("theme_neon_color")} 
                        className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md w-full" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-xs md:col-span-2">
                    <div className="flex justify-between">
                      <label className="font-label-bold text-xs uppercase text-outline">Velocidad Carrusel Sponsors</label>
                      <span className="text-neon-yellow font-body-md text-sm">{watch("marquee_speed")}s</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="120" 
                      step="5"
                      {...register("marquee_speed")} 
                      className="w-full accent-neon-yellow" 
                    />
                    <p className="text-outline text-xs mt-1">A menor número, más rápido se moverá.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </form>
    </div>
  );
}
