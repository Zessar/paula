"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckoutSchema, type CheckoutInput } from "@/lib/validations/eventos"
import type { Ticket, EventInfo } from "@/lib/mockData"

/* ------------------------------------------------------------------ */
/*  COMPONENTE PAGINA                                                  */
/* ------------------------------------------------------------------ */

export function EntradasClient({ initialTickets, eventInfo }: { initialTickets: Ticket[], eventInfo: EventInfo }) {
  const TICKETS = initialTickets;
  const GASTOS_GESTION = TICKETS[0]?.managementFees || 2.5;
  // --- React Hook Form ---
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      documentId: "",
      address: {
        street: "",
        city: "",
        zipCode: "",
        country: "España",
      },
      items: [],
    },
  })

  // --- Estado de cantidades locales para la UI ---
  const [quantities, setQuantities] = useState<Record<string, number>>(
    TICKETS.reduce((acc: Record<string, number>, ticket: Ticket) => ({ ...acc, [ticket.id]: 0 }), {})
  )
  const [apiError, setApiError] = useState("")

  // Sincronizar cantidades con el campo 'items' de Hook Form
  useEffect(() => {
    const items = TICKETS.filter((t: Ticket) => (quantities[t.id] || 0) > 0).map((t: Ticket) => ({
      ticketId: t.id,
      priceId: t.priceId,
      quantity: quantities[t.id],
    }))
    setValue("items", items, { shouldValidate: true })
  }, [quantities, setValue])

  // --- Helpers de UI ---
  const updateQty = (id: string, delta: number) => {
    const ticket = TICKETS.find((t: Ticket) => t.id === id)
    const currentQty = quantities[id] || 0
    const maxStock = ticket?.stock ?? 10 // Si no hay stock en mockData, limitamos a 10 por Zod

    const nextQty = Math.max(0, Math.min(maxStock, currentQty + delta))

    setQuantities((prev) => ({
      ...prev,
      [id]: nextQty,
    }))
  }

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0)
  const subtotal = TICKETS.reduce(
    (sum: number, t: Ticket) => sum + t.price * (quantities[t.id] || 0),
    0
  )
  const total = totalItems > 0 ? subtotal + GASTOS_GESTION : 0

  // --- Submit Final ---
  const onSubmit = async (data: CheckoutInput) => {
    setApiError("")
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (!res.ok) {
        setApiError(json.error || "Error al procesar el pago")
        return
      }

      if (json.url) {
        window.location.href = json.url
      }
    } catch {
      setApiError("Error de conexión. Inténtalo de nuevo.")
    }
  }

  return (
    <div className="min-h-screen">
      {/* ============================================================ */}
      {/*  HERO SECTION                                                */}
      {/* ============================================================ */}
      <section className="relative h-[48vh] md:h-[70vh] min-h-[420px] md:min-h-[550px] w-full flex flex-col justify-center overflow-hidden border-b-4 border-neon-yellow pt-0 bg-surface">
        <img
          alt="Fighter Hero"
          className="absolute inset-0 md:inset-y-0 md:left-auto md:right-0 w-full md:w-1/2 h-full object-cover object-top grayscale opacity-60"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZ0ZBiiJDReXCpsQui9vsSIEgfvW1iErueKhgtar1UwQtmc_XaAwK7ntDAMEMN-Jqzz1XLLN6x6VZqIkYPhcUdIoOb3LpoUcWoUk4Y0mGvU0-gLhU6YS15hqLiNt8vPlIDBaW0CMpZ0R80GUUt2a0mM-MiVbi1lKn4tKHRUDYe_tekeELTwWOhWmZHYjVak5kt6ms-alfZ3tXdR2h5NO5F4-0EgZ_3_udAjsVZ0hlhm3GsXdjMFGmfSxxshoAdAX17CaQSl232GCc"
        />
        {/* Degradado para ocultar el corte de la imagen en desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent md:bg-gradient-to-r md:from-surface md:via-surface md:via-[55%] md:to-transparent"></div>
        <div className="relative z-10 px-gutter w-full max-w-container-max mx-auto">
          <div className="bg-neon-yellow text-surface inline-block px-md py-xs font-headline-md text-[32px] md:text-[40px] uppercase mb-sm tracking-widest">
            Tickets Live
          </div>
          <h2 className="font-display-xl text-[24vw] md:text-[16vw] lg:text-[150px] uppercase text-white leading-[0.85] tracking-[0.02em] flex flex-col items-start">
            <span>Asegura</span>
            <span>Tu</span>
            <span className="text-neon-yellow">Lugar En</span>
            <span className="text-neon-yellow">El Ring</span>
          </h2>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CHECKOUT CONTENT                                            */}
      {/* ============================================================ */}
      <section className="max-w-container-max mx-auto px-gutter py-xl grid grid-cols-1 md:grid-cols-12 gap-xl">

        {/* ---------------------------------------------------------- */}
        {/*  COLUMNA IZQUIERDA: Tarjetas de entrada                    */}
        {/* ---------------------------------------------------------- */}
        <div className="md:col-span-5 space-y-lg">
          <h3 className="font-headline-lg text-headline-md uppercase border-l-4 border-neon-yellow pl-md">
            Selecciona tu Entrada
          </h3>

          {TICKETS.map((ticket: Ticket) => {
            const qty = quantities[ticket.id] || 0
            const isSelected = qty > 0

            return (
              <div
                key={ticket.id}
                className={`bg-surface-container border-2 p-lg group transition-colors relative ${isSelected
                  ? "border-neon-yellow"
                  : "border-outline-variant hover:border-neon-yellow"
                  }`}
              >
                {/* Badge stock limitado */}
                {ticket.stock && (
                  <div className="absolute -top-4 right-4 bg-primary text-on-primary px-sm py-1 font-label-bold uppercase text-xs">
                    Solo {ticket.stock} disponibles
                  </div>
                )}

                <div className="flex justify-between items-start mb-md">
                  <div>
                    <h4 className="font-headline-md text-headline-md uppercase text-white">
                      {ticket.name}
                    </h4>
                    <p className="text-on-surface-variant font-body-md">
                      {ticket.description}
                    </p>
                  </div>
                  <span className="font-display-xl text-headline-lg text-neon-yellow leading-none ml-4 flex-shrink-0">
                    {ticket.price}&euro;
                  </span>
                </div>

                {/* Selector de cantidad */}
                <div className="flex items-center gap-0">
                  <button
                    onClick={() => updateQty(ticket.id, -1)}
                    disabled={qty === 0}
                    className="w-12 h-12 border-2 border-outline-variant bg-surface flex items-center justify-center text-on-surface hover:border-neon-yellow hover:text-neon-yellow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Reducir cantidad"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <div className="w-16 h-12 border-y-2 border-outline-variant bg-background flex items-center justify-center font-headline-md text-headline-md text-on-surface">
                    {qty}
                  </div>
                  <button
                    onClick={() => updateQty(ticket.id, 1)}
                    disabled={ticket.stock ? qty >= ticket.stock : qty >= 10}
                    className="w-12 h-12 border-2 border-outline-variant bg-surface flex items-center justify-center text-on-surface hover:border-neon-yellow hover:text-neon-yellow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Aumentar cantidad"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                  {qty > 0 && (
                    <div className="ml-4 font-label-bold text-label-bold text-neon-yellow uppercase">
                      {ticket.price * qty}&euro;
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {errors.items && (
            <div className="flex items-center gap-2 text-[#c9a74d] font-label-bold text-label-bold">
              <span className="material-symbols-outlined text-sm">warning</span>
              {errors.items.message}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------- */}
        {/*  COLUMNA DERECHA: Formulario de Checkout                   */}
        {/* ---------------------------------------------------------- */}
        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-7 lg:sticky lg:top-28 self-start">
          <div className="bg-surface-container-high p-lg border-2 border-outline">
            <h3 className="font-headline-md text-headline-md uppercase mb-lg text-white">
              Finalizar Compra
            </h3>

            <div className="space-y-md">
              {/* Nombre completo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-on-surface-variant uppercase">
                    Nombre Completo
                  </label>
                  <input
                    {...register("fullName")}
                    className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md uppercase font-body-md"
                    placeholder="TU NOMBRE COMPLETO"
                    type="text"
                  />
                  {errors.fullName && (
                    <p className="text-[#c9a74d] font-caption text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-on-surface-variant uppercase">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md uppercase font-body-md"
                    placeholder="TU@EMAIL.COM"
                    type="email"
                  />
                  {errors.email && (
                    <p className="text-[#c9a74d] font-caption text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* DNI / NIF / NIE */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-bold text-on-surface-variant uppercase">
                  DNI / NIF / NIE
                </label>
                <input
                  {...register("documentId")}
                  className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md uppercase font-body-md"
                  placeholder="12345678A"
                  type="text"
                />
                {errors.documentId && (
                  <p className="text-[#c9a74d] font-caption text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    {errors.documentId.message}
                  </p>
                )}
              </div>

              {/* Direccion */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-bold text-on-surface-variant uppercase">
                  Direccion
                </label>
                <input
                  {...register("address.street")}
                  className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md uppercase font-body-md"
                  placeholder="CALLE, NUMERO, PISO..."
                  type="text"
                />
                {errors.address?.street && (
                  <p className="text-[#c9a74d] font-caption text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    {errors.address.street.message}
                  </p>
                )}
              </div>

              {/* Ciudad + CP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-on-surface-variant uppercase">
                    Ciudad
                  </label>
                  <input
                    {...register("address.city")}
                    className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md uppercase font-body-md"
                    placeholder="EJ: MADRID"
                    type="text"
                  />
                  {errors.address?.city && (
                    <p className="text-[#c9a74d] font-caption text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      {errors.address.city.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-bold text-on-surface-variant uppercase">
                    Codigo Postal
                  </label>
                  <input
                    {...register("address.zipCode")}
                    className="bg-surface border border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md uppercase font-body-md"
                    placeholder="28001"
                    type="text"
                  />
                  {errors.address?.zipCode && (
                    <p className="text-[#c9a74d] font-caption text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      {errors.address.zipCode.message}
                    </p>
                  )}
                </div>
              </div>


              {/* Resumen de precios */}
              <div className="pt-lg">
                <div className="flex justify-between border-t border-outline-variant py-md">
                  <span className="font-label-bold uppercase text-on-surface-variant">Subtotal</span>
                  <span className="font-headline-md text-white uppercase">{subtotal.toFixed(2)}&euro;</span>
                </div>
                <div className="flex justify-between border-t border-outline-variant py-md">
                  <span className="font-label-bold uppercase text-on-surface-variant">Gastos de Gestion</span>
                  <span className="font-headline-md text-white uppercase">
                    {totalItems > 0 ? GASTOS_GESTION.toFixed(2) : "0.00"}&euro;
                  </span>
                </div>
                <div className="flex justify-between border-t-2 border-neon-yellow py-md">
                  <span className="font-headline-md uppercase text-neon-yellow">Total</span>
                  <span className="font-display-xl text-headline-lg text-neon-yellow leading-none">
                    {total.toFixed(2)}&euro;
                  </span>
                </div>
              </div>

              {/* Error de API */}
              {apiError && (
                <div className="p-3 border-2 border-error bg-error/10 font-label-bold text-label-bold text-error flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {apiError}
                </div>
              )}

              {/* Boton PAGAR */}
              <button
                className="w-full bg-neon-yellow text-surface font-display-xl text-headline-md py-lg uppercase tracking-tighter hover:bg-white transition-all active:scale-[0.97] flex items-center justify-center gap-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || totalItems === 0}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Cargando...
                  </>
                ) : (
                  <>
                    Pagar Ahora
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  </>
                )}
              </button>

              <p className="text-center text-caption font-caption text-on-surface-variant uppercase tracking-widest pt-sm">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}
