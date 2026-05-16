import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export interface EmailPayload {
  to: string;
  customerName: string;
  eventName: string;
  pdfBuffer: Uint8Array;
}

export async function sendTicketsEmail({ to, customerName, eventName, pdfBuffer }: EmailPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY no está configurado. No se enviará el email real a", to);
    // En desarrollo, podríamos evitar intentar enviarlo
    if (process.env.NODE_ENV !== "production") {
      console.log("Simulando envío de correo con las entradas a", to);
      return { success: true, simulated: true };
    }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Strike & Beat <entradas@strikeandbeat.com>', // TODO: Cambia este dominio por tu dominio verificado en Resend
      to: [to],
      subject: `Tus Entradas para ${eventName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #cfbdff;">¡Gracias por tu compra, ${customerName}!</h1>
          <p>Tus entradas para <strong>${eventName}</strong> están confirmadas.</p>
          <p>Hemos adjuntado tus entradas en formato PDF a este correo. Por favor, <strong>descárgalo y muéstralo en la puerta</strong> desde tu dispositivo móvil o impreso.</p>
          <br/>
          <p>¡Nos vemos en el evento!</p>
          <p>El equipo de Strike & Beat</p>
        </div>
      `,
      attachments: [
        {
          filename: 'Entradas_Strike_And_Beat.pdf',
          content: Buffer.from(pdfBuffer),
        },
      ],
    });

    if (error) {
      console.error("Error al enviar email con Resend:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Excepción inesperada al enviar el email:", error);
    return { success: false, error };
  }
}
