import express from "express";
const router = express.Router();
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.js";
import Grievance from "../models/Grievance.js";
import {
  createGrievance,
  myGrievances,
  allGrievancesForPanchayat,
  updateGrievanceStatus,
  getGrievanceById
} from "../controllers/grievanceController.js";

/* ---------------- CITIZEN ---------------- */
router.post("/", auth, role("citizen"),  upload.array("files"),createGrievance);
router.get("/mine", auth, role("citizen"), myGrievances);
router.get("/:id",auth,role("citizen", "gram_panchayat"),getGrievanceById);
router.post(
  "/:id/upload",
  auth,
  role("citizen"),
  upload.array("files"),
  async (req, res) => {
    const grievance = await Grievance.findById(req.params.id);
    req.files.forEach(f => {
      grievance.attachments.push({
        url: `/uploads/${f.filename}`,
        uploadedAt: new Date()
      });
    });
    await grievance.save();
    res.json({ message: "Files uploaded" });
  }
);

/* ---------------- GRAM PANCHAYAT ---------------- */
router.get("/", auth, role("gram_panchayat"), allGrievancesForPanchayat);
router.put("/:id", auth, role("gram_panchayat"), updateGrievanceStatus);

export default router;
