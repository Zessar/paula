"use client";

import { useState } from "react";
import { updateOrderMarketingConsent } from "@/app/actions/orders";

interface Order {
  id: string;
  name: string;
  email: string;
  total: number;
  status: string;
  date: string;
  tickets: string;
  marketingConsent: boolean;
}

export function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  

  const handleToggleMarketing = async (orderId: string, currentConsent: boolean) => {
    setUpdatingId(orderId);
    try {
      const result = await updateOrderMarketingConsent(orderId, !currentConsent);
      if (result.success) {
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, marketingConsent: !currentConsent } : o
        ));
      } else {
        alert("Error al actualizar el consentimiento: " + result.error);
      }
    } catch (err) {
      alert("Error inesperado al actualizar");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColor: Record<string, string> = {
    completado: "text-green-400",
    paid: "text-green-400",
    pendiente: "text-neon-yellow",
    processing: "text-neon-yellow",
    reembolso: "text-error",
    failed: "text-error",
  };

  return (
    <div className="space-y-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b-2 border-outline-variant pb-md gap-4">
        <div>
          <h2 className="font-display-xl text-headline-lg uppercase text-white">Registro de Ventas</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Gestiona y revisa todas las transacciones del evento</p>
        </div>
      </div>

      <div className="bg-surface-container border-2 border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-outline-variant bg-surface-container-low">
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase">ID Orden</th>
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase">Cliente</th>
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase">Entradas</th>
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase text-right">Total</th>
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase text-center">Marketing</th>
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase text-center">Estado</th>
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase text-right">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td className="p-md font-caption text-caption text-outline truncate max-w-[120px]">
                    {order.id}
                  </td>
                  <td className="p-md">
                    <p className="font-label-bold uppercase text-white">{order.name || "Sin nombre"}</p>
                    <p className="font-caption text-xs text-on-surface-variant lowercase">{order.email}</p>
                  </td>
                  <td className="p-md font-body-md text-on-surface-variant">
                    {order.tickets}
                  </td>
                  <td className="p-md text-right font-headline-md text-headline-md text-neon-yellow">
                    {order.total.toFixed(2)}€
                  </td>
                  <td className="p-md text-center">
                    <button
                      onClick={() => handleToggleMarketing(order.id, order.marketingConsent)}
                      disabled={updatingId === order.id}
                      className={`group/btn relative px-xs py-0.5 font-label-bold text-[10px] uppercase border transition-all active:scale-95 disabled:opacity-50
                        ${order.marketingConsent 
                          ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20" 
                          : "bg-outline/10 text-on-surface-variant border-outline/20 hover:bg-outline/20"
                        }`}
                      title={order.marketingConsent ? "Quitar suscripción" : "Activar suscripción"}
                    >
                      {updatingId === order.id ? (
                        <span className="material-symbols-outlined text-[12px] animate-spin">progress_activity</span>
                      ) : (
                        order.marketingConsent ? "SI" : "NO"
                      )}
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-[8px] opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                        Click para cambiar
                      </span>
                    </button>
                  </td>
                  <td className="p-md text-center">
                    <span className={`font-label-bold text-xs uppercase tracking-wider ${statusColor[order.status] || "text-outline"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-md text-right font-caption text-caption text-outline">
                    {order.date}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-xl text-center text-on-surface-variant font-body-md uppercase">
                    No hay órdenes registradas todavía
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
