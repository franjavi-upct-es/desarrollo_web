// OCR Node.js backend service for HotelManolo
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const { fromPath } = require('pdf2pic');
const { PDFDocument } = require('pdf-lib');
const { sessionMiddleware, verifyUser, addUser } = require('./auth');
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Albaran Mongoose model
const AlbaranSchema = new mongoose.Schema({
  filename: String,
  albaranId: String,
  timestamp: { type: Date, default: Date.now },
  text: String
});
const Albaran = mongoose.model('Albaran', AlbaranSchema);

const app = express();
app.use(sessionMiddleware);

const PORT = process.env.PORT || 5002;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const FRONTEND_BUILD = path.join(__dirname, 'frontend_build');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

function authRequired(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
}

function getPrevYear() {
  return new Date().getFullYear() - 1;
}
function getPrevYearShort() {
  return String(getPrevYear()).slice(-2);
}
function extractAlbaranNumber(text) {
  const yearShort = getPrevYearShort();
  const regex = new RegExp(`\\b(?:[A-Z]${yearShort}\\d{5}|AA${yearShort}\\d{4})\\b`);
  const match = text.match(regex);
  return match ? match[0] : null;
}
async function getPDFPageCount(pdfPath) {
  const data = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(data);
  return pdfDoc.getPageCount();
}
async function extractTextFromPDF(pdfPath, outputDir) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const convert = fromPath(pdfPath, {
    density: 300,
    saveFilename: 'pagina',
    savePath: outputDir,
    format: 'png',
    width: 1654,
    height: 2339,
  });
  const totalPages = await getPDFPageCount(pdfPath);
  let fullText = '';
  let albaranNumber = null;
  for (let i = 1; i <= totalPages; i++) {
    const { name } = await convert(i);
    const imagePath = path.join(outputDir, name);
    const result = await Tesseract.recognize(imagePath, 'spa');
    fullText += result.data.text + '\n';
    albaranNumber = extractAlbaranNumber(result.data.text);
    if (albaranNumber) break;
  }
  return { fullText, albaranNumber };
}

// API routes first - before static file serving
app.post('/login', express.json(), (req, res) => {
  console.log('🔑 Login endpoint hit');
  console.log('Request body:', req.body);
  const { username, password } = req.body;
  console.log('Login attempt for username:', username);
  console.log('Password provided:', password ? 'YES' : 'NO');
  console.log('Session before login:', req.session);
  console.log('Headers:', req.headers);
  
  const isValid = verifyUser(username, password);
  console.log('Verification result:', isValid);
  
  if (isValid) {
    req.session.user = username;
    console.log('✅ Login successful for:', username);
    console.log('Session after login:', req.session);
    return res.json({ msg: 'Login exitoso' });
  }
  console.log('❌ Login failed for:', username);
  res.status(403).json({ error: 'Credenciales incorrectas' });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ msg: 'Logout exitoso' });
  });
});

// Add missing albaranes endpoints for frontend compatibility
app.get('/albaranes', authRequired, async (req, res) => {
  try {
    const albaranes = await Albaran.find().sort({ timestamp: -1 });
    res.json(albaranes);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching albaranes' });
  }
});

app.delete('/albaranes/:id', authRequired, async (req, res) => {
  try {
    const albaran = await Albaran.findByIdAndDelete(req.params.id);
    if (albaran) {
      const filePath = path.join(UPLOAD_DIR, albaran.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res.json({ msg: 'Eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Albarán no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error deleting albarán' });
  }
});

// Serve uploads
app.use('/uploads', authRequired, express.static(UPLOAD_DIR));

// Serve frontend static files
app.use(express.static(FRONTEND_BUILD));

// Fallback to index.html for SPA (must be last!)
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_BUILD, 'index.html'));
});

// Protect OCR, uploads, and all API endpoints
app.post('/ocr', authRequired, upload.single('pdf'), async (req, res) => {
  const pdfPath = req.file.path;
  const tempOutput = path.join(UPLOAD_DIR, 'output_temp_' + Date.now());
  try {
    const { fullText, albaranNumber } = await extractTextFromPDF(pdfPath, tempOutput);
    // Save the albaran info to MongoDB
    const albaran = await Albaran.create({
      filename: req.file.filename,
      albaranId: albaranNumber,
      text: fullText,
      timestamp: new Date()
    });
    if (fs.existsSync(tempOutput)) fs.rmSync(tempOutput, { recursive: true, force: true });
    res.json({ albaranNumber, text: fullText, albaran });
  } catch (err) {
    if (fs.existsSync(tempOutput)) fs.rmSync(tempOutput, { recursive: true, force: true });
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`OCR backend running on port ${PORT}`);
});
