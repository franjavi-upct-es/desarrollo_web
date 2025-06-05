import express from "express";
import { upload } from "../middleware/uploadMiddleware.js"
import { listLastPDFs, processPdf } from "../controllers/pdfController.js";
import { authenticate } from "../middleware/authMiddleware.js"

const router = express.Router();

// POST /api/v1/pdfs/add
router.post("/add", authenticate, upload.single("pdf"), processPdf);

// GET /api/v1/pdfs/list
router.get("/list", authenticate, listLastPDFs);

export default router;
