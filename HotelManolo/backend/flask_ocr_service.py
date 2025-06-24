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

# Genera una nueva clave secreta para cada inicio:
app.secret_key = os.urandom(24)

app.secret_key = os.getenv("FLASK_SECRET_KEY")
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# Carpeta de uploads
UPLOAD_FOLER = "uploads"
os.makedirs(UPLOAD_FOLER, exist_ok=True)

# MongoDB
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.get_default_database()
albaranes = db["albaranes"]

# Usuarios autorizados
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
        pdf_path = Path(UPLOAD_FOLER) / filename
        f.save(pdf_path)

        try:
            text = extract_text_from_pdf(pdf_path)
            albaran_id = extract_info(text)
            if not albaran_id:
                resultados.append({"filename": filename, "error": "ID no encontrado"})
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


@app.route("/albaranes", methods=["GET"])
@auth_required
def get_albaranes():
    docs = list(
        albaranes.find({}, {"_id": 1, "albaranId": 1, "filename": 1, "timestamp": 1})
    )
    result = []
    for doc in docs:
        result.append(
            {
                "id": str(doc["_id"]),
                "albaranId": doc["albaranId"],
                "filename": doc["filename"],
                "timestamp": doc["timestamp"].isoformat(),
            }
        )
    return jsonify(result)


@app.route("/albaranes/<string:albaran_id>", methods=["DELETE"])
@auth_required
def delete_albaran(albaran_id):
    from bson import ObjectId

    logging.info(f"📌 DELETE request for albaran_id={albaran_id!r}")

    # Show all IDs currently in the collection
    all_ids = [str(d["_id"]) for d in albaranes.find({}, {"_id": 1})]
    logging.info(f"🔍 Existing IDs in DB: {all_ids}")

    try:
        oid = ObjectId(albaran_id)
    except Exception:
        logging.warning(f"❌ Invalid ObjectId: {albaran_id!r}")
        return jsonify({"error": "ID inválido"}), 400

    doc = albaranes.find_one({"_id": oid})
    if not doc:
        logging.warning(f"⚠️ No document found for _id={albaran_id!r}")
        return jsonify({"error": "No encontrado"}), 404

    # Delete from Mongo + disk
    albaranes.delete_one({"_id": oid})
    file_path = Path(UPLOAD_FOLER) / doc["filename"]
    if file_path.exists():
        file_path.unlink()

    logging.info(f"✅ Deleted albaran_id={albaran_id!r}")
    return jsonify({"msg": "Eliminado correctamente"})


@app.route("/uploads/<path:filename>")
@auth_required
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLER, filename)


@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    return jsonify({"msg": "Logout exitoso"})


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    build_dir = os.path.join(os.getcwd(), "frontend", "build")
    file_path = os.path.join(build_dir, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(build_dir, path)
    else:
        return send_from_directory(build_dir, "index.html")


def extract_text_from_pdf(pdf_path):
    images = convert_from_path(str(pdf_path), dpi=300)
    full_text = ""
    for img in images:
        gray = img.convert("L")
        thresholded = gray.point(lambda x: 0 if x < 128 else 255, "1")
        page_text = pytesseract.image_to_string(thresholded, config="--psm 6")
        full_text += page_text
    return full_text


def extract_info(text):
    # Mantener lógica de current_year = año de test - 1 si lo necesita
    current_year = datetime.now().year % 100 - 1
    pattern = rf"\b(?:[A-Z]{{{1}}}{current_year}\d{{5}}|AA{current_year}\d{{4}})\b"
    match = re.search(pattern, text)
    return match.group() if match else None


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
