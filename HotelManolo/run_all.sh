#!/usr/bin/env bash

################################################################################
# run_all.sh
#
# Script para arrancar automáticamente:
#   1) El microservicio Flask‐OCR (Python + venv)
#   2) El backend (Node/Express)
#   3) El frontend (Vite/React)
#
# Si faltan paquetes (python3, pip3, pdftoppm, tesseract, node, npm), 
# los agrupa en una lista y ofrece instalarlos automáticamente:
#   - En Debian/Ubuntu: usará apt-get
#   - En macOS: usará brew (si brew está instalado)
#
# Finalmente abre una nueva pestaña en el navegador predeterminado
# y, cuando el usuario pulse ENTER, detiene todos los procesos lanzados.
#
# USO:
#   $ chmod +x run_all.sh
#   $ ./run_all.sh
#
# REQUISITOS MÍNIMOS:
#   - sudo (para instalación automática en apt-get)
#   - si es macOS, brew (para instalación automática)
################################################################################

set -e

# ------------------------------------------------------------------
# Función para detener todos los procesos hijos
# ------------------------------------------------------------------
cleanup() {
  echo
  echo "🛑 Deteniendo todos los servicios..."
  [ -n "$FLASK_PID" ] && kill "$FLASK_PID" 2>/dev/null || true
  [ -n "$BACK_PID"  ] && kill "$BACK_PID"  2>/dev/null || true
  [ -n "$FRONT_PID" ] && kill "$FRONT_PID" 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

# ------------------------------------------------------------------
# 1. Detectar sistema operativo y gestor de paquetes
# ------------------------------------------------------------------
OS_TYPE="$(uname)"
USE_APT=false
USE_BREW=false

if [[ "$OS_TYPE" == "Linux" ]]; then
  if command -v apt-get >/dev/null 2>&1; then
    USE_APT=true
  fi
elif [[ "$OS_TYPE" == "Darwin" ]]; then
  if command -v brew >/dev/null 2>&1; then
    USE_BREW=true
  fi
fi

# ------------------------------------------------------------------
# 2. Comprobar dependencias básicas y recopilarlas en una lista
# ------------------------------------------------------------------
echo "🔍 Comprobando dependencias..."

MISSING_PACKAGES=()

# Función auxiliar para chequear y agregar
check_or_add() {
  local cmd="$1"
  local pkg_name="$2"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    MISSING_PACKAGES+=("$pkg_name")
  fi
}

# Chequear cada comando y su posible paquete
check_or_add python3    "python3"
check_or_add pip3       "python3-pip"
check_or_add pdftoppm   "poppler-utils"
check_or_add tesseract  "tesseract-ocr"
check_or_add node       "nodejs"
check_or_add npm        "npm"

if [ ${#MISSING_PACKAGES[@]} -ne 0 ]; then
  echo
  echo "❌ Se han detectado dependencias faltantes:"
  for pkg in "${MISSING_PACKAGES[@]}"; do
    echo "   • $pkg"
  done

  # Ofrecer instalación automática si se puede
  if $USE_APT; then
    echo
    echo "¿Deseas instalarlas ahora con apt-get? [Y/n]"
    read -r RESP
    RESP="${RESP:-Y}"
    if [[ "$RESP" =~ ^[Yy]$ ]]; then
      echo "🔧 Instalando con apt-get: sudo apt-get update && sudo apt-get install -y ${MISSING_PACKAGES[*]}"
      sudo apt-get update
      sudo apt-get install -y "${MISSING_PACKAGES[@]}"
      echo "✅ Dependencias instaladas."
    else
      echo "⚠️  Cancelo instalación. Procede a instalarlas manualmente y vuelve a ejecutar."
      exit 1
    fi
  elif $USE_BREW; then
    echo
    echo "¿Deseas instalarlas ahora con brew? [Y/n]"
    read -r RESP
    RESP="${RESP:-Y}"
    if [[ "$RESP" =~ ^[Yy]$ ]]; then
      echo "🔧 Instalando con brew: brew install ${MISSING_PACKAGES[*]}"
      brew install "${MISSING_PACKAGES[@]}"
      echo "✅ Dependencias instaladas."
    else
      echo "⚠️  Cancelo instalación. Procede a instalarlas manualmente (ej. brew install ...) y vuelve a ejecutar."
      exit 1
    fi
  else
    echo
    echo "⚠️  No se detectó apt-get ni brew. Instala manualmente las siguientes dependencias y vuelve a ejecutar:"
    echo "   › ${MISSING_PACKAGES[*]}"
    exit 1
  fi
else
  echo "✅ Todas las dependencias están presentes."
fi

echo

# ------------------------------------------------------------------
# 3. Arrancar Flask‐OCR
# ------------------------------------------------------------------
echo "=========================================="
echo "1) Levantando el microservicio Flask‐OCR"
echo "=========================================="

pushd flask_ocr_service >/dev/null

if [ ! -d "flask_ocr" ]; then
  echo "⚙️  Creando entorno virtual (venv) e instalando dependencias..."
  python3 -m venv flask_ocr
  source flask_ocr/bin/activate
  pip install --upgrade pip
  pip install -r requirements.txt
  deactivate
fi

source flask_ocr/bin/activate
python flask_ocr_service.py >/dev/null 2>&1 &
FLASK_PID=$!
echo "    → Flask‐OCR iniciado (PID ${FLASK_PID})"
deactivate

popd >/dev/null
echo

# ------------------------------------------------------------------
# 4. Arrancar Backend (Node/Express)
# ------------------------------------------------------------------
echo "=========================================="
echo "2) Levantando el backend (Node/Express)"
echo "=========================================="

pushd backend >/dev/null

if [ ! -d "node_modules" ]; then
  echo "⚙️  Instalando dependencias de backend..."
  npm install
fi

npm run dev >/dev/null 2>&1 &
BACK_PID=$!
echo "    → Backend iniciado (PID ${BACK_PID})"

popd >/dev/null
echo

# ------------------------------------------------------------------
# 5. Arrancar Frontend (Vite/React)
# ------------------------------------------------------------------
echo "=========================================="
echo "3) Levantando el frontend (Vite/React)"
echo "=========================================="

pushd frontend/hotel-manolo >/dev/null

if [ ! -d "node_modules" ]; then
  echo "⚙️  Instalando dependencias de frontend..."
  npm install
fi

npm run dev >/dev/null 2>&1 &
FRONT_PID=$!
echo "    → Frontend iniciado (PID ${FRONT_PID})"

popd >/dev/null
echo

# ------------------------------------------------------------------
# 6. Esperar brevemente y abrir el navegador en una nueva pestaña
# ------------------------------------------------------------------
echo "=========================================="
echo "4) Esperando 5 segundos para que arranquen todos los servicios..."
echo "=========================================="
sleep 5

URL="http://localhost:5173"
echo "🔗 Abriendo nueva pestaña en el navegador predeterminado: ${URL}"

if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1
elif command -v open >/dev/null 2>&1; then
  open "$URL" >/dev/null 2>&1
else
  echo "⚠️  No se pudo abrir el navegador automáticamente."
  echo "   Abre manualmente: $URL"
fi

# ------------------------------------------------------------------
# 7. Esperar a que el usuario pulse ENTER para detener todo
# ------------------------------------------------------------------
echo
echo "-----------------------------------------------------------------"
echo "► Cuando hayas cerrado la pestaña (o quieras detener todo),"
echo "  pulsa ENTER en esta terminal para parar Flask‐OCR, Backend y Frontend."
echo "-----------------------------------------------------------------"

read -r

cleanup

