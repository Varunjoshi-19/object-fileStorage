import upload, { __dirname as dirname } from "./multer.js";
import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { fetchImages, handleUploadFile, renderImage } from "./util.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(dirname, "public")));



app.get("/render/:id", (req, res) => renderImage(req, res));
app.get("/files", (req, res) => fetchImages(req, res));
app.post("/upload-file", upload.single("file"), (req, res) => handleUploadFile(req, res));



app.listen(port, () => {
    console.log(`Server up and running on ${port}`);
})