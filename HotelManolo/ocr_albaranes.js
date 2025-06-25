const Tesseract = require("tesseract.js");
const { fromPath } = require("pdf2pic");
const path = require("path");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

// Configuración
const WORK_DIR = "/home/pyros05/Descargas/Carpeta Prueba/";

// Utilidad para crear carpetas
function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Año anterior (como en el script Python)
function getPrevYear() {
  return new Date().getFullYear() - 1;
}
function getPrevYearShort() {
  return String(getPrevYear()).slice(-2);
}

// Extrae el número de albarán usando el patrón del script Python
function extractAlbaranNumber(text) {
  const yearShort = getPrevYearShort();
  const regex = new RegExp(`\\b(?:[A-Z]${yearShort}\\d{5}|AA${yearShort}\\d{4})\\b`);
  const match = text.match(regex);
  return match ? match[0] : null;
}

// Cuenta páginas de un PDF
async function getPDFPageCount(pdfPath) {
  const data = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(data);
  return pdfDoc.getPageCount();
}

// Extrae texto de todas las páginas de un PDF usando OCR
async function extractTextFromPDF(pdfPath, outputDir) {
  ensureDirSync(outputDir);
  const convert = fromPath(pdfPath, {
    density: 300,
    saveFilename: "pagina",
    savePath: outputDir,
    format: "png",
    width: 1654, // A4 a 300dpi aprox
    height: 2339,
  });

  const totalPages = await getPDFPageCount(pdfPath);
  let fullText = "";
  let albaranNumber = null;

  for (let i = 1; i <= totalPages; i++) {
    const { name } = await convert(i);
    const imagePath = path.join(outputDir, name);

    const result = await Tesseract.recognize(imagePath, "spa", {
      logger: (m) => process.stdout.write(`Página ${i}: ${m.status}\r`),
    });

    fullText += result.data.text + "\n";
    albaranNumber = extractAlbaranNumber(result.data.text);
    if (albaranNumber) {
      // Si encuentra el número, termina el bucle
      break;
    }
  }
  return { fullText, albaranNumber };
}

// Crea carpetas y mueve el PDF como en el script Python
function movePDF(pdfPath, albaranNumber, baseDir) {
  const year = getPrevYear();
  let serieFolder, folderName;
  if (albaranNumber.startsWith("AA")) {
    serieFolder = path.join(baseDir, "ALBARANES Serie AA");
    folderName = `${year} ${albaranNumber.slice(0, 4)}`;
  } else {
    serieFolder = path.join(baseDir, `ALBARANES Serie ${albaranNumber[0]}`);
    folderName = `${year} ${albaranNumber.slice(0, 3)}`;
  }
  const albaranFolder = path.join(serieFolder, folderName);
  ensureDirSync(albaranFolder);

  const newPath = path.join(albaranFolder, `${albaranNumber}.pdf`);
  if (fs.existsSync(newPath)) {
    console.log(`El archivo ${newPath} ya existe. No se moverá '${path.basename(pdfPath)}'.`);
  } else {
    fs.renameSync(pdfPath, newPath);
    console.log(`Movido '${path.basename(pdfPath)}' a '${newPath}'`);
  }
}

// Procesa todos los PDFs del directorio
async function organizePDFs(directory) {
  const files = fs.readdirSync(directory).filter(f => f.endsWith(".pdf"));
  for (const file of files) {
    const pdfPath = path.join(directory, file);
    const tempOutput = path.join(directory, "output_temp");
    console.log(`Procesando ${file}...`);
    try {
      const { fullText, albaranNumber } = await extractTextFromPDF(pdfPath, tempOutput);
      if (albaranNumber) {
        console.log(`Número de albarán encontrado: ${albaranNumber}`);
        movePDF(pdfPath, albaranNumber, directory);
      } else {
        console.warn(`Número de albarán no encontrado en ${file}`);
      }
    } catch (err) {
      console.error(`Error procesando ${file}:`, err);
    } finally {
      // Limpia la carpeta temporal
      if (fs.existsSync(tempOutput)) {
        fs.rmSync(tempOutput, { recursive: true, force: true });
      }
    }
  }
  console.log("Organización de PDFs completada.");
}

// Ejecutar
organizePDFs(WORK_DIR);
