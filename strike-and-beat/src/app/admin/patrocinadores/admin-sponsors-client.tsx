"use client";

import { useState } from "react";
import { saveSponsor, deleteSponsor } from "@/app/actions/sponsors";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  opacity: number;
  sort_order: number;
}

export function AdminSponsorsClient({ initialSponsors }: { initialSponsors: Sponsor[] }) {
  // ... (estado omitido)
  // (Mantengo los estados anteriores, solo cambio el renderizado)
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Sponsor>>({
    name: "",
    logo_url: "",
    opacity: 100,
    sort_order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (sponsor: Sponsor) => {
    setIsEditing(sponsor.id);
    setFormData(sponsor);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({ name: "", logo_url: "", opacity: 100, sort_order: 0 });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const res = await saveSponsor(formData as any);
    
    if (res.success) {
      window.location.reload();
    } else {
      alert("Error: " + res.error);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este patrocinador?")) return;
    
    const res = await deleteSponsor(id);
    if (res.success) {
      window.location.reload();
    } else {
      alert("Error al eliminar: " + res.error);
    }
  };

  return (
    <div className="space-y-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b-2 border-outline-variant pb-md gap-4">
        <div>
          <h2 className="font-display-xl text-headline-lg uppercase text-white">Patrocinadores</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Gestiona las marcas que apoyan el evento</p>
        </div>
      </div>

      {/* Formulario de Alta / Edición */}
      <form onSubmit={onSubmit} className="bg-surface-container border-2 border-outline-variant p-lg space-y-md max-w-2xl">
        <h3 className="font-headline-md text-headline-sm uppercase text-neon-yellow border-b border-outline-variant pb-xs">
          {isEditing ? "Editar Patrocinador" : "Nuevo Patrocinador"}
        </h3>
        
        <div className="grid grid-cols-1 gap-md">
          <div className="flex flex-col gap-xs">
            <label className="font-label-bold text-xs uppercase text-outline">Nombre de la Marca</label>
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md w-full" 
              placeholder="Ej: Monster Energy"
            />
          </div>

          <ImageUpload 
            label="Logo del Patrocinador"
            value={formData.logo_url || ""}
            onChange={(url) => setFormData({ ...formData, logo_url: url })}
            folder="sponsors"
          />

          <div className="grid grid-cols-2 gap-md">
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Opacidad (%)</label>
              <input 
                type="number"
                min="0"
                max="100"
                value={formData.opacity ?? 100}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setFormData({ ...formData, opacity: isNaN(val) ? 100 : val });
                }}
                className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md w-full" 
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-xs uppercase text-outline">Orden</label>
              <input 
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md w-full" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-md pt-md">
          {isEditing && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="px-lg py-sm border-2 border-outline text-white font-label-bold uppercase hover:bg-surface-container-high transition-colors"
            >
              Cancelar
            </button>
          )}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-xl py-sm bg-neon-yellow text-surface font-label-bold uppercase hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-sm"
          >
            <span className="material-symbols-outlined">save</span>
            {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Añadir"}
          </button>
        </div>
      </form>

      {/* Lista de Patrocinadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="bg-surface-container border-2 border-outline-variant p-md flex flex-col gap-md relative group">
            <div className="h-32 bg-surface-container-low flex items-center justify-center p-md border border-outline-variant">
              {sponsor.logo_url ? (
                <img 
                  src={sponsor.logo_url} 
                  alt={sponsor.name} 
                  className="max-h-full max-w-full object-contain" 
                  style={{ opacity: sponsor.opacity / 100 }}
                />
              ) : (
                <span className="text-outline uppercase font-label-bold text-xs">Sin Logo</span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-label-bold uppercase text-white">{sponsor.name}</p>
                <p className="font-caption text-xs text-on-surface-variant uppercase tracking-wider">
                  Opacidad: {sponsor.opacity}% | Orden: {sponsor.sort_order}
                </p>
              </div>
              <div className="flex gap-xs">
                <button 
                  onClick={() => handleEdit(sponsor)}
                  className="w-10 h-10 border border-outline-variant flex items-center justify-center text-white hover:bg-neon-yellow hover:text-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(sponsor.id)}
                  className="w-10 h-10 border border-outline-variant flex items-center justify-center text-error hover:bg-error hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
