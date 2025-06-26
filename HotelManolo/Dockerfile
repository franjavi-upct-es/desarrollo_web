# Etapa 1: Build del frontend
FROM node:18 as frontend

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Etapa 2: Backend + frontend
FROM node:18

WORKDIR /app

# Instalar backend deps
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copiar código backend y build del frontend
COPY backend ./backend
COPY --from=frontend /app/frontend/build ./backend/frontend_build

WORKDIR /app/backend

ENV PORT=5002
EXPOSE 5002

# ⬇️ Aquí estaba el error
CMD ["node", "ocr_service.js"]