# Stage 1: Build frontend
FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# Stage 2: Backend + frontend
FROM node:18-alpine

# Instalamos gm y dependencies necesarias para pdf2pic
RUN apk add --no-cache \
  graphicsmagick \
  ghostscript \
  ttf-freefont \
  libc6-compat \
  bash \
  python3 \
  make \
  g++ \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev \
  libjpeg-turbo-dev \
  pixman-dev \
  libpng-dev \
  musl-dev

WORKDIR /app
COPY backend ./backend
COPY --from=frontend /app/frontend/build ./backend/frontend_build

WORKDIR /app/backend
RUN npm install

EXPOSE 10000
CMD ["node", "ocr_service.js"]
