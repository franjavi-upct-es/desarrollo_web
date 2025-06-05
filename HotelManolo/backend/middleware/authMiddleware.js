import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto");
    const usuario = await User.findById(decoded.id).select("-passwordHash");
    if (!usuario) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    req.user = usuario;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
};

