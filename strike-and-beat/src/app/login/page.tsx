import { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Área Restringida | Strike & Beat",
  description: "Acceso exclusivo para administradores.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden" style={{ padding: '24px' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/30"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/30"></div>
        
        {/* Marca de agua industrial */}
        <div className="absolute -bottom-10 -left-10 text-[20vw] font-black opacity-[0.03] text-white leading-none uppercase select-none font-display italic">
          Secure
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 transform skew-x-[-12deg] translate-x-1/4"></div>
      </div>
      
      <div className="relative z-10 w-full" style={{ maxWidth: '520px' }}>
        <LoginForm />
      </div>
    </div>
  );
}
