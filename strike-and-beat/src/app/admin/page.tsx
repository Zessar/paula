import {
  getTickets,
  getFights,
  getArtists,
  getSponsors,
  getOrders,
  getSalesStats
} from "@/lib/supabase/queries"

export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------ */
/*  COMPONENTE STAT CARD                                               */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string
  value: string
  icon: string
  accent?: boolean
}) {
  return (
    <div className={`bg-surface-container border-2 p-lg ${accent ? "border-neon-yellow" : "border-outline-variant"}`}>
      <div className="flex items-start justify-between mb-md">
        <span
          className={`material-symbols-outlined text-[28px] ${accent ? "text-neon-yellow" : "text-on-surface-variant"}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <span className="material-symbols-outlined text-sm text-outline">trending_up</span>
      </div>
      <p className={`font-display-xl text-headline-md ${accent ? "text-neon-yellow" : "text-on-surface"}`}>
        {value}
      </p>
      <p className="font-label-bold text-xs text-on-surface-variant uppercase tracking-wider mt-xs">
        {label}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGINA PRINCIPAL                                                   */
/* ------------------------------------------------------------------ */

export default async function AdminDashboard() {
  const [tickets, fighters, artists, sponsors, recentOrders, stats] = await Promise.all([
    getTickets(),
    getFights(),
    getArtists(),
    getSponsors(),
    getOrders(5),
    getSalesStats()
  ]);

  const statusColor: Record<string, string> = {
    completado: "text-green-400",
    paid: "text-green-400",
    pendiente: "text-neon-yellow",
    processing: "text-neon-yellow",
    reembolso: "text-error",
    failed: "text-error",
  }

  return (
    <div className="space-y-lg">
      {/* Titulo */}
      <div className="flex items-end justify-between border-b-2 border-outline-variant pb-md">
        <div>
          <h2 className="font-display-xl text-headline-lg uppercase text-white">Dashboard</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
            Resumen general del evento Strike & Beat
          </p>
        </div>
        <div className="flex items-center gap-sm bg-surface-container border border-outline-variant px-md py-sm">
          <span className="w-2 h-2 bg-neon-yellow"></span>
          <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
            En Vivo
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  STATS GRID                                                  */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
        <StatCard
          label="Ingresos Totales"
          value={`${stats.totalRevenue.toLocaleString("es-ES", { minimumFractionDigits: 2 })}€`}
          icon="payments"
          accent
        />
        <StatCard
          label="Entradas Vendidas"
          value={stats.totalTicketsSold.toString()}
          icon="confirmation_number"
        />
        <StatCard
          label="Ticket Medio"
          value={`${stats.averageOrderValue.toFixed(2)}€`}
          icon="analytics"
        />
      </div>

      {/* ============================================================ */}
      {/*  INVENTARIO RAPIDO                                           */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <div className="bg-surface-container border-2 border-outline-variant p-lg">
          <h3 className="font-headline-md text-headline-md uppercase text-white mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-neon-yellow" style={{ fontVariationSettings: "'FILL' 1" }}>
              confirmation_number
            </span>
            Entradas
          </h3>
          <div className="space-y-sm">
            {tickets.map((t) => (
              <div key={t.id} className="flex justify-between items-center py-sm border-b border-outline-variant last:border-b-0">
                <span className="font-label-bold text-label-bold text-on-surface uppercase">{t.name}</span>
                <div className="flex items-center gap-md">
                  <span className="font-headline-md text-headline-md text-neon-yellow">{t.price}€</span>
                  <span className="font-caption text-caption text-outline">
                    {t.stock ? `${t.stock} uds` : "Ilimitado"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container border-2 border-outline-variant p-lg">
          <h3 className="font-headline-md text-headline-md uppercase text-white mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-neon-yellow" style={{ fontVariationSettings: "'FILL' 1" }}>
              sports_mma
            </span>
            Combates
          </h3>
          <div className="space-y-sm">
            {fighters.map((f) => (
              <div key={f.id} className="py-sm border-b border-outline-variant last:border-b-0">
                <div className="flex justify-between items-center">
                  <span className="font-label-bold text-label-bold text-on-surface uppercase">
                    {f.aliasA} vs {f.aliasB}
                  </span>
                  <span className="font-caption text-caption text-neon-yellow uppercase">{f.category}</span>
                </div>
                <span className="font-caption text-caption text-outline">{f.rounds} | {f.rules}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container border-2 border-outline-variant p-lg">
          <h3 className="font-headline-md text-headline-md uppercase text-white mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-neon-yellow" style={{ fontVariationSettings: "'FILL' 1" }}>
              mic_external_on
            </span>
            Artistas
          </h3>
          <div className="space-y-sm">
            {artists.map((a) => (
              <div key={a.id} className="flex justify-between items-center py-sm border-b border-outline-variant last:border-b-0">
                <span className="font-label-bold text-label-bold text-on-surface uppercase">{a.name}</span>
                <span className="font-caption text-caption text-outline uppercase">{a.genre}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  ORDENES RECIENTES                                           */}
      {/* ============================================================ */}
      <div className="bg-surface-container border-2 border-outline-variant">
        <div className="px-lg py-md border-b-2 border-outline-variant flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md uppercase text-white flex items-center gap-sm">
            <span className="material-symbols-outlined text-neon-yellow" style={{ fontVariationSettings: "'FILL' 1" }}>
              receipt_long
            </span>
            Ordenes Recientes
          </h3>
          <span className="font-caption text-caption text-outline uppercase tracking-wider">
            Ultimas 5
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left px-lg py-md font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">ID</th>
                <th className="text-left px-lg py-md font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">Cliente</th>
                <th className="text-left px-lg py-md font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">Entradas</th>
                <th className="text-right px-lg py-md font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">Total</th>
                <th className="text-center px-lg py-md font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">Estado</th>
                <th className="text-right px-lg py-md font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                  <td className="px-lg py-md font-caption text-caption text-outline truncate max-w-[100px]">{order.id}</td>
                  <td className="px-lg py-md font-label-bold text-label-bold text-on-surface uppercase">{order.name}</td>
                  <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">{order.tickets}</td>
                  <td className="px-lg py-md text-right font-headline-md text-headline-md text-neon-yellow">{order.total.toFixed(2)}€</td>
                  <td className="px-lg py-md text-center">
                    <span className={`font-label-bold text-xs uppercase tracking-wider ${statusColor[order.status] || "text-outline"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-lg py-md text-right font-caption text-caption text-outline">{order.date}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-lg py-xl text-center text-outline uppercase font-label-bold">
                    No hay órdenes registradas todavía
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  RESUMEN DE PATROCINADORES                                   */}
      {/* ============================================================ */}
      <div className="bg-surface-container border-2 border-outline-variant p-lg">
        <h3 className="font-headline-md text-headline-md uppercase text-white mb-md flex items-center gap-sm">
          <span className="material-symbols-outlined text-neon-yellow" style={{ fontVariationSettings: "'FILL' 1" }}>
            handshake
          </span>
          Patrocinadores
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
          {sponsors.map((s) => (
            <div key={s.id} className="bg-surface-container-low border border-outline-variant p-md flex items-center justify-center h-20">
              <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
