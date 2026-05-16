"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { validateQRCode, verifyValidatorPin } from "@/app/actions/ticket-entries";

type ScanResult = {
  valid: boolean;
  status: string;
  message: string;
  customerName?: string;
  customerEmail?: string;
  ticketName?: string;
};

export default function ScanPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [validatorName, setValidatorName] = useState("");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [showManual, setShowManual] = useState(false);

  const scannerRef = useRef<any>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  // Autenticación con PIN
  async function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPinError("");
    const result = await verifyValidatorPin(pin);
    if (result.valid) {
      setIsAuthenticated(true);
      setValidatorName(result.validatorName || "Validador");
    } else {
      setPinError(result.message || "PIN inválido");
      setPin("");
    }
  }

  // Procesar un código QR (sea escaneado o manual)
  const processQR = useCallback(async (code: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const result = await validateQRCode(code);
      setLastResult(result);
      if (result.valid) {
        setScanCount((c) => c + 1);
      }

      // Vibrar para dar feedback háptico
      if (navigator.vibrate) {
        navigator.vibrate(result.valid ? [100] : [200, 100, 200]);
      }
    } catch {
      setLastResult({
        valid: false,
        status: "error",
        message: "Error de conexión. Inténtalo de nuevo.",
      });
    } finally {
      // Esperar 2 segundos antes de permitir otro escaneo
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }
  }, [isProcessing]);

  // Iniciar/detener el escáner de cámara
  useEffect(() => {
    async function startScanner() {
      if (!scannerContainerRef.current) return;

      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        // Limpiar instancia previa si existe
        if (scannerRef.current) {
          try {
            if (scannerRef.current.getState() === 2) {
              await scannerRef.current.stop();
            }
            scannerRef.current.clear();
          } catch (e) {}
        }

        const html5QrCode = new Html5Qrcode("qr-reader");
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" }, // Cámara trasera
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText: string) => {
            processQR(decodedText);
          },
          () => {} // Ignorar errores de no-lectura
        );
      } catch (err) {
        console.warn("No se pudo iniciar la cámara:", err);
        setIsScanning(false);
        setShowManual(true); // Si falla la cámara, mostrar modo manual
      }
    }

    if (isScanning && isAuthenticated) {
      startScanner();
    } else {
      // Si se desactiva el escaneo, detener la cámara
      if (scannerRef.current) {
        try {
          if (scannerRef.current.getState() === 2) { // 2 = SCANNING
            scannerRef.current.stop().catch(() => {});
          }
        } catch (e) {}
      }
    }

    return () => {
      // Limpieza al desmontar
      if (scannerRef.current) {
        try {
          if (scannerRef.current.getState() === 2) {
            scannerRef.current.stop().catch(() => {});
          }
        } catch (e) {}
      }
    };
  }, [isScanning, isAuthenticated, processQR]);

  // Manejar envío manual
  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (manualCode.trim()) {
      processQR(manualCode.trim());
      setManualCode("");
    }
  }

  // ==============================
  // PANTALLA DE PIN (No autenticado)
  // ==============================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-md">
        <div className="w-full max-w-[384px] text-center">
          <div className="mb-xl">
            <h1 className="text-display-xl text-neon-yellow uppercase leading-none">
              S&B
            </h1>
            <p className="text-label-bold text-on-surface-variant uppercase tracking-[0.4em] mt-sm">
              Validador de Entradas
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-md">
            <div>
              <label className="text-label-bold text-on-surface-variant uppercase tracking-wider block mb-sm">
                Introduce tu PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-surface-container-highest border-2 border-outline-variant text-on-surface p-md font-mono text-3xl tracking-[0.8em] text-center"
                placeholder="----"
                autoFocus
                required
              />
            </div>

            {pinError && (
              <p className="text-red-400 text-label-bold">{pinError}</p>
            )}

            <button
              type="submit"
              className="w-full py-md bg-neon-yellow text-surface text-headline-md uppercase tracking-wider hover:bg-neon-yellow/90 transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==============================
  // PANTALLA DE ESCANEO (Autenticado)
  // ==============================
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="bg-surface-container-low border-b-2 border-outline-variant px-md py-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-sm">
          <span className="text-headline-md text-neon-yellow">S&B</span>
          <div className="h-4 w-[1px] bg-outline-variant"></div>
          <span className="text-label-bold text-on-surface-variant uppercase tracking-wider">{validatorName}</span>
        </div>
        <div className="flex items-center gap-md">
          <div className="text-right">
            <p className="font-mono text-neon-yellow text-lg leading-none">{scanCount}</p>
            <p className="text-label-bold text-[8px] text-on-surface-variant uppercase tracking-wider">Escaneadas</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-xs border border-outline-variant text-on-surface-variant hover:text-red-400 hover:border-red-400 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-md gap-lg">
        {/* Result Display */}
        {lastResult && (
          <div
            className={`w-full max-w-[384px] p-lg text-center border-4 transition-all duration-300 ${
              lastResult.valid
                ? "bg-green-500/10 border-green-500 text-green-400"
                : lastResult.status === "already_used"
                ? "bg-yellow-500/10 border-yellow-500 text-yellow-400"
                : "bg-red-500/10 border-red-500 text-red-400"
            }`}
          >
            <span
              className="material-symbols-outlined text-[64px] mb-sm block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {lastResult.valid ? "check_circle" : lastResult.status === "already_used" ? "warning" : "cancel"}
            </span>
            <p className="text-headline-md uppercase">{lastResult.message}</p>
            {lastResult.customerName && (
              <p className="text-label-bold mt-sm opacity-80">{lastResult.customerName}</p>
            )}
            {lastResult.ticketName && (
              <p className="text-body-sm mt-xs opacity-60">{lastResult.ticketName}</p>
            )}
          </div>
        )}

        {/* Scanner Area */}
        {isScanning ? (
          <div className="w-full max-w-[384px]">
            <div
              id="qr-reader"
              ref={scannerContainerRef}
              className="w-full border-2 border-outline-variant overflow-hidden bg-black"
            ></div>
            <button
              onClick={() => setIsScanning(false)}
              className="w-full mt-md py-sm border-2 border-red-500 text-red-400 text-label-bold uppercase tracking-wider hover:bg-red-500/10 transition-colors"
            >
              Detener Cámara
            </button>
          </div>
        ) : (
          <div className="w-full max-w-[384px] space-y-md">
            <button
              onClick={() => { setIsScanning(true); setLastResult(null); }}
              className="w-full py-lg bg-neon-yellow text-surface text-headline-md uppercase tracking-wider flex items-center justify-center gap-md hover:bg-neon-yellow/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[28px]">qr_code_scanner</span>
              Iniciar Escaneo
            </button>

            <button
              onClick={() => setShowManual(!showManual)}
              className="w-full py-sm border-2 border-outline-variant text-on-surface-variant text-label-bold uppercase tracking-wider hover:border-on-surface transition-colors"
            >
              {showManual ? "Ocultar" : "Entrada Manual"}
            </button>
          </div>
        )}

        {/* Manual Input */}
        {showManual && !isScanning && (
          <form onSubmit={handleManualSubmit} className="w-full max-w-[384px] space-y-sm">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Pega el código QR aquí..."
              className="w-full bg-surface-container-highest border-2 border-outline-variant text-on-surface p-sm font-mono text-sm"
            />
            <button
              type="submit"
              disabled={isProcessing || !manualCode.trim()}
              className="w-full py-sm bg-primary text-surface text-label-bold uppercase tracking-wider disabled:opacity-50"
            >
              Validar
            </button>
          </form>
        )}

        {isProcessing && (
          <p className="text-label-bold text-on-surface-variant animate-pulse uppercase tracking-wider">
            Procesando...
          </p>
        )}
      </div>
    </div>
  );
}
