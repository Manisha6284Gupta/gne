import express from "express";
import multer from "multer";
import cors from "cors";
import Tesseract from "tesseract.js"; // OCR Library
import { PORT, mongo_url } from "./config.js"; // ✅ Correct import
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());

// Multer storage for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.send("Welcome to the OTR Number Verification API!");
});

app.post("/api/upload", upload.single("uploadedImage"), async (req, res) => {
    const { otrNumber } = req.body;

    if (!req.file || !otrNumber) {
        return res.status(400).json({ message: "Image and OTR number required!" });
    }

    try {
        // Convert image buffer to base64 for OCR processing
        const imageBuffer = req.file.buffer;
        const base64Image = `data:image/png;base64,${imageBuffer.toString("base64")}`;

        // Perform OCR using Tesseract.js
        const { data } = await Tesseract.recognize(base64Image, "eng");

        console.log("Extracted Text:", data.text); // Debugging

        // Check if extracted text contains the OTR number
        if (data.text.includes(otrNumber)) {
            return res.json({ message: "✅ OTR Number Matched Successfully verifies!" });
        } else {
            return res.json({ message: "❌ OTR Number Not Matched with OTR card Verification Failed!" });
        }

    } catch (error) {
        console.error("OCR Error:", error);
        res.status(500).json({ message: "Error processing image. Try again!" });
    }
});

// Start Server
mongoose
    .connect(mongo_url)
    .then(() => {
        console.log("MongoDB connected successfully!");
        app.listen(PORT, () => {
            console.log(`Server running at http://127.0.0.1:${PORT}`);
        });
    })
    .catch((error) => {
        console.error(error);
    });
