# Dockerfile
FROM python:3.10-slim

# Install OCR dependencies
RUN apt-get update && apt-get install -y \
    poppler-utils tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Create working dir
WORKDIR /app

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt 

# Copy all backend files and frontend build 
COPY . .

# Expose Flask port
EXPOSE 5000

CMD ["python", "flask_ocr_service.py"]
