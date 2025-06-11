import logging
import os
import re
from datetime import datetime
from pathlib import Path

import pytesseract
from dotenv import load_dotenv
from flask import Flask, jsonify, request, session
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

UPLOAD_FOLER = "uploads"
os.makedirs(UPLOAD_FOLER, exist_ok=True)

# Conexión a MongoDB usando la URI
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.get_default_database()
albaranes = db["albaranes"]

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
    if "pdf" not in request.files:
        return jsonify({"error", "PDF no recibido"}), 400

    pdf_file = request.files["pdf"]
    filename = secure_filename(pdf_file.filename)
    pdf_path = Path(UPLOAD_FOLER) / filename
    pdf_file.save(pdf_path)

    try:
        text = extract_text_from_pdf(pdf_path)
        albaran_id = extract_info(text)
        if not albaran_id:
            return jsonify({"error": "No se encontró el ID del albarán"}), 404

        record = {
            "albaranID": albaran_id,
            "filename": filename,
            "timestamp": datetime.utcnow(),
        }
        albaranes.insert_one(record)
        return jsonify(record)
    except Exception as e:
        logging.exception("ORCR error")
        return jsonify({"error": str(e)}), 500


@app.route("/albaranes", methods=["GET"])
@auth_required
def get_albaranes():
    return jsonify(list(albaranes.find({}, {"_id": 0})))


def extract_text_from_pdf(pdf_path):
    images = convert_from_path(str(pdf_path), dpi=300)
    full_text = ""
    for img in images:
        gray = img.convert("L")
        thresh = gray.point(lambda x: 0 if x < 128 else 255, "1")
        full_text += pytesseract.image_to_string(thresh, config="--psm 6")
    return full_text


def extract_info(text):
    current_year = datetime.now().year % 100
    pattern = rf"\b(?:[A-Z]{current_year}\d{{5}}|AA{current_year}\d{{4}})\b"
    m = re.search(pattern, text)
    return m.group() if m else None


if __name__ == "__main__":
    app.run(port=5001, debug=True)
