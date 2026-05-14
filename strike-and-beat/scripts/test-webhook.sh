#!/bin/bash
# Script para probar Webhooks de Stripe en Test Mode (Linux / Mac / Git Bash)

echo "[ACTIVO] Iniciando escucha de webhooks de Stripe en entorno local..."
echo "Asegúrate de haber iniciado sesión con 'stripe login' previamente."

# Redirige los eventos a nuestro endpoint local de Next.js
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Para disparar el evento (ejecutar en otra terminal):
# stripe trigger checkout.session.completed
