# ---------- 1. Build React frontend ----------
FROM node:18 AS frontend

# In Dockerfile
COPY ./frontend/package*.json ./frontend/
WORKDIR /app
COPY ./frontend/ ./frontend/
RUN cd frontend && npm install && npm run build


# ---------- 2. Flask backend + copy React build ----------
FROM python:3.10-slim AS backend

# OCR & image tools
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Python deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# App code
COPY backend/ .

# Copy built frontend from previous stage
COPY --from=frontend /app/frontend/dist ./build

EXPOSE 5000
CMD ["python", "flask_ocr_service.py"]
