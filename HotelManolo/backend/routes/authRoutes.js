import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/v1/auth/login 
router.post("/login", async (req, res) => {
  try {
    const { dni, password } = req.body;
    if (!dni || !password) {
      return res.status(400).json({ error: "DNI y contraseña son obligatorio" });
    }

    const user = await User.findOne({ dni });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secreto", {
      expiresIn: "8h",
    });

    return res.status(200).json({
      token,
      nombre: user.nombre,
    })
  } catch (error) {
    console.error("authRoutes/login:", error);
    return res.status(500).json({ error: "Error interno" });
  }
});

export default router;
