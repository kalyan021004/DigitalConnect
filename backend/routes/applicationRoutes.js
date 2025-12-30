import express from "express";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";

import {
  applyForScheme,
  getMyApplications,
  getAllApplications,
  reviewApplication,
  getApplicationById
} from "../controllers/applicationController.js";

const router = express.Router();

/* Citizen */
router.post("/apply", auth, role("citizen"), applyForScheme);
router.get("/mine", auth, role("citizen"), getMyApplications);
router.get("/:id", auth, getApplicationById);

/* State Admin */
router.get("/", auth, role("state_admin"), getAllApplications);
router.put("/:id/review", auth, role("state_admin"), reviewApplication);

export default router;
