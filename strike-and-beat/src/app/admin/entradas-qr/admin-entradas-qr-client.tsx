"use client";

import { useState, useTransition } from "react";
import {
  createManualTicketEntries,
  cancelTicketEntry,
  reactivateTicketEntry,
  createValidator,
  deleteValidator,
} from "@/app/actions/ticket-entries";
import { useRouter } from "next/navigation";

interface TicketEntry {
  id: string;
  orderId: string | null;
  ticketId: string;
  qrCode: string;
  entryNumber: number;
  customerName: string;
  customerEmail: string;
  status: string;
  isVip: boolean;
  ticketPrice: number;
  usedAt: string | null;
  createdAt: string;
  ticketName: string;
}

interface Validator {
  id: string;
  name: string;
  email: string;
  pin_code: string;
  is_active: boolean;
}

interface Ticket {
  id: string;
  name: string;
}

interface Props {
  entries: TicketEntry[];
  validators: Validator[];
  tickets: Ticket[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  valid: { label: "VALIDA", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  used: { label: "USADA", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  cancelled: { label: "CANCELADA", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export default function AdminEntradasQRClient({ entries, validators, tickets }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"entries" | "validators">("entries");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showValidatorModal, setShowValidatorModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "valid" | "used" | "cancelled">("all");

  // Formulario de creación manual
  const [formData, setFormData] = useState({
    ticketId: tickets[0]?.id || "",
    customerName: "",
    customerEmail: "",
    quantity: 1,
    isVip: false,
  });

  // Formulario de validador
  const [validatorData, setValidatorData] = useState({
    name: "",
    email: "",
    pinCode: "",
  });

  const filteredEntries = filter === "all"
    ? entries
    : entries.filter((e) => e.status === filter);

  const stats = {
    total: entries.length,
    valid: entries.filter((e) => e.status === "valid").length,
    used: entries.filter((e) => e.status === "used").length,
    cancelled: entries.filter((e) => e.status === "cancelled").length,
  };

  async function handleCreateEntries(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createManualTicketEntries(formData);
      if (result.success) {
        setShowCreateModal(false);
        setFormData({ ticketId: tickets[0]?.id || "", customerName: "", customerEmail: "", quantity: 1, isVip: false });
        router.refresh();
      } else {
        alert("Error: " + result.error);
      }
    });
  }

  async function handleCreateValidator(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createValidator(validatorData);
      if (result.success) {
        setShowValidatorModal(false);
        setValidatorData({ name: "", email: "", pinCode: "" });
        router.refresh();
      } else {
        alert("Error: " + result.error);
      }
    });
  }

  async function handleCancel(id: string) {
    if (!confirm("¿Seguro que quieres cancelar esta entrada? Ya no se podrá usar para acceder.")) return;
    startTransition(async () => {
      const result = await cancelTicketEntry(id);
      if (result.success) {
        router.refresh();
      } else {
        alert("Error: " + result.error);
      }
    });
  }

  async function handleDeleteValidator(id: string) {
    if (!confirm("¿Eliminar este validador?")) return;
    startTransition(async () => {
      await deleteValidator(id);
      router.refresh();
    });
  }

  async function handleReactivate(id: string) {
    if (!confirm("¿Seguro que quieres reactivar esta entrada? Volverá a ser válida para el acceso.")) return;
    startTransition(async () => {
      const result = await reactivateTicketEntry(id);
      if (result.success) {
        router.refresh();
      } else {
        alert("Error: " + result.error);
      }
    });
  }

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg uppercase text-on-surface">
            Entradas QR
          </h1>
          <p className="font-body-md text-on-surface-variant mt-xs">
            Gestión de entradas con código QR y validadores de puerta
          </p>
        </div>
        <div className="flex gap-sm">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-sm px-md py-sm bg-neon-yellow text-surface font-label-bold uppercase tracking-wider hover:bg-neon-yellow/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
            Crear Entradas
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
        {[
          { label: "Total", value: stats.total, icon: "confirmation_number", color: "text-primary" },
          { label: "Válidas", value: stats.valid, icon: "check_circle", color: "text-green-400" },
          { label: "Usadas", value: stats.used, icon: "done_all", color: "text-yellow-400" },
          { label: "Canceladas", value: stats.cancelled, icon: "cancel", color: "text-red-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container border-2 border-outline-variant p-md">
            <div className="flex items-center gap-sm mb-sm">
              <span className={`material-symbols-outlined text-[20px] ${stat.color}`}>{stat.icon}</span>
              <span className="font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className={`font-display-xl text-[36px] ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-outline-variant">
        <button
          onClick={() => setActiveTab("entries")}
          className={`px-lg py-md font-label-bold uppercase tracking-wider text-sm border-b-2 -mb-[2px] transition-colors ${
            activeTab === "entries"
              ? "border-neon-yellow text-neon-yellow"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Entradas ({entries.length})
        </button>
        <button
          onClick={() => setActiveTab("validators")}
          className={`px-lg py-md font-label-bold uppercase tracking-wider text-sm border-b-2 -mb-[2px] transition-colors ${
            activeTab === "validators"
              ? "border-neon-yellow text-neon-yellow"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Validadores ({validators.length})
        </button>
      </div>

      {/* Tab: Entries */}
      {activeTab === "entries" && (
        <div>
          {/* Filters */}
          <div className="flex gap-sm mb-md flex-wrap">
            {(["all", "valid", "used", "cancelled"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-md py-xs font-label-bold text-[11px] uppercase tracking-wider border-2 transition-colors ${
                  filter === f
                    ? "border-neon-yellow text-neon-yellow bg-neon-yellow/10"
                    : "border-outline-variant text-on-surface-variant hover:border-on-surface"
                }`}
              >
                {f === "all" ? "Todas" : STATUS_LABELS[f]?.label || f}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-outline-variant">
                  <th className="py-md px-sm font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider">#</th>
                  <th className="py-md px-sm font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider">Estado</th>
                  <th className="py-md px-sm font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider">Tipo</th>
                  <th className="py-md px-sm font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider">Cliente</th>
                  <th className="py-md px-sm font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider">Precio</th>
                  <th className="py-md px-sm font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider">Origen</th>
                  <th className="py-md px-sm font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-xl text-center text-on-surface-variant font-body-md">
                      No hay entradas {filter !== "all" ? `con estado "${STATUS_LABELS[filter]?.label}"` : ""}
                    </td>
                  </tr>
                )}
                {filteredEntries.map((entry) => {
                  const statusInfo = STATUS_LABELS[entry.status] || STATUS_LABELS.valid;
                  return (
                    <tr key={entry.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-sm px-sm font-mono text-neon-yellow text-sm">
                        #{String(entry.entryNumber).padStart(4, '0')}
                      </td>
                      <td className="py-sm px-sm">
                        <span className={`inline-block px-sm py-xs text-[10px] font-label-bold uppercase tracking-wider border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-sm px-sm">
                        <p className="font-label-bold text-sm text-on-surface">{entry.ticketName}</p>
                      </td>
                      <td className="py-sm px-sm">
                        <p className="font-label-bold text-sm text-on-surface">{entry.customerName}</p>
                        <p className="font-body-sm text-[11px] text-on-surface-variant">{entry.customerEmail}</p>
                      </td>
                      <td className="py-sm px-sm font-label-bold text-sm">
                        {entry.isVip
                          ? <span className="text-purple-400">VIP</span>
                          : <span className="text-on-surface">{Number(entry.ticketPrice).toFixed(2)} EUR</span>
                        }
                      </td>
                      <td className="py-sm px-sm">
                        <span className={`text-[10px] font-label-bold uppercase tracking-wider ${entry.orderId ? "text-primary" : "text-neon-yellow"}`}>
                          {entry.orderId ? "Stripe" : "Manual"}
                        </span>
                      </td>
                      <td className="py-sm px-sm">
                        <div className="flex gap-xs">
                          <button
                            onClick={() => {
                              const ticketUrl = `${window.location.origin}/entrada/${entry.qrCode}`;
                              const waMessage = encodeURIComponent(`Hola ${entry.customerName}, aqui tienes tu entrada para STRIKE & BEAT: ${ticketUrl}`);
                              window.open(`https://wa.me/?text=${waMessage}`, "_blank");
                            }}
                            className="p-xs border border-outline-variant text-on-surface-variant hover:text-green-500 hover:border-green-500 transition-colors inline-flex"
                            title="Enviar por WhatsApp"
                          >
                            <span className="material-symbols-outlined text-[18px]">chat</span>
                          </button>
                          <button
                            onClick={() => {
                              const ticketUrl = `${window.location.origin}/entrada/${entry.qrCode}`;
                              const emailSubject = encodeURIComponent("Tu entrada para STRIKE & BEAT");
                              const emailBody = encodeURIComponent(`Hola ${entry.customerName},\n\nAqui tienes el enlace a tu entrada para el evento:\n${ticketUrl}\n\n¡Te esperamos!`);
                              window.open(`mailto:${entry.customerEmail}?subject=${emailSubject}&body=${emailBody}`);
                            }}
                            className="p-xs border border-outline-variant text-on-surface-variant hover:text-blue-400 hover:border-blue-400 transition-colors inline-flex"
                            title="Enviar por Email"
                          >
                            <span className="material-symbols-outlined text-[18px]">mail</span>
                          </button>
                          <a
                            href={`/entrada/${entry.qrCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-xs border border-outline-variant text-on-surface-variant hover:text-neon-yellow hover:border-neon-yellow transition-colors inline-flex"
                            title="Ver y descargar entrada"
                          >
                            <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                          </a>
                          {entry.status === "valid" && (
                            <button
                              onClick={() => handleCancel(entry.id)}
                              disabled={isPending}
                              className="p-xs border border-outline-variant text-on-surface-variant hover:text-red-400 hover:border-red-400 transition-colors disabled:opacity-50"
                              title="Cancelar entrada"
                            >
                              <span className="material-symbols-outlined text-[18px]">block</span>
                            </button>
                          )}
                          {entry.status === "cancelled" && (
                            <button
                              onClick={() => handleReactivate(entry.id)}
                              disabled={isPending}
                              className="p-xs border border-outline-variant text-on-surface-variant hover:text-green-400 hover:border-green-400 transition-colors disabled:opacity-50"
                              title="Reactivar entrada"
                            >
                              <span className="material-symbols-outlined text-[18px]">settings_backup_restore</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Validators */}
      {activeTab === "validators" && (
        <div>
          <div className="flex justify-end mb-md">
            <button
              onClick={() => setShowValidatorModal(true)}
              className="flex items-center gap-sm px-md py-sm bg-primary text-surface font-label-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Nuevo Validador
            </button>
          </div>

          <div className="grid gap-md">
            {validators.length === 0 && (
              <div className="text-center py-xl text-on-surface-variant font-body-md">
                No hay validadores. Crea uno para empezar a escanear en la puerta.
              </div>
            )}
            {validators.map((v) => (
              <div key={v.id} className="flex items-center justify-between bg-surface-container border-2 border-outline-variant p-md">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">badge</span>
                  </div>
                  <div>
                    <p className="font-label-bold text-on-surface uppercase">{v.name}</p>
                    <p className="font-body-sm text-on-surface-variant text-[12px]">{v.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <span className="font-mono text-primary text-lg tracking-[0.3em]">{v.pin_code}</span>
                  <button
                    onClick={() => handleDeleteValidator(v.id)}
                    disabled={isPending}
                    className="p-xs border border-outline-variant text-on-surface-variant hover:text-red-400 hover:border-red-400 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Crear Entradas Manuales */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-surface-container border-2 border-outline-variant w-full max-w-[500px] min-w-[320px] shadow-2xl">
            <div className="flex items-center justify-between p-lg border-b-2 border-outline-variant">
              <h2 className="font-headline-md text-headline-md uppercase text-on-surface">Crear Entradas</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateEntries} className="p-lg space-y-md">
              <div>
                <label className="font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider block mb-xs">
                  Tipo de Entrada
                </label>
                <select
                  value={formData.ticketId}
                  onChange={(e) => setFormData({ ...formData, ticketId: e.target.value })}
                  className="w-full bg-surface-container-highest border-2 border-outline-variant text-on-surface p-sm font-body-md"
                  required
                >
                  {tickets.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider block mb-xs">
                  Nombre del cliente / Destinatario
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Nombre del sponsor, invitado..."
                  className="w-full bg-surface-container-highest border-2 border-outline-variant text-on-surface p-sm font-body-md"
                  required
                />
              </div>
              <div>
                <label className="font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider block mb-xs">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="email@ejemplo.com"
                  className="w-full bg-surface-container-highest border-2 border-outline-variant text-on-surface p-sm font-body-md"
                  required
                />
              </div>
              <div>
                <label className="font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider block mb-xs">
                  Cantidad
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full bg-surface-container-highest border-2 border-outline-variant text-on-surface p-sm font-body-md"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-md cursor-pointer py-sm">
                  <input
                    type="checkbox"
                    checked={formData.isVip}
                    onChange={(e) => setFormData({ ...formData, isVip: e.target.checked })}
                    className="w-5 h-5 accent-purple-500"
                  />
                  <div>
                    <span className="font-label-bold text-[11px] text-on-surface uppercase tracking-wider block">
                      Cortesia / VIP
                    </span>
                    <span className="font-body-sm text-[10px] text-on-surface-variant">
                      {formData.isVip ? "No se imprimira precio en la entrada" : "Se imprimira el precio del tipo seleccionado"}
                    </span>
                  </div>
                </label>
              </div>
              <div className="flex gap-md pt-md">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-sm border-2 border-outline-variant text-on-surface-variant font-label-bold uppercase tracking-wider hover:border-on-surface transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-sm bg-neon-yellow text-surface font-label-bold uppercase tracking-wider hover:bg-neon-yellow/90 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Generando..." : "Generar QR"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Crear Validador */}
      {showValidatorModal && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-surface-container border-2 border-outline-variant w-full max-w-[500px] min-w-[320px] shadow-2xl">
            <div className="flex items-center justify-between p-lg border-b-2 border-outline-variant">
              <h2 className="font-headline-md text-headline-md uppercase text-on-surface">Nuevo Validador</h2>
              <button onClick={() => setShowValidatorModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateValidator} className="p-lg space-y-md">
              <div>
                <label className="font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider block mb-xs">Nombre</label>
                <input
                  type="text"
                  value={validatorData.name}
                  onChange={(e) => setValidatorData({ ...validatorData, name: e.target.value })}
                  placeholder="Nombre del validador"
                  className="w-full bg-surface-container-highest border-2 border-outline-variant text-on-surface p-sm font-body-md"
                  required
                />
              </div>
              <div>
                <label className="font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider block mb-xs">Email</label>
                <input
                  type="email"
                  value={validatorData.email}
                  onChange={(e) => setValidatorData({ ...validatorData, email: e.target.value })}
                  placeholder="email@ejemplo.com"
                  className="w-full bg-surface-container-highest border-2 border-outline-variant text-on-surface p-sm font-body-md"
                  required
                />
              </div>
              <div>
                <label className="font-label-bold text-[11px] text-on-surface-variant uppercase tracking-wider block mb-xs">
                  PIN de Acceso (4-6 dígitos)
                </label>
                <input
                  type="text"
                  value={validatorData.pinCode}
                  onChange={(e) => setValidatorData({ ...validatorData, pinCode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                  placeholder="1234"
                  maxLength={6}
                  className="w-full bg-surface-container-highest border-2 border-outline-variant text-on-surface p-sm font-body-md font-mono text-xl tracking-[0.5em]"
                  required
                />
                <p className="font-body-sm text-on-surface-variant text-[11px] mt-xs">
                  El validador usará este PIN en su móvil para acceder al escáner
                </p>
              </div>
              <div className="flex gap-md pt-md">
                <button
                  type="button"
                  onClick={() => setShowValidatorModal(false)}
                  className="flex-1 py-sm border-2 border-outline-variant text-on-surface-variant font-label-bold uppercase tracking-wider hover:border-on-surface transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-sm bg-primary text-surface font-label-bold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Creando..." : "Crear Validador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
