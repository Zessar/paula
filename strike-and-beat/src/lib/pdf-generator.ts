import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { generateQRDataURL } from "./qr";

export interface TicketPDFData {
  customerName: string;
  eventName: string;
  eventDate: string;
  eventDoorsOpen: string;
  eventLocation: string;
  weighInDate?: string;
  weighInDoors?: string;
  weighInIsFree?: boolean;
  tickets: {
    id: string; // The specific UUID of the ticket entry
    type: string; // "General", "VIP", etc.
    price: number;
    qrCode: string; // The SB_TKT_ token
  }[];
}

/**
 * Genera un PDF que contiene todas las entradas de una compra.
 * Retorna el PDF como un buffer de bytes.
 */
export async function generateTicketsPDF(data: TicketPDFData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 0; i < data.tickets.length; i++) {
    const ticket = data.tickets[i];
    
    // Crear una página nueva por cada entrada
    const page = pdfDoc.addPage([595.28, 841.89]); // Tamaño A4
    const { width, height } = page.getSize();
    
    // Dibujar un marco/borde
    page.drawRectangle({
      x: 50,
      y: 50,
      width: width - 100,
      height: height - 100,
      borderColor: rgb(0.1, 0.1, 0.1),
      borderWidth: 2,
    });

    // Título del evento
    page.drawText(data.eventName, {
      x: 70,
      y: height - 100,
      size: 24,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });

    // Fecha, Apertura y Lugar
    page.drawText(`${data.eventDate} | Apertura: ${data.eventDoorsOpen} | ${data.eventLocation}`, {
      x: 70,
      y: height - 130,
      size: 14,
      font: helveticaFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Información del cliente
    page.drawText(`Comprador: ${data.customerName}`, {
      x: 70,
      y: height - 180,
      size: 16,
      font: helveticaFont,
    });

    page.drawText(`Tipo de Entrada: ${ticket.type}`, {
      x: 70,
      y: height - 210,
      size: 18,
      font: helveticaBold,
    });
    
    page.drawText(`Precio: ${ticket.price.toFixed(2)} €`, {
      x: 70,
      y: height - 240,
      size: 14,
      font: helveticaFont,
    });
    page.drawText(`Entrada ${i + 1} de ${data.tickets.length}`, {
      x: 70,
      y: height - 270,
      size: 12,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    // Sección de Pesaje (Si existe)
    if (data.weighInDate) {
      page.drawText(`PESAJE ${data.weighInIsFree ? "(ENTRADA LIBRE)" : ""}`, {
        x: 70,
        y: height - 310,
        size: 14,
        font: helveticaBold,
        color: rgb(0.8, 0.6, 0), // Un tono dorado/naranja para destacar
      });

      page.drawText(`Fecha: ${data.weighInDate} | Apertura: ${data.weighInDoors || "Consultar"}`, {
        x: 70,
        y: height - 335,
        size: 12,
        font: helveticaFont,
        color: rgb(0.2, 0.2, 0.2),
      });
    }

    // Generar la imagen del QR y convertir el DataURL base64 a imagen
    const qrDataUrl = await generateQRDataURL(ticket.qrCode);
    const qrBase64 = qrDataUrl.split(",")[1];
    const qrImageBytes = Buffer.from(qrBase64, "base64");
    const qrImage = await pdfDoc.embedPng(qrImageBytes);

    // Dibujar el QR en el centro inferior
    const qrDims = qrImage.scale(0.8);
    page.drawImage(qrImage, {
      x: width / 2 - qrDims.width / 2,
      y: height / 2 - qrDims.height / 2 - 50,
      width: qrDims.width,
      height: qrDims.height,
    });

    // Código numérico debajo del QR
    page.drawText(ticket.qrCode, {
      x: width / 2 - (ticket.qrCode.length * 3), // centrado aproximado
      y: height / 2 - qrDims.height / 2 - 70,
      size: 10,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Instrucciones
    page.drawText("Muestra este código QR en la puerta desde tu móvil o impreso.", {
      x: 70,
      y: 100,
      size: 12,
      font: helveticaFont,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
