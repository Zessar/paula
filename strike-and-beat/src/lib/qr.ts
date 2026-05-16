/**
 * Utilidades para generación de códigos QR seguros.
 * 
 * El código QR contiene un token único (UUID v4 + prefijo secreto)
 * que hace imposible adivinar el algoritmo por fuerza bruta.
 */

import { randomUUID } from "node:crypto";
import QRCode from "qrcode";

// Prefijo secreto interno que se añade al UUID para mayor seguridad
const QR_SECRET_PREFIX = "SB_TKT_";

/**
 * Genera un código QR único e impredecible.
 * Formato: SB_TKT_{uuid-v4}
 * Esto hace que cada código sea:
 *   - Único (UUID v4 = 2^122 combinaciones posibles)
 *   - No secuencial (imposible adivinar el siguiente)
 *   - Verificable (el prefijo confirma que es nuestro)
 */
export function generateQRCode(): string {
  return `${QR_SECRET_PREFIX}${randomUUID()}`;
}

/**
 * Genera la imagen del QR como Data URL (base64) para incrustar en HTML/emails.
 */
export async function generateQRDataURL(qrCode: string): Promise<string> {
  return QRCode.toDataURL(qrCode, {
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H", // Alta corrección de errores para escaneo fiable
  });
}

/**
 * Genera el QR como SVG string (útil para renderizado en servidor).
 */
export async function generateQRSVG(qrCode: string): Promise<string> {
  return QRCode.toString(qrCode, {
    type: "svg",
    width: 300,
    margin: 2,
    errorCorrectionLevel: "H",
  });
}

/**
 * Valida que un código QR tenga el formato correcto.
 */
export function isValidQRFormat(code: string): boolean {
  return code.startsWith(QR_SECRET_PREFIX) && code.length > QR_SECRET_PREFIX.length + 10;
}
