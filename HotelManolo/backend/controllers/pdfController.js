import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";
import Albaran from "../models/Albaran.js";
import { error } from "console";

export const processPdfs = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ningún PDF" });
    }

    const pdfPath = req.file.path;

    // Llamar al microservicio Flask OCR 
    const form = new FormData();
    form.append('pdf', fs.createReadStream(pdfPath))

    const ocrRes = await axios.post(
      process.env.OCR_SERVICE_URL || "http://localhost:5001/extract-albaran",
      form,
      { headers: form.getHeaders() }
    );

    const albaran = ocrRes.data.albaran;
    if (!albaran) {
      fs.unlinkSync(pdfPath);
      return res.status(200).json({ error: "No se encontró de albarán" });
    }

    // Guardar en MongoDB 
    const nuevo = new Albaran({
      nombreArchivo: req.file.filename,
      albaran,
      usuario: req.user._id,
    });
    await nuevo.save();

    // Eliminar PDF tras procesar
    fs.unlinkSync(pdfPath);

    return res.status(200).json({ albaran })
  } catch (error) {
    console.error("Error en processPdf:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ error: "Error interno al procesar PDF" });
  }
};

export const listLastPDFs = async (req, res) => {
  try {
    const registros = await Albaran.find({ usuario: req.user._id })
      .sort({ fechaSubida: -1 })
      .limit(10)
      .select("nombreArchivo albaran fechaSubida -_id");

    const resultado = registros.map((item) => ({
      nombre: item.nombreArchivo,
      albarn: item.albaran,
      fecha: item.fechaSubida.toISOString().split("T")[0],
      url: `${process.env.API_BASE_URL || "http://localhost:5000"}/uploads/${item.nombreArchivo}`,
    }));

    return res.status(200).json(resultado);
  } catch (err) {
    console.error("Error en listLastPDFs", err);
    return res.status(500).json({ error: "Error al listar archivos" });
  }
};
