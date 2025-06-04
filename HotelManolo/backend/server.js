import express from "express";
import cors from "cors";
import pdfRoutes from "./routes/pdfsRoutes.js";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

const uploadDir = path.join("backend", "upload");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

app.use(cors());
app.use(express.json())
app.use("/api/v1/pdfs", pdfRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
})
