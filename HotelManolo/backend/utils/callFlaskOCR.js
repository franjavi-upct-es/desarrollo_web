import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export const callFlaskOCR = async (pdfPath) => {
  const form = new FormData();
  form.append("pdf", fs.createReadStream(pdfPath));

  const res = await axios.post("http://localhost:5001/extract-albaran", form, {
    headers: form.getHeaders(),
  });

  return res.data.albaran;
};
