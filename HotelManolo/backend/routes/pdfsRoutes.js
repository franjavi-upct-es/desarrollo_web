import express from "express";
import { upload } from "../middleware/uploadMiddleware";
import { processPdf } from "../controllers/pdfController";

const router = express.Router();

router.post("/add", upload.single("pdf"), processPdf);

export default router;
