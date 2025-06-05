import mongoose from "mongoose";

const albaranSchema = new mongoose.Schema({
  nombreArchivo: { type: String, required: true },
  albaran: { type: String, required: true },
  fechaSubida: { type: Date, default: Date.now },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Albaran", albaranSchema);
