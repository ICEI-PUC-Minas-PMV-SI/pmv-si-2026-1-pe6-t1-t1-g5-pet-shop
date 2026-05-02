#!/bin/bash

# Pet Flow — Inicia backend e frontend simultaneamente

cleanup() {
  echo ""
  echo "Encerrando..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM

DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🐾 Pet Flow — Iniciando..."
echo ""

# Backend (porta 3000)
echo "▶ Backend (http://localhost:3000)"
cd "$DIR/pet_flow_backend" && npm run dev &
BACKEND_PID=$!

# Frontend (porta 5173)
echo "▶ Frontend (http://localhost:5173)"
cd "$DIR/pet_flow_frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✔ Backend  → http://localhost:3000/api/v1"
echo "✔ Frontend → http://localhost:5173"
echo ""
echo "Pressione Ctrl+C para encerrar ambos."

wait
