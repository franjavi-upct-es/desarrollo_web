// OCR Node.js backend service for HotelManolo
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const Tesseract = require('tesseract.js');
const { fromPath } = require('pdf2pic');
const { PDFDocument } = require('pdf-lib');
const { sessionMiddleware, verifyUser, addUser } = require('./auth');
require('dotenv').config();
const mongoose = require('mongoose');
const { Readable } = require('stream');

const app = express();
app.use(sessionMiddleware);

const PORT = process.env.PORT || 5002;
const FRONTEND_BUILD = path.join(__dirname, 'frontend_build');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
  app.locals.bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'pdfs'
  });
}).catch(err => console.error('❌ MongoDB connection error:', err));

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Mongoose schema
const AlbaranSchema = new mongoose.Schema({
  pdfFileId: mongoose.Schema.Types.ObjectId,
  filename: String,
  albaranId: String,
  timestamp: { type: Date, default: Date.now },
  text: String
});
const Albaran = mongoose.model('Albaran', AlbaranSchema);

// Middleware auth
function authRequired(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'No autorizado' });
  next();
}

// Utils
function getPrevYearShort() {
  return String(new Date().getFullYear() - 1).slice(-2);
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

// Routes

app.post('/login', express.json(), (req, res) => {
  const { username, password } = req.body;
  const isValid = verifyUser(username, password);
  if (isValid) {
    req.session.user = username;
    return res.json({ msg: 'Login exitoso' });
  }
  res.status(403).json({ error: 'Credenciales incorrectas' });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ msg: 'Logout exitoso' });
  });
});

app.get('/albaranes', authRequired, async (req, res) => {
  try {
    const albaranes = await Albaran.find().sort({ timestamp: -1 });
    res.json(albaranes.map(a => ({
      ...a.toObject(),
      pdfFileId: a.pdfFileId ? a.pdfFileId.toString() : null
    })));
  } catch (err) {
    res.status(500).json({ error: 'Error fetching albaranes' });
  }
});

app.delete('/albaranes/:id', authRequired, async (req, res) => {
  try {
    const albaran = await Albaran.findByIdAndDelete(req.params.id);
    if (albaran && albaran.pdfFileId) {
      try {
        await req.app.locals.bucket.delete(albaran.pdfFileId);
      } catch {}
    }
    res.json({ msg: 'Eliminado correctamente' });
  } catch {
    res.status(500).json({ error: 'Error deleting albarán' });
  }
});

app.get('/uploads/:id', (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    res.set('Content-Type', 'application/pdf');
    req.app.locals.bucket.openDownloadStream(_id).pipe(res);
  } catch {
    res.status(404).end();
  }
});

app.post('/ocr', authRequired, upload.single('pdf'), async (req, res) => {
  const bucket = req.app.locals.bucket;
  if (!bucket) return res.status(500).json({ error: 'GridFS bucket not initialized' });

  const readable = new Readable();
  readable.push(req.file.buffer);
  readable.push(null);

  const uploadStream = bucket.openUploadStream(req.file.originalname, {
    contentType: req.file.mimetype
  });

  readable.pipe(uploadStream)
    .on('error', err => {
      console.error("UploadStream error:", err);
      return res.status(500).json({ error: err.message });
    })
    .on('finish', async () => {
      const fileId = uploadStream.id;
      const tempPath = path.join(os.tmpdir(), `${fileId}-${req.file.originalname}`);
      const tempOutput = path.join(os.tmpdir(), `output_${Date.now()}`);

      try {
        fs.writeFileSync(tempPath, req.file.buffer);
        const { fullText, albaranNumber } = await extractTextFromPDF(tempPath, tempOutput);

        const albaran = await Albaran.create({
          pdfFileId: fileId,
          filename: req.file.originalname,
          albaranId: albaranNumber,
          text: fullText,
          timestamp: new Date()
        });

        res.json({ albaranNumber, text: fullText, albaran });
      } catch (err) {
        console.error("OCR processing error:", err);
        res.status(500).json({ error: err.message });
      } finally {
        try { fs.rmSync(tempOutput, { recursive: true, force: true }); } catch (_) {}
        try { fs.unlinkSync(tempPath); } catch (_) {}
      }
    });
});

// Serve frontend
app.use(express.static(FRONTEND_BUILD));

app.get('*', (req, res) => {
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/uploads') ||
    req.path.startsWith('/login') ||
    req.path.startsWith('/logout') ||
    req.path.startsWith('/ocr') ||
    req.path.startsWith('/albaranes')
  ) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(FRONTEND_BUILD, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 OCR backend running on port ${PORT}`);
});
