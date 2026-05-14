# Script para probar Webhooks de Stripe en Test Mode (Windows PowerShell)

Write-Host "[ACTIVO] Iniciando escucha de webhooks de Stripe en entorno local..." -ForegroundColor Cyan
Write-Host "Asegúrate de haber iniciado sesión con 'stripe login' previamente." -ForegroundColor Yellow

# Redirige los eventos a nuestro endpoint local de Next.js
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# En otra terminal, para disparar el evento de prueba de checkout, puedes usar:
# stripe trigger checkout.session.completed
