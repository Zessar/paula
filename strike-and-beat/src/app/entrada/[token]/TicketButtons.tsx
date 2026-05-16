"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useState } from "react";

export default function TicketButtons({ eventTitle }: { eventTitle: string }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      const element = document.getElementById("ticket-element");
      if (!element) return;

      // Renderizar el elemento HTML a un Canvas
      // scale: 3 mejora la resolución del PDF resultante
      const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true,
        backgroundColor: "#0a0a0a" 
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Calcular dimensiones para no deformar. Ancho fijo a 75mm
      const imgWidth = 75; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [imgWidth, imgHeight]
      });

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Entrada_${eventTitle.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Hubo un problema generando el PDF. Intenta desde el ordenador.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `Entrada ${eventTitle}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Enlace copiado al portapapeles");
      });
    }
  };

  return (
    <div className="save-bar no-print">
      <button 
        className="save-btn" 
        onClick={handleDownloadPDF}
        disabled={isGenerating}
      >
        {isGenerating ? "GENERANDO..." : "DESCARGAR PDF"}
      </button>
      <button className="save-btn secondary" onClick={handleShare}>
        COMPARTIR
      </button>
    </div>
  );
}
