"use client";

import { useState } from "react";

interface Order {
  id: string;
  name: string;
  email: string;
  total: number;
  status: string;
  date: string;
  tickets: string;
}

export function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredOrders = initialOrders.filter(order => 
    order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Buscador */}
      <div className="relative group max-w-md">
        <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-neon-yellow transition-colors">
          search
        </span>
        <input
          type="text"
          placeholder="Buscar por nombre, email o ID de orden..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-surface-container border-2 border-outline-variant focus:border-neon-yellow focus:outline-none text-white p-md pl-12 font-body-md"
        />
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
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase text-center">Estado</th>
                <th className="p-md font-label-bold text-xs text-on-surface-variant uppercase text-right">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td className="p-md font-caption text-caption text-outline truncate max-w-[120px]">
                    {order.id}
                  </td>
                  <td className="p-md">
                    <p className="font-label-bold uppercase text-white">{order.name}</p>
                    <p className="font-caption text-xs text-on-surface-variant lowercase">{order.email}</p>
                  </td>
                  <td className="p-md font-body-md text-on-surface-variant">
                    {order.tickets}
                  </td>
                  <td className="p-md text-right font-headline-md text-headline-md text-neon-yellow">
                    {order.total.toFixed(2)}€
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
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-xl text-center text-on-surface-variant font-body-md uppercase">
                    {searchTerm ? "No se encontraron órdenes para esta búsqueda" : "No hay órdenes registradas todavía"}
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
