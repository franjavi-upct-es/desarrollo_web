# ---------- Base: Build React frontend ----------
FROM node:18 AS frontend

WORKDIR /app
COPY ../frontend/package*.json ./
RUN npm install
COPY ../frontend ./
RUN npm run build

# ---------- Base: Backend with Python + OCR ----------
FROM python:3.10-slim AS backend

# Install system dependencies (Tesseract, Poppler, Pillow dependencies)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Copy React build output into Flask static folder
COPY --from=frontend /app/build ./build

# Expose Flask port
EXPOSE 5000

# Start Flask
CMD ["python", "flask_ocr_service.py"]
