import Stripe from 'stripe';

// Inicialización "Lazy" o con fallback para que no rompa la compilación
// en entornos donde la variable no existe en tiempo de build (como Vercel build).
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
    console.warn("FALTA STRIPE_SECRET_KEY EN PRODUCCIÓN");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
    // Usamos una versión compatible con el entorno actual
    apiVersion: '2026-04-22.dahlia' as any,
    typescript: true,
  });
};

export const stripe = getStripe();
