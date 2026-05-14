"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  folder?: string;
}

export function ImageUpload({ value, onChange, label, folder = "general" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar vista previa cuando el valor cambia externamente (ej: al editar)
  useEffect(() => {
    setPreview(value);
  }, [value]);

  // Cliente de Supabase para subida
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) throw error;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onChange(publicUrl);
    } catch (error: any) {
      alert("Error al subir imagen: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  };

  return (
    <div className="flex flex-col gap-xs">
      <label className="font-label-bold text-xs uppercase text-outline">{label}</label>
      
      <div 
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative h-40 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-md overflow-hidden
          ${isUploading ? "border-neon-yellow bg-surface-container-high" : "border-outline-variant hover:border-neon-yellow bg-surface"}
        `}
      >
        {preview ? (
          <div className="absolute inset-0 w-full h-full">
            <img src={preview} alt="Vista previa" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-label-bold text-xs uppercase">Cambiar Imagen</span>
            </div>
          </div>
        ) : (
          <>
            <span className="material-symbols-outlined text-outline text-[40px] mb-xs">
              {isUploading ? "sync" : "cloud_upload"}
            </span>
            <p className="text-xs text-outline uppercase font-label-bold text-center">
              {isUploading ? "Subiendo..." : "Arrastra o haz click para subir"}
            </p>
          </>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
          accept="image/*"
        />
      </div>
      
      {/* Input de texto por si quieren meter URL a mano igualmente */}
      <input 
        type="text"
        value={value}
        onChange={(e) => {
          setPreview(e.target.value);
          onChange(e.target.value);
        }}
        className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-xs text-xs font-body-md w-full mt-1"
        placeholder="URL de la imagen..."
      />
    </div>
  );
}
