import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Rutas 
import authRoutes from "./routes/authRoutes.js";
import pdfsRoutes from "./routes/pdfsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB 
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hotelmanolo";
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err))

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta estática para servir PDFs subidos 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas 
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/pdfs", pdfsRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
})
