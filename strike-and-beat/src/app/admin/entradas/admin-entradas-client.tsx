"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Ticket } from "@/lib/mockData"

import { updateTicketPrice, createTicket } from "@/app/actions/tickets"

/* ------------------------------------------------------------------ */
/*  ESQUEMA DE EDICION DE PRECIO                                       */
/* ------------------------------------------------------------------ */

const TicketFormSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  description: z.string().optional().nullable(),
  price: z.coerce
    .number({ message: "Debe ser un numero" })
    .positive("El precio debe ser mayor que 0"),
  management_fees: z.coerce
    .number({ message: "Debe ser un numero" })
    .nonnegative("Los gastos no pueden ser negativos"),
  available_stock: z.coerce
    .number({ message: "Debe ser un numero" })
    .int()
    .nonnegative("El stock no puede ser negativo")
    .nullable()
    .optional(),
})

type TicketFormInput = z.infer<typeof TicketFormSchema>

/* ------------------------------------------------------------------ */
/*  COMPONENTE PAGINA                                                  */
/* ------------------------------------------------------------------ */

export function AdminEntradasClient({ initialTickets }: { initialTickets: Ticket[] }) {
  const [ticketsData, setTicketsData] = useState<Ticket[]>(initialTickets)
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [apiError, setApiError] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormInput>({
    resolver: zodResolver(TicketFormSchema) as any,
  })

  const watchedPrice = watch("price")
  const watchedFees = watch("management_fees")

  const openEditor = (ticket: Ticket) => {
    setEditingTicket(ticket)
    setIsCreating(false)
    setSaveSuccess(false)
    setApiError("")
    reset({
      name: ticket.name,
      description: ticket.description,
      price: ticket.price,
      management_fees: ticket.managementFees,
      // Usamos el totalCapacity (Aforo) para que el admin vea lo que configuró originalmente
      available_stock: ticket.totalCapacity ?? ticket.stock,
    })
  }

  const openCreator = () => {
    setEditingTicket(null)
    setIsCreating(true)
    setSaveSuccess(false)
    setApiError("")
    reset({
      name: "",
      description: "",
      price: 10,
      management_fees: 2.5,
      available_stock: 100,
    })
  }

  const closeEditor = () => {
    setEditingTicket(null)
    setIsCreating(false)
    setSaveSuccess(false)
    setApiError("")
  }

  const onSubmit = async (data: TicketFormInput) => {
    setApiError("")

    if (isCreating) {
      const result = await createTicket({
        name: data.name,
        description: data.description || "",
        price: data.price,
        management_fees: data.management_fees,
        available_stock: data.available_stock ?? undefined,
      })

      if (!result.success) {
        setApiError(result.error || "Error al crear")
        return
      }

      // Recargar o actualizar lista local
      if (result.ticket) {
        const newT: Ticket = {
          id: result.ticket.id,
          name: result.ticket.name,
          description: result.ticket.description,
          price: result.ticket.price,
          managementFees: result.ticket.management_fees,
          stock: result.ticket.available_stock,
          priceId: result.ticket.stripe_price_id
        }
        setTicketsData([newT, ...ticketsData])
      }
      
      setSaveSuccess(true)
      setTimeout(() => {
        setSaveSuccess(false)
        closeEditor()
      }, 2000)
      return
    }

    if (!editingTicket) return

    const result = await updateTicketPrice({
      id: editingTicket.id,
      name: data.name,
      description: data.description || "",
      price: data.price,
      management_fees: data.management_fees,
      available_stock: data.available_stock ?? undefined,
    })

    if (!result.success) {
      setApiError(result.error || "Error al guardar")
      return
    }

    setTicketsData((prev) =>
      prev.map((t) =>
        t.id === editingTicket.id
          ? { 
              ...t, 
              name: data.name,
              description: data.description || "",
              price: data.price, 
              managementFees: data.management_fees,
              stock: data.available_stock ?? null
            }
          : t
      )
    )

    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  // --- Stats rapidos ---
  const totalStock = ticketsData.reduce((sum, t) => sum + (t.stock || 0), 0)
  const avgPrice = ticketsData.reduce((sum, t) => sum + t.price, 0) / ticketsData.length

  return (
    <div className="space-y-lg">
      {/* Titulo */}
      <div className="flex items-end justify-between border-b-2 border-outline-variant pb-md">
        <div>
          <h2 className="font-display-xl text-headline-lg uppercase text-white">
            Gestion de Entradas
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
            Administra tipos de entrada, precios y stock disponible
          </p>
        </div>
        <div className="flex items-center gap-md">
          <div className="bg-surface-container border border-outline-variant px-md py-sm">
            <span className="font-caption text-caption text-outline uppercase tracking-wider">
              {ticketsData.length} tipos
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  STATS RAPIDOS                                               */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <div className="bg-surface-container border-2 border-outline-variant p-md">
          <p className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Tipos de Entrada</p>
          <p className="font-display-xl text-headline-md text-on-surface mt-xs">{ticketsData.length}</p>
        </div>
        <div className="bg-surface-container border-2 border-outline-variant p-md">
          <p className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Stock Total</p>
          <p className="font-display-xl text-headline-md text-neon-yellow mt-xs">
            {totalStock > 0 ? totalStock : "Ilimitado"}
          </p>
        </div>
        <div className="bg-surface-container border-2 border-outline-variant p-md">
          <p className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Precio Medio</p>
          <p className="font-display-xl text-headline-md text-on-surface mt-xs">{avgPrice.toFixed(2)}€</p>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  LAYOUT: TABLA + EDITOR                                      */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">

        {/* ---------------------------------------------------------- */}
        {/*  TABLA DE ENTRADAS                                         */}
        {/* ---------------------------------------------------------- */}
        <div className={`${editingTicket ? "lg:col-span-7" : "lg:col-span-12"} bg-surface-container border-2 border-outline-variant transition-all`}>
          <div className="px-lg py-md border-b-2 border-outline-variant flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md uppercase text-white flex items-center gap-sm">
              <span className="material-symbols-outlined text-neon-yellow" style={{ fontVariationSettings: "'FILL' 1" }}>
                table_rows
              </span>
              Catalogo
            </h3>
            <button
              onClick={openCreator}
              className="px-md py-sm bg-neon-yellow text-black border-2 border-neon-yellow font-label-bold text-xs uppercase tracking-wider hover:bg-black hover:text-neon-yellow transition-all flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              Crear Nueva
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-outline-variant">
                  <th className="text-left px-lg py-md font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left px-lg py-md font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="text-left px-lg py-md font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">
                    Descripcion
                  </th>
                  <th className="text-right px-lg py-md font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="text-right px-lg py-md font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">
                    Gastos
                  </th>
                  <th className="text-center px-lg py-md font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-center px-lg py-md font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">
                    Stripe ID
                  </th>
                  <th className="text-center px-lg py-md font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {ticketsData.map((ticket) => {
                  const isEditing = editingTicket?.id === ticket.id
                  return (
                    <tr
                      key={ticket.id}
                      className={`border-b border-outline-variant/50 transition-colors ${
                        isEditing
                          ? "bg-neon-yellow/5 border-l-4 border-l-neon-yellow"
                          : "hover:bg-surface-container-low"
                      }`}
                    >
                      <td className="px-lg py-md font-caption text-caption text-outline">{ticket.id}</td>
                      <td className="px-lg py-md font-label-bold text-label-bold text-on-surface uppercase">
                        {ticket.name}
                      </td>
                      <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant max-w-[200px] truncate">
                        {ticket.description}
                      </td>
                      <td className="px-lg py-md text-right font-headline-md text-headline-md text-neon-yellow">
                        {ticket.price.toFixed(2)}€
                      </td>
                      <td className="px-lg py-md text-right font-caption text-caption text-on-surface-variant">
                        +{ticket.managementFees.toFixed(2)}€
                      </td>
                      <td className="px-lg py-md text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-label-bold text-label-bold text-on-surface">
                            {ticket.stock !== null ? ticket.stock : "---"}
                          </span>
                          {ticket.soldCount !== undefined && ticket.soldCount > 0 && (
                            <span className="font-caption text-[10px] text-neon-yellow uppercase mt-1">
                              {ticket.soldCount} VENDIDAS
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-lg py-md text-center">
                        <span className="font-caption text-caption text-outline bg-surface-container-low px-sm py-xs">
                          {ticket.priceId.length > 20
                            ? `${ticket.priceId.slice(0, 18)}...`
                            : ticket.priceId}
                        </span>
                      </td>
                      <td className="px-lg py-md text-center">
                        <button
                          onClick={() => openEditor(ticket)}
                          className={`px-md py-sm border-2 font-label-bold text-xs uppercase tracking-wider transition-all flex items-center gap-xs mx-auto ${
                            isEditing
                              ? "border-neon-yellow text-neon-yellow bg-neon-yellow/10"
                              : "border-outline-variant text-on-surface-variant hover:border-neon-yellow hover:text-neon-yellow"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          Editar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/*  PANEL LATERAL: EDITOR / CREADOR                           */}
        {/* ---------------------------------------------------------- */}
        {(editingTicket || isCreating) && (
          <div className="lg:col-span-5 bg-surface-container border-2 border-neon-yellow self-start sticky top-24">
            {/* Header del editor */}
            <div className="px-lg py-md border-b-2 border-neon-yellow flex items-center justify-between bg-neon-yellow/5">
              <h3 className="font-headline-md text-headline-md uppercase text-neon-yellow flex items-center gap-sm">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isCreating ? "add_box" : "edit_note"}
                </span>
                {isCreating ? "Crear Nueva Entrada" : "Editar Entrada"}
              </h3>
              <button
                onClick={closeEditor}
                className="w-8 h-8 border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-error hover:border-error transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Info del ticket */}
            {!isCreating && editingTicket && (
              <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low">
                <p className="font-label-bold text-label-bold text-on-surface uppercase">{editingTicket.name}</p>
                <p className="font-caption text-caption text-outline mt-xs">{editingTicket.id}</p>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-lg space-y-md">
              
              {/* Campo: Nombre */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-bold text-on-surface-variant uppercase text-xs tracking-wider">
                  Nombre de la Entrada
                </label>
                <input
                  {...register("name")}
                  className="bg-surface border-2 border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md w-full font-body-md uppercase"
                  placeholder="EJ: ENTRADA GENERAL"
                />
                {errors.name && (
                  <p className="text-[#c9a74d] font-caption text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Campo: Descripción */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-bold text-on-surface-variant uppercase text-xs tracking-wider">
                  Descripción
                </label>
                <textarea
                  {...register("description")}
                  className="bg-surface border-2 border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md w-full font-body-md h-24 resize-none"
                  placeholder="Describe qué incluye la entrada..."
                />
              </div>

              {/* Campo: Precio */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-bold text-on-surface-variant uppercase text-xs tracking-wider">
                  Precio (EUR)
                </label>
                <div className="relative">
                  <input
                    {...register("price", { valueAsNumber: true })}
                    className="bg-surface border-2 border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md w-full font-headline-md text-headline-md pr-12"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                  <span className="absolute right-md top-1/2 -translate-y-1/2 font-headline-md text-headline-md text-on-surface-variant">
                    €
                  </span>
                </div>
                {errors.price && (
                  <p className="text-[#c9a74d] font-caption text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Campo: Gastos de Gestion */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-bold text-on-surface-variant uppercase text-xs tracking-wider">
                  Gastos de Gestion (EUR)
                </label>
                <div className="relative">
                  <input
                    {...register("management_fees", { valueAsNumber: true })}
                    className="bg-surface border-2 border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md w-full font-body-md text-body-md pr-12"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                  <span className="absolute right-md top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant">
                    €
                  </span>
                </div>
                {errors.management_fees && (
                  <p className="text-[#c9a74d] font-caption text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    {errors.management_fees.message}
                  </p>
                )}
              </div>

              {/* Campo: Aforo / Capacidad Total */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-bold text-on-surface-variant uppercase text-xs tracking-wider">
                  Aforo / Capacidad Total (Unidades)
                </label>
                <div className="relative">
                  <input
                    {...register("available_stock", { valueAsNumber: true })}
                    className="bg-surface border-2 border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md w-full font-body-md text-body-md"
                    type="number"
                    min="0"
                    placeholder="Ej: 500"
                  />
                </div>
                <div className="bg-neon-yellow/10 border-l-4 border-neon-yellow p-sm mt-xs">
                  <p className="font-caption text-xs text-on-surface italic">
                    <span className="font-label-bold uppercase">Nota:</span> Indica el total de entradas disponibles para este tipo. El sistema restará automáticamente las entradas ya vendidas para mostrar el remanente real en la web.
                  </p>
                </div>
                {errors.available_stock && (
                  <p className="text-[#c9a74d] font-caption text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    {errors.available_stock.message}
                  </p>
                )}
              </div>

              {/* Preview del precio final */}
              <div className="bg-surface-container-low border border-outline-variant p-md">
                <p className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mb-xs">
                  Vista previa para el cliente
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-label-bold text-label-bold text-on-surface uppercase">
                    Precio total visible
                  </span>
                  <span className="font-display-xl text-headline-md text-neon-yellow">
                    {((watchedPrice || 0) + (watchedFees || 0)).toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* Alerta Stripe */}
              <div className="bg-surface-container-low border border-outline-variant p-md flex items-start gap-sm">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5">info</span>
                <p className="font-caption text-caption text-outline leading-relaxed">
                  Al guardar, el precio se actualizará permanentemente en Supabase.
                </p>
              </div>

              {/* Feedback de error */}
              {apiError && (
                <div className="bg-error/10 border-2 border-error p-md flex items-center gap-sm">
                  <span className="material-symbols-outlined text-error">error</span>
                  <span className="font-label-bold text-label-bold text-error uppercase">
                    {apiError}
                  </span>
                </div>
              )}

              {/* Feedback de exito */}
              {saveSuccess && (
                <div className="bg-green-500/10 border-2 border-green-500 p-md flex items-center gap-sm">
                  <span className="material-symbols-outlined text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span className="font-label-bold text-label-bold text-green-400 uppercase">
                    Precio actualizado correctamente
                  </span>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-md pt-sm">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-neon-yellow text-surface font-label-bold text-label-bold py-md uppercase tracking-wider hover:bg-white transition-all active:scale-[0.97] flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Guardar Precio
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeEditor}
                  className="px-lg py-md border-2 border-outline-variant text-on-surface-variant font-label-bold text-label-bold uppercase tracking-wider hover:border-error hover:text-error transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
