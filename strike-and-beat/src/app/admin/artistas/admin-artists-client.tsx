"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArtistSchema, type ArtistInput } from "@/lib/validations/admin";
import { createArtist, updateArtist, deleteArtist } from "@/app/actions/artists";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Artist } from "@/lib/mockData";

export function AdminArtistsClient({ initialArtists }: { initialArtists: Artist[] }) {
  const [artists, setArtists] = useState<Artist[]>(initialArtists);
  const [editingArtist, setEditingArtist] = useState<Partial<Artist> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ArtistInput>({
    resolver: zodResolver(ArtistSchema) as any,
  });

  const handleOpenModal = (artist?: Artist) => {
    setApiError("");
    if (artist) {
      setEditingArtist(artist);
      reset({
        id: artist.id,
        name: artist.name,
        genre: artist.genre,
        image: artist.image || "",
        profile_link: artist.profileLink || "",
        instagram_url: artist.instagramUrl || "",
        spotify_url: artist.spotifyUrl || "",
        spotify_embed_url: artist.spotifyEmbedUrl || "",
        youtube_url: artist.youtubeUrl || "",
        description: artist.description || "",
        video_url: artist.videoUrl || "",
        hero_image: artist.heroImage || "",
        slug: artist.slug || "",
        subtitle: artist.subtitle || "",
        sort_order: 0,
      });
    } else {
      setEditingArtist(null);
      reset({
        name: "",
        genre: "",
        image: "",
        profile_link: "",
        instagram_url: "",
        spotify_url: "",
        spotify_embed_url: "",
        youtube_url: "",
        description: "",
        video_url: "",
        hero_image: "",
        slug: "",
        subtitle: "",
        sort_order: artists.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArtist(null);
  };

  const onSubmit = async (data: ArtistInput) => {
    setApiError("");
    const res = editingArtist?.id
      ? await updateArtist({ ...data, id: editingArtist.id })
      : await createArtist(data);

    if (res.success) {
      window.location.reload();
    } else {
      setApiError(res.error || "Ocurrió un error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este artista?")) {
      const res = await deleteArtist(id);
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
          <h2 className="font-display-xl text-headline-lg uppercase text-white">Gestión de Artistas</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Administra los artistas invitados del evento</p>
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
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase">Artista</th>
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase">Género Musical</th>
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase hidden md:table-cell">Perfil</th>
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => (
                <tr key={artist.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td className="p-md">
                    <div className="flex items-center gap-sm">
                      {artist.image ? (
                        <img src={artist.image} alt={artist.name} className="w-10 h-10 object-cover grayscale" />
                      ) : (
                        <div className="w-10 h-10 bg-surface flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline">mic</span>
                        </div>
                      )}
                      <p className="font-label-bold uppercase text-white">{artist.name}</p>
                    </div>
                  </td>
                  <td className="p-md font-body-md text-on-surface-variant">
                    {artist.genre}
                  </td>
                  <td className="p-md hidden md:table-cell">
                    {artist.profileLink ? (
                      <a href={artist.profileLink} target="_blank" rel="noreferrer" className="text-neon-yellow hover:underline text-sm uppercase font-label-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">link</span> Ver Perfil
                      </a>
                    ) : (
                      <span className="text-outline text-xs uppercase">Sin Enlace</span>
                    )}
                  </td>
                  <td className="p-md text-right">
                    <div className="flex justify-end gap-sm">
                      <button onClick={() => handleOpenModal(artist)} className="text-on-surface-variant hover:text-neon-yellow transition-colors" title="Editar">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button onClick={() => handleDelete(artist.id)} className="text-on-surface-variant hover:text-error transition-colors" title="Eliminar">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {artists.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-xl text-center text-on-surface-variant font-body-md">
                    No hay artistas registrados.
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
          <div className="bg-surface-container border-2 border-neon-yellow w-full max-w-2xl my-auto">
            <div className="px-lg py-md border-b-2 border-neon-yellow flex items-center justify-between bg-neon-yellow/5">
              <h3 className="font-headline-md text-headline-md uppercase text-neon-yellow">
                {editingArtist ? "Editar Artista" : "Nuevo Artista"}
              </h3>
              <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-lg space-y-md">
              <div className="space-y-sm bg-surface p-md border border-outline-variant">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Nombre</label>
                  <input {...register("name")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" />
                  {errors.name && <span className="text-error text-xs">{errors.name.message}</span>}
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Género Musical</label>
                  <input {...register("genre")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="Ej: Drill, Hip-Hop..." />
                  {errors.genre && <span className="text-error text-xs">{errors.genre.message}</span>}
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Párrafo corto (Tarjeta)</label>
                  <textarea {...register("subtitle")} rows={2} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-none" placeholder="Frase corta que aparecerá en la tarjeta del listado..." />
                  {errors.subtitle && <span className="text-error text-xs">{errors.subtitle.message}</span>}
                </div>
                <div className="flex flex-col gap-xs">
                  <ImageUpload 
                    label="Foto del Artista"
                    value={watch("image") || ""}
                    onChange={(url) => setValue("image", url)}
                    folder="artists"
                  />
                  {errors.image && <span className="text-error text-xs">{errors.image.message}</span>}
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Slug (URL del perfil)</label>
                  <input {...register("slug")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="mc-voltaje (se genera automaticamente si se deja vacio)" />
                  <span className="text-outline text-[10px]">Se usara como /artistas/&#123;slug&#125;. Si se deja vacio se genera del nombre.</span>
                </div>
              </div>

              {/* Seccion: Perfil y Bio */}
              <div className="space-y-sm bg-surface p-md border border-outline-variant">
                <p className="font-label-bold text-xs uppercase text-neon-yellow tracking-widest mb-sm">Perfil publico</p>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Descripcion / Biografia</label>
                  <textarea {...register("description")} rows={4} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md resize-y" placeholder="Biografia del artista, trayectoria, logros..." />
                  <div className="bg-surface-container-low border border-outline-variant p-sm mt-xs">
                    <p className="text-outline text-[10px] leading-relaxed">
                      Puedes usar HTML para dar formato: <code className="text-neon-yellow">&lt;strong&gt;texto&lt;/strong&gt;</code> para <strong className="text-white">negrita</strong>, 
                      <code className="text-neon-yellow">&lt;em&gt;texto&lt;/em&gt;</code> para <em className="text-white">cursiva</em>, 
                      <code className="text-neon-yellow">&lt;span class=&quot;text-primary&quot;&gt;texto&lt;/span&gt;</code> para <span className="text-primary">color primario</span>, 
                      <code className="text-neon-yellow">&lt;span class=&quot;text-neon-yellow&quot;&gt;texto&lt;/span&gt;</code> para <span className="text-neon-yellow">color amarillo</span>.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Video (URL de YouTube)</label>
                  <input {...register("video_url")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="https://youtube.com/watch?v=..." />
                  <span className="text-outline text-[10px]">Se mostrara como video embebido en el perfil del artista.</span>
                </div>
                <div className="flex flex-col gap-xs">
                  <ImageUpload 
                    label="Imagen Hero (Perfil)"
                    value={watch("hero_image") || ""}
                    onChange={(url) => setValue("hero_image", url)}
                    folder="artists"
                  />
                  <span className="text-outline text-[10px]">Imagen grande de fondo para la cabecera del perfil. Si no se sube, se usara la foto principal.</span>
                </div>

              </div>

              {/* Seccion: Redes Sociales */}
              <div className="space-y-sm bg-surface p-md border border-outline-variant">
                <p className="font-label-bold text-xs uppercase text-neon-yellow tracking-widest mb-sm">Redes sociales</p>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Instagram URL</label>
                  <input {...register("instagram_url")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="https://instagram.com/..." />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">Spotify URL</label>
                  <input {...register("spotify_url")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="https://open.spotify.com/..." />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-xs uppercase text-outline">YouTube URL</label>
                  <input {...register("youtube_url")} className="bg-surface-container border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-sm font-body-md" placeholder="https://youtube.com/..." />
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
                  {isSubmitting ? "Guardando..." : "Guardar Artista"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
