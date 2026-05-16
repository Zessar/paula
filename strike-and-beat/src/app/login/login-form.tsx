"use client";

import { useState } from "react";
import { loginWithOTP, verifyOTP } from "./actions";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError("");
    
    const res = await loginWithOTP(email);
    
    if (res.success) {
      setStep("otp");
    } else {
      setError(res.error || "Error al enviar el código");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || token.length < 6) return;
    
    setLoading(true);
    setError("");
    
    const res = await verifyOTP(email, token);
    
    if (res.success) {
      router.push("/admin");
    } else {
      setError(res.error || "Código inválido");
      setToken("");
    }
    setLoading(false);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header decorativo */}
      <div style={{ borderBottom: '4px solid var(--color-primary)', marginBottom: '24px', paddingBottom: '8px' }}>
        <p style={{ 
          fontFamily: 'var(--font-label-bold, monospace)', 
          fontSize: '10px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.3em', 
          color: 'var(--color-on-surface-variant)' 
        }}>
          Sistema de Gestión
        </p>
      </div>

      <h1 style={{ 
        fontFamily: 'var(--font-headline-lg), "Bebas Neue", sans-serif', 
        fontSize: 'clamp(64px, 12vw, 96px)', 
        textTransform: 'uppercase', 
        color: 'white', 
        lineHeight: '0.9', 
        marginBottom: '16px',
        fontWeight: 'normal',
        letterSpacing: '0.02em'
      }}>
        Área<br />
        <span style={{ color: 'var(--color-primary)' }}>Restringida</span>
      </h1>
      <p style={{ 
        fontSize: '16px', 
        color: 'var(--color-on-surface-variant)', 
        marginBottom: '48px',
        maxWidth: '400px',
        lineHeight: '1.5'
      }}>
        {step === "email" 
          ? "Introduce tu email autorizado para recibir un código de seguridad."
          : "Introduce el código de 6 dígitos que hemos enviado a tu correo."}
      </p>

      {error && (
        <div style={{ 
          background: 'rgba(220,38,38,0.1)', 
          borderLeft: '4px solid #dc2626', 
          padding: '16px', 
          marginBottom: '24px' 
        }}>
          <p style={{ color: '#dc2626', fontSize: '12px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{error}</p>
        </div>
      )}

      <div style={{ 
        background: 'var(--color-surface-container-high)', 
        border: '2px solid var(--color-outline-variant)', 
        padding: '32px' 
      }}>
        {step === "email" ? (
          <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ 
                fontSize: '10px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.15em', 
                color: 'var(--color-on-surface-variant)',
                fontWeight: 700 
              }}>
                Email Autorizado
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoFocus
                style={{ 
                  width: '100%', 
                  background: 'var(--color-surface)', 
                  border: '2px solid var(--color-outline-variant)', 
                  color: 'white', 
                  padding: '14px 16px', 
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', 
                background: 'var(--color-primary)', 
                color: 'var(--color-surface)', 
                border: '2px solid var(--color-primary)',
                padding: '16px', 
                fontSize: '16px', 
                fontWeight: 900, 
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.6 : 1,
                marginTop: '8px',
              }}
            >
              {loading ? "Enviando..." : "Solicitar Código de Acceso"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ 
              background: 'var(--color-surface)', 
              padding: '16px', 
              border: '1px solid var(--color-outline-variant)',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
                Código enviado a<br />
                <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '15px' }}>{email}</span>
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ 
                fontSize: '10px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.15em', 
                color: 'var(--color-on-surface-variant)',
                fontWeight: 700,
                textAlign: 'center',
              }}>
                Código de 6 dígitos
              </label>
              <input 
                type="text" 
                inputMode="numeric"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                maxLength={8}
                required
                autoFocus
                style={{ 
                  width: '100%', 
                  background: 'var(--color-surface)', 
                  border: '2px solid var(--color-outline-variant)', 
                  color: 'white', 
                  padding: '18px 16px', 
                  fontSize: '40px',
                  fontWeight: 900,
                  textAlign: 'center',
                  letterSpacing: '0.4em',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-headline-lg), monospace',
                }}
              />
            </div>
            <button 
              type="submit"
              disabled={loading || (token.length < 6)}
              style={{ 
                width: '100%', 
                background: 'var(--color-primary)', 
                color: 'var(--color-surface)', 
                border: '2px solid var(--color-primary)',
                padding: '16px', 
                fontSize: '16px', 
                fontWeight: 900, 
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: (loading || token.length < 6) ? 'not-allowed' : 'pointer',
                opacity: (loading || token.length < 6) ? 0.5 : 1,
                marginTop: '8px',
              }}
            >
              {loading ? "Verificando..." : "Entrar al Sistema"}
            </button>
            <button 
              type="button" 
              onClick={() => { setStep("email"); setToken(""); setError(""); }}
              style={{ 
                width: '100%', 
                background: 'none', 
                border: 'none', 
                color: 'var(--color-on-surface-variant)', 
                fontSize: '10px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.15em',
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              Usar otro correo
            </button>
          </form>
        )}
      </div>

      {/* Footer de seguridad */}
      <div style={{ 
        marginTop: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        justifyContent: 'center', 
        opacity: 0.4 
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-on-surface-variant)' }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-on-surface-variant)' }}>
          Conexión cifrada de extremo a extremo
        </p>
      </div>
    </div>
  );
}
