import express from "express";
import { getAllSchemes, createScheme,getSchemeById } from "../controllers/schemeController.js";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", auth, getAllSchemes);
router.post("/", auth, role("state_admin"), createScheme);
router.get("/:id", auth, getSchemeById);


export default router;
