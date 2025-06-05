import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import Albaran from "../models/Albaran.js";

const router = express.Router();

// GET /api/v1/dashboard/stats 
router.get("/stats", authenticate, async (req, res) => {
  try {
    const total = await Albaran.countDocuments({ usuario: req.user._id });
    return res.status(200).json({ totalAlbaranes: total });
  } catch (err) {
    console.error("dashboardRoutes/stats:", err);
    return res.status(500).json({ error: "Error al obtener estadísticas" })
  }
});

export default router;
