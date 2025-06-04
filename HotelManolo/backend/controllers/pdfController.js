import { error } from "console";
import { callFlaskOCR } from "../utils/callFlaskOCR";
import path from "path";

export const processPdf = async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const albaran = await callFlaskOCR(pdfPath);
    return res.status(200).json({ albaran });
  } catch (err) {
    console.error("Error procesando PDF", err);
    return res.status(500).json({ error: "Fallo al procesar el PDF" });
  }
};
