import { createServerClient } from "@supabase/ssr";
import { generateQRDataURL } from "@/lib/qr";
import { notFound } from "next/navigation";
import TicketButtons from "./TicketButtons";

/**
 * Pagina publica de entrada digital.
 * URL: /entrada/{qr_code_token}
 * 
 * Usa el qr_code como token seguro (no expone UUIDs de BD).
 * Responsive para movil, compartible por WhatsApp/Email.
 */
export default async function EntradaPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() {}
      }
    }
  );

  // Buscar la entrada por su qr_code (token seguro)
  const { data: entry, error } = await supabase
    .from("ticket_entries")
    .select(`*, tickets ( name, price )`)
    .eq("qr_code", token)
    .single();

  if (error || !entry) {
    notFound();
  }

  // Datos del evento
  const { data: eventData } = await supabase
    .from("event_info")
    .select("*")
    .limit(1)
    .single();

  // QR
  const qrDataURL = await generateQRDataURL(entry.qr_code);

  // Variables
  const ticketName = (entry as any).tickets?.name || "Entrada";
  const ticketPrice = entry.ticket_price || (entry as any).tickets?.price || 0;
  const isVip = entry.is_vip || false;
  const customerName = entry.customer_name || "Asistente";
  const entryNumber = entry.entry_number || 0;
  const isCancelled = entry.status === "cancelled";
  
  const eventTitle = eventData?.title || "STRIKE & BEAT";
  const eventDate = eventData?.event_date || "Por confirmar";
  const eventLocation = eventData?.location_name || "Por confirmar";
  const eventAddress = eventData?.location_address || "";
  const doorsOpen = eventData?.doors_open_time || "";

  const weighInDate = eventData?.weigh_in_date || "";
  const weighInTime = eventData?.weigh_in_time || "";
  const weighInDoors = eventData?.weigh_in_doors || "";
  const weighInIsFree = eventData?.weigh_in_is_free ?? true;

  const priceDisplay = isVip ? "VIP / INVITACION" : `${Number(ticketPrice).toFixed(2)} EUR`;
  const numFormatted = String(entryNumber).padStart(4, '0');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .ticket-wrapper {
          background: #111;
          color: #fff;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .ticket {
          width: 100%;
          max-width: 360px;
          background: #0a0a0a;
          border: 1px solid #333;
          overflow: hidden;
          position: relative;
        }
        .cancelled-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        .cancelled-stamp {
          border: 4px solid #ef4444;
          color: #ef4444;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px;
          padding: 8px 24px;
          transform: rotate(-15deg);
          letter-spacing: 0.15em;
        }
        .logo-section {
          position: relative;
          background: #000;
        }
        .logo-section img {
          width: 100%;
          height: auto;
          display: block;
        }
        .entry-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.7);
          border: 1px solid #facc15;
          padding: 4px 10px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          color: #facc15;
          letter-spacing: 0.1em;
        }
        .ticket-type {
          background: #facc15;
          color: #000;
          padding: 8px 16px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 0.08em;
          text-align: center;
          text-transform: uppercase;
        }
        .price-bar {
          background: ${isVip ? '#7c3aed' : '#1a1a1a'};
          color: ${isVip ? '#fff' : '#facc15'};
          padding: 6px 16px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          text-align: center;
          letter-spacing: 0.15em;
        }
        .qr-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 16px 16px;
          background: #0a0a0a;
        }
        .qr-box {
          background: #fff;
          padding: 12px;
          display: inline-block;
          border-radius: 4px;
        }
        .qr-box img {
          width: 180px;
          height: 180px;
          display: block;
        }
        .qr-hint {
          font-size: 10px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-top: 8px;
        }
        .separator {
          border: none;
          border-top: 1px dashed #333;
          margin: 0 16px;
        }
        .attendee {
          padding: 12px 16px;
        }
        .attendee-label {
          font-size: 9px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 2px;
        }
        .attendee-name {
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .info-grid {
          padding: 10px 16px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .info-item { display: flex; flex-direction: column; }
        .info-item.full { grid-column: 1 / -1; }
        .info-label {
          font-size: 8px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        .info-value {
          font-size: 11px;
          font-weight: 600;
          color: #ccc;
          line-height: 1.3;
        }
        .weighin-title {
          font-size: 9px;
          color: #facc15;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 700;
        }
        .legal {
          padding: 8px 16px;
          border-top: 1px solid #222;
          background: #080808;
        }
        .legal p {
          font-size: 7px;
          color: #555;
          text-align: center;
          line-height: 1.5;
        }
        .save-bar {
          width: 100%;
          max-width: 360px;
          margin-top: 16px;
          display: flex;
          gap: 8px;
        }
        .save-btn {
          flex: 1;
          background: #facc15;
          color: #000;
          border: none;
          padding: 12px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 0.1em;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .save-btn:hover { background: #eab308; }
        .save-btn.secondary {
          background: transparent;
          color: #facc15;
          border: 1px solid #facc15;
        }
        .save-btn.secondary:hover {
          background: #facc15;
          color: #000;
        }
        @media print {
          .no-print { display: none !important; }
          html, body { 
            background: #0a0a0a !important;
            padding: 0 !important;
            margin: 0 !important;
            height: 100% !important;
          }
          .ticket-wrapper {
            background: #0a0a0a !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            min-height: auto !important;
            position: absolute;
            top: 0;
            left: 0;
          }
          .ticket { 
            max-width: none !important;
            width: 7.5cm !important;
            border: none !important;
            margin: 0 !important;
            page-break-inside: avoid;
            page-break-after: avoid;
            page-break-before: avoid;
          }
          .qr-box img {
            width: 150px;
            height: 150px;
          }
          @page { 
            size: 7.5cm 14cm; 
            margin: 0; 
          }
        }
      `}} />

      <main className="ticket-wrapper">
        <div id="ticket-element" className="ticket">
          {/* Overlay si esta cancelada */}
          {isCancelled && (
            <div className="cancelled-overlay">
              <div className="cancelled-stamp">CANCELADA</div>
            </div>
          )}

          {/* Logo */}
          <div className="logo-section">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-evento.png" alt={eventTitle} />
            <div className="entry-badge">#{numFormatted}</div>
          </div>

          {/* Tipo */}
          <div className="ticket-type">{ticketName}</div>

          {/* Precio */}
          <div className="price-bar">{priceDisplay}</div>

          {/* QR centrado con fondo blanco */}
          <div className="qr-section">
            <div className="qr-box">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataURL} alt="Codigo QR" />
            </div>
            <span className="qr-hint">CÓDIGO MANUAL: {(() => {
              const uuid = token.replace("SB_TKT_", "");
              return `${uuid.slice(0, 4)}-${uuid.slice(4, 8)}`.toUpperCase();
            })()}</span>
          </div>

          <hr className="separator" />

          {/* Asistente */}
          <div className="attendee">
            <div className="attendee-label">Asistente</div>
            <div className="attendee-name">{customerName}</div>
          </div>

          <hr className="separator" />

          {/* Info del evento */}
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Fecha</span>
              <span className="info-value">{eventDate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Puertas</span>
              <span className="info-value">{doorsOpen || "Consultar"}</span>
            </div>
            <div className="info-item full">
              <span className="info-label">Lugar</span>
              <span className="info-value">{eventLocation}</span>
            </div>
            {eventAddress && (
              <div className="info-item full">
                <span className="info-label">Direccion</span>
                <span className="info-value">{eventAddress}</span>
              </div>
            )}
          </div>

          {/* Pesaje */}
          {weighInDate && (
            <>
              <hr className="separator" />
              <div className="info-grid">
                <div className="info-item full">
                  <span className="weighin-title">
                    Pesaje {weighInIsFree ? "(Entrada Libre)" : ""}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Fecha</span>
                  <span className="info-value">{weighInDate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Puertas</span>
                  <span className="info-value">{weighInDoors || weighInTime || "Consultar"}</span>
                </div>
              </div>
            </>
          )}

          {/* Legal */}
          <div className="legal">
            <p>Entrada personal e intransferible. Menores acompanados por un adulto. El organizador se reserva el derecho de admision. Prohibida la reventa.</p>
          </div>
        </div>

        <TicketButtons eventTitle={eventTitle} />
      </main>
    </>
  );
}
