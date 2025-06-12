import logging
import os
import re
from datetime import datetime
from pathlib import Path

import pytesseract
from dotenv import load_dotenv
from flask import Flask, jsonify, request, session, send_from_directory
from flask_cors import CORS
from pdf2image import convert_from_path
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

# Carga .env
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# Carpeta para almacenar PDFs
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Conexión a MongoDB usando la URI
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.get_default_database()
albaranes_coll = db["albaranes"]

# Lista fija de usuarios autorizados
USUARIOS = {
    "26649110E": generate_password_hash("05032004FranciscoJavier"),
}

logging.basicConfig(level=logging.INFO)

def auth_required(f):
    from functools import wraps

    @wraps(f)
    def wrapper(*args, **kwargs):
        if "user" not in session:
            return jsonify({"error": "No autorizado"}), 401
        return f(*args, **kwargs)

    return wrapper

# Servir PDFs cargados para vista previa
@app.route("/uploads/<path:filename>")
@auth_required
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = data.get("username")
    pwd = data.get("password")
    if user in USUARIOS and check_password_hash(USUARIOS[user], pwd):
        session["user"] = user
        return jsonify({"msg": "Login exitoso"})
    return jsonify({"error": "Credenciales incorrectas"}), 403

@app.route("/extract-albaran", methods=["POST"])
@auth_required
def extract_albaran():
    archivos = request.files.getlist("pdf")
    if not archivos:
        return jsonify({"error": "No se recibieron PDFs"}), 400

    resultados = []
    for f in archivos:
        filename = secure_filename(f.filename)
        pdf_path = Path(UPLOAD_FOLDER) / filename
        f.save(pdf_path)

        try:
            # Extraer texto via OCR
            text = extract_text_from_pdf(pdf_path)
            # Extraer ID de albarán (año actual - 1 para pruebas)
            current_year = datetime.now().year % 100 - 1
            pattern = rf"\b(?:[A-Z]{{{current_year}}}\d{{5}}|AA{current_year}\d{{4}})\b"
            match = re.search(pattern, text)
            albaranId = match.group() if match else None

            if not albaranId:
                resultados.append({"filename": filename, "error": "ID no encontrado"})
                continue

            rec = {
                "albaranId": albaranId,
                "filename": filename,
                "timestamp": datetime.utcnow(),
            }
            res = albaranes_coll.insert_one(rec)
            resultados.append({
                "id": str(res.inserted_id),
                "albaranId": rec["albaranId"],
                "filename": rec["filename"],
                "timestamp": rec["timestamp"].isoformat(),
            })
        except Exception as e:
            logging.exception("OCR error")
            resultados.append({"filename": filename, "error": str(e)})

    return jsonify(resultados)

@app.route("/albaranes", methods=["GET"])
@auth_required
def get_albaranes():
    return jsonify(list(albaranes_coll.find({}, {"_id": 0})))


def extract_text_from_pdf(pdf_path):
    """
    Convierte un PDF a imágenes y extrae texto con OCR
    """
    images = convert_from_path(str(pdf_path), dpi=300)
    full_text = ""
    for img in images:
        gray = img.convert("L")
        thresholded = gray.point(lambda x: 0 if x < 128 else 255, "1")
        page_text = pytesseract.image_to_string(thresholded, config="--psm 6")
        full_text += page_text
    return full_text


def extract_info(text):
    """
    Extrae el número de albarán del texto OCR.
    """
    current_year = datetime.now().year % 100
    pattern = rf"\b(?:[A-Z]{{{current_year}}}\d{{5}}|AA{current_year}\d{{4}})\b"
    m = re.search(pattern, text)
    return m.group() if m else None

if __name__ == "__main__":
    app.run(port=5001, debug=True)
