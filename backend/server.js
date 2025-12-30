import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Load env FIRST
dotenv.config({ path: path.join(__dirname, ".env") });

// 🔍 Proof
console.log("ENV CHECK →", {
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET ? "SET" : "MISSING"
});

// 🔥 IMPORT + CALL CLOUDINARY CONFIG
import cloudinary, { configureCloudinary } from "./config/cloudinary.js";
configureCloudinary(); // ✅ THIS WAS MISSING

import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import grievanceRoutes from "./routes/grievanceRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js"
import healthRoutes from "./routes/healthRoutes.js";

connectDB();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Digital Rural Welfare App" });
});

app.use("/api/auth", authRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/grievances", grievanceRoutes);

console.log("✅ Mounting appointment routes");

app.use("/api/appointments", appointmentRoutes);
app.use("/api/health", healthRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is listening at the port ${PORT}`);
});
