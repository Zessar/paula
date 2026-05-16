import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { generateQRDataURL } from "./qr";

export interface TicketPDFData {
  customerName: string;
  eventName: string;
  eventDate: string;
  eventDoorsOpen: string;
  eventLocation: string;
  eventLogoUrl?: string;
  weighInDate?: string;
  weighInDoors?: string;
  weighInIsFree?: boolean;
  tickets: {
    id: string; 
    type: string; 
    price: number;
    qrCode: string; 
    entryNumber?: number;
  }[];
}

/**
 * Genera un PDF calclando el diseño de la entrada digital.
 * Ajustado según feedback: Más ancho, menos margen superior, QR más pequeño.
 */
export async function generateTicketsPDF(data: TicketPDFData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Colores del sistema
  const colorBlack = rgb(0, 0, 0);
  const colorDarkBg = rgb(0.04, 0.04, 0.04);
  const colorNeonYellow = rgb(0.98, 0.8, 0.08); // #FACC15
  const colorWhite = rgb(1, 1, 1);
  const colorGray = rgb(0.5, 0.5, 0.5);

  let logoImage: any = null;
  if (data.eventLogoUrl) {
    try {
      const response = await fetch(data.eventLogoUrl);
      const imageBytes = await response.arrayBuffer();
      if (data.eventLogoUrl.toLowerCase().endsWith('.png')) {
        logoImage = await pdfDoc.embedPng(imageBytes);
      } else {
        logoImage = await pdfDoc.embedJpg(imageBytes);
      }
    } catch (e) {
      console.warn("No se pudo cargar la imagen del evento para el PDF:", e);
    }
  }

  for (let i = 0; i < data.tickets.length; i++) {
    const ticket = data.tickets[i];
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    
    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.05, 0.05, 0.05) });

    // AJUSTES DE TAMAÑO Y POSICIÓN
    const ticketW = 450; // Más ancho como pidió el usuario
    const ticketH = 780;
    const ticketX = (width - ticketW) / 2;
    const ticketY = height - ticketH - 30; // Margen superior mínimo (30px)

    page.drawRectangle({
      x: ticketX,
      y: ticketY,
      width: ticketW,
      height: ticketH,
      color: colorDarkBg,
    });

    // 1. POSTER (Cabecera)
    let currentY = ticketY + ticketH;
    if (logoImage) {
      const imgDims = logoImage.scaleToFit(ticketW, 280);
      page.drawImage(logoImage, {
        x: ticketX + (ticketW - imgDims.width) / 2,
        y: currentY - imgDims.height,
        width: imgDims.width,
        height: imgDims.height,
      });
      currentY -= imgDims.height;
    } else {
      currentY -= 80;
      page.drawRectangle({ x: ticketX, y: currentY, width: ticketW, height: 80, color: colorBlack });
      page.drawText(data.eventName.toUpperCase(), { x: ticketX + 20, y: currentY + 30, size: 20, font: helveticaBold, color: colorWhite });
    }

    // 2. BADGE #0000
    const entryNumStr = `#${String(ticket.entryNumber || 0).padStart(4, '0')}`;
    page.drawRectangle({ x: ticketX + ticketW - 75, y: ticketY + ticketH - 45, width: 65, height: 35, color: colorBlack, borderColor: colorNeonYellow, borderWidth: 1 });
    page.drawText(entryNumStr, { x: ticketX + ticketW - 68, y: ticketY + ticketH - 33, size: 16, font: helveticaBold, color: colorNeonYellow });

    // 3. BARRA TIPO ENTRADA
    currentY -= 45;
    page.drawRectangle({ x: ticketX, y: currentY, width: ticketW, height: 45, color: colorNeonYellow });
    page.drawText(ticket.type.toUpperCase(), {
      x: ticketX + (ticketW - (ticket.type.length * 9)) / 2,
      y: currentY + 15,
      size: 18,
      font: helveticaBold,
      color: colorBlack,
    });

    // 4. BARRA PRECIO
    currentY -= 35;
    page.drawRectangle({ x: ticketX, y: currentY, width: ticketW, height: 35, color: rgb(0.1, 0.1, 0.1) });
    const priceStr = `${ticket.price.toFixed(2)} EUR`;
    page.drawText(priceStr, {
      x: ticketX + (ticketW - (priceStr.length * 8)) / 2,
      y: currentY + 10,
      size: 14,
      font: helveticaBold,
      color: colorNeonYellow,
    });

    // 5. QR CODE (MÁS PEQUEÑO Y CENTRADO)
    const qrSize = 140; // QR reducido
    currentY -= (qrSize + 40);
    const qrDataUrl = await generateQRDataURL(ticket.qrCode);
    const qrBase64 = qrDataUrl.split(",")[1];
    const qrImage = await pdfDoc.embedPng(Buffer.from(qrBase64, "base64"));

    page.drawRectangle({ x: ticketX + (ticketW - qrSize) / 2 - 10, y: currentY - 10, width: qrSize + 20, height: qrSize + 20, color: colorWhite });
    page.drawImage(qrImage, { x: ticketX + (ticketW - qrSize) / 2, y: currentY, width: qrSize, height: qrSize });

    const manualCodeStr = `CÓDIGO MANUAL: ${ticket.qrCode.substring(0, 8).toUpperCase()}`;
    page.drawText(manualCodeStr, { x: ticketX + (ticketW - (manualCodeStr.length * 6)) / 2, y: currentY - 25, size: 9, font: helveticaBold, color: colorGray });

    // 6. DETALLES
    currentY -= 50;
    const dashOptions = { dashArray: [4, 4] };
    page.drawLine({ start: { x: ticketX + 20, y: currentY }, end: { x: ticketX + ticketW - 20, y: currentY }, thickness: 1, color: colorGray, ...dashOptions });

    // ASISTENTE
    currentY -= 25;
    page.drawText("ASISTENTE", { x: ticketX + 20, y: currentY, size: 9, font: helveticaBold, color: colorGray });
    currentY -= 20;
    page.drawText(data.customerName.toUpperCase(), { x: ticketX + 20, y: currentY, size: 16, font: helveticaBold, color: colorWhite });

    currentY -= 20;
    page.drawLine({ start: { x: ticketX + 20, y: currentY }, end: { x: ticketX + ticketW - 20, y: currentY }, thickness: 1, color: colorGray, ...dashOptions });

    // FECHA / PUERTAS
    currentY -= 25;
    page.drawText("FECHA", { x: ticketX + 20, y: currentY, size: 9, font: helveticaBold, color: colorGray });
    page.drawText("PUERTAS", { x: ticketX + 200, y: currentY, size: 9, font: helveticaBold, color: colorGray });
    currentY -= 15;
    page.drawText(data.eventDate.toUpperCase(), { x: ticketX + 20, y: currentY, size: 12, font: helveticaBold, color: colorWhite });
    page.drawText(data.eventDoorsOpen, { x: ticketX + 200, y: currentY, size: 12, font: helveticaBold, color: colorWhite });

    // LUGAR
    currentY -= 25;
    page.drawText("LUGAR", { x: ticketX + 20, y: currentY, size: 9, font: helveticaBold, color: colorGray });
    currentY -= 15;
    page.drawText(data.eventLocation.toUpperCase(), { x: ticketX + 20, y: currentY, size: 12, font: helveticaBold, color: colorWhite });

    // PESAJE
    if (data.weighInDate) {
      currentY -= 20;
      page.drawLine({ start: { x: ticketX + 20, y: currentY }, end: { x: ticketX + ticketW - 20, y: currentY }, thickness: 1, color: colorGray, ...dashOptions });
      currentY -= 20;
      page.drawText(`PESAJE ${data.weighInIsFree ? "(ENTRADA LIBRE)" : ""}`, { x: ticketX + 20, y: currentY, size: 11, font: helveticaBold, color: colorNeonYellow });
      currentY -= 20;
      page.drawText("FECHA", { x: ticketX + 20, y: currentY, size: 8, font: helveticaBold, color: colorGray });
      page.drawText("PUERTAS", { x: ticketX + 200, y: currentY, size: 8, font: helveticaBold, color: colorGray });
      currentY -= 12;
      page.drawText(data.weighInDate.toUpperCase(), { x: ticketX + 20, y: currentY, size: 10, font: helveticaBold, color: colorWhite });
      page.drawText(data.weighInDoors || "11:00 AM", { x: ticketX + 200, y: currentY, size: 10, font: helveticaBold, color: colorWhite });
    }

    // FOOTER
    page.drawText("Entrada personal e intransferible. Prohibida la reventa.", {
      x: ticketX + 20,
      y: ticketY + 15,
      size: 7,
      font: helveticaFont,
      color: colorGray,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
