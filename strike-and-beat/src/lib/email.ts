import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailPayload {
  to: string;
  customerName: string;
  eventName: string;
  ticketTokens: string[];
}

export async function sendTicketsEmail({ to, customerName, eventName, ticketTokens }: EmailPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY no está configurado. No se enviará el email real a", to);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Strike & Beat <onboarding@resend.dev>",
      to: [to],
      subject: `Tus Entradas para ${eventName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #ffffff; background-color: #0d0d0d; padding: 40px; border-top: 4px solid #facc15;">
          <h1 style="color: #facc15; font-size: 28px; text-transform: uppercase; margin-bottom: 20px;">¡Gracias por tu compra, ${customerName}!</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #cccccc;">Tus entradas para <strong style="color: #facc15;">${eventName}</strong> están confirmadas.</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #cccccc; margin-top: 25px;">Puedes acceder a tus entradas digitales haciendo clic en los siguientes botones. Cada enlace contiene tu código QR único para el acceso:</p>
          
          <div style="margin: 30px 0;">
            ${ticketTokens.map((token, index) => `
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://strikeandbeat.com'}/entrada/${token}" 
                 style="display: inline-block; background-color: #facc15; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; margin-right: 10px; margin-bottom: 10px; border-radius: 2px; font-size: 14px; letter-spacing: 0.05em;">
                ENTRADA ${index + 1}
              </a>
            `).join('')}
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #888888; margin-top: 40px;">
            Simplemente muestra el código QR de cada enlace desde tu móvil al llegar al evento.
          </p>
          
          <div style="margin-top: 40px; border-top: 1px solid #333333; padding-top: 20px;">
            <p style="font-size: 14px; color: #666666; margin: 0;">¡Nos vemos en el evento!</p>
            <p style="font-size: 14px; color: #facc15; font-weight: bold; margin: 5px 0 0 0;">EL EQUIPO DE STRIKE & BEAT</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error de Resend:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error al enviar el email:", error);
    throw error;
  }
}
