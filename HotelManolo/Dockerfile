# ---------- 1. Build React frontend ----------
FROM node:18 AS frontend

WORKDIR /app
COPY ./frontend/package*.json ./frontend/
COPY ./frontend/ ./frontend/
RUN cd frontend && npm install && npm run build


# ---------- 2. Flask backend + copy React build ----------
FROM python:3.10-slim AS backend

# Install OCR & image tools
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Python dependencies
COPY backend/requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy built frontend from previous stage
COPY --from=frontend /app/frontend/build ./build

# Set environment variables
ENV PORT=5001
ENV FLASK_ENV=production

# Expose the port
EXPOSE 5001

# Start the app with Gunicorn
CMD ["gunicorn", "flask_ocr_service:app", "--bind", "0.0.0.0:5001"]
