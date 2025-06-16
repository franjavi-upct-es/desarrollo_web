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

# Load environment variables
load_dotenv()

# Use build/ for static files
app = Flask(__name__, static_folder="build", static_url_path="/")

# Secret key for session
app.secret_key = os.getenv("FLASK_SECRET_KEY", os.urandom(24))
CORS(
    app, supports_credentials=True, origins=["*"]
)  # Public frontend now served from same host

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Mongo connection
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/albaranesdb")
client = MongoClient(mongo_uri)
db = client.get_default_database()
albaranes = db["albaranes"]

USUARIOS = {
    "26649110E": generate_password_hash("admin"),
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


# ------------------------
# API Routes (all prefixed with /api)
# ------------------------


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    user = data.get("username")
    pwd = data.get("password")
    if user in USUARIOS and check_password_hash(USUARIOS[user], pwd):
        session["user"] = user
        return jsonify({"msg": "Login exitoso"})
    return jsonify({"error": "Credenciales incorrectas"}), 403


@app.route("/api/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    return jsonify({"msg": "Logout exitoso"})


@app.route("/api/extract-albaran", methods=["POST"])
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
            text = extract_text_from_pdf(pdf_path)
            albaran_id = extract_info(text)
            if not albaran_id:
                resultados.append(
                    {"filename": filename, "error": "ID no encontrado"})
                continue

            rec = {
                "albaranId": albaran_id,
                "filename": filename,
                "timestamp": datetime.utcnow(),
            }
            res = albaranes.insert_one(rec)
            resultados.append(
                {
                    "id": str(res.inserted_id),
                    "albaranId": rec["albaranId"],
                    "filename": rec["filename"],
                    "timestamp": rec["timestamp"].isoformat(),
                }
            )
        except Exception as e:
            logging.exception("OCR error")
            resultados.append({"filename": filename, "error": str(e)})

    return jsonify(resultados)


@app.route("/api/albaranes", methods=["GET"])
@auth_required
def get_albaranes():
    docs = list(
        albaranes.find({}, {"_id": 1, "albaranId": 1,
                       "filename": 1, "timestamp": 1})
    )
    return jsonify(
        [
            {
                "id": str(d["_id"]),
                "albaranId": d["albaranId"],
                "filename": d["filename"],
                "timestamp": d["timestamp"].isoformat(),
            }
            for d in docs
        ]
    )


@app.route("/api/albaranes/<string:albaran_id>", methods=["DELETE"])
@auth_required
def delete_albaran(albaran_id):
    from bson import ObjectId

    try:
        oid = ObjectId(albaran_id)
    except:
        return jsonify({"error": "ID inválido"}), 400

    doc = albaranes.find_one({"_id": oid})
    if not doc:
        return jsonify({"error": "No encontrado"}), 404

    albaranes.delete_one({"_id": oid})
    file_path = Path(UPLOAD_FOLDER) / doc["filename"]
    if file_path.exists():
        file_path.unlink()

    return jsonify({"msg": "Eliminado correctamente"})


@app.route("/uploads/<path:filename>")
@auth_required
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# ------------------------
# Fallback route for React
# ------------------------


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    target = Path(app.static_folder) / path
    if target.exists():
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


def extract_text_from_pdf(pdf_path):
    images = convert_from_path(str(pdf_path), dpi=300)
    full_text = ""
    for img in images:
        gray = img.convert("L")
        binary = gray.point(lambda x: 0 if x < 128 else 255, "1")
        full_text += pytesseract.image_to_string(binary, config="--psm 6")
    return full_text


def extract_info(text):
    current_year = datetime.now().year % 100 - 1
    pattern = rf"\b(?:[A-Z]{1}{current_year}\d{{5}}|AA{current_year}\d{{4}})\b"
    match = re.search(pattern, text)
    return match.group() if match else None


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
