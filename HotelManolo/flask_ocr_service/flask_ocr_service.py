from datetime import datetime
import logging
import os
from pathlib import Path
import re

from PIL import Image

from flask import Flask, jsonify, request
from numpy import log
from pdf2image import convert_from_path
import pytesseract
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# logging
logging.basicConfig(level=logging.INFO)


@app.route("/extract-albaran", methods=["POST"])
def extract_albaran():
    if "pdf" not in request.files:
        return jsonify({"error": "No se recibió el archivo PDF"}), 400

    pdf_file = request.files["pdf"]
    filename = secure_filename(pdf_file.filename)
    pdf_path = Path(UPLOAD_FOLDER) / filename
    pdf_file.save(pdf_path)

    try:
        text = extract_text_from_pdf(pdf_path)
        albaran = extract_info(text)
        if not albaran:
            return jsonify({"error": "Albarán no encontrado"}), 404
        return jsonify({"albaran": albaran})
    except Exception as e:
        logging.exception("Error al procesar PDF")
        return jsonify({"error": str(e)}), 500


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
    current_year = datetime.now().year % 100
    pattern = rf"\b(?:[A-Z]{current_year}\d{{5}}|AA{current_year}\d{{4}})\b"
    match = re.search(pattern, text)
    return match.group() if match else None


if __name__ == "__main__":
    app.run(port=5001, debug=True)
