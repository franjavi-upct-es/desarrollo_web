import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  dni: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  passwordHash: { type: String, required: true, unique: true },
});

export default mongoose.model("User", userSchema);
