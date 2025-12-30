import express from "express";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";
import {
  createAppointment,
  myAppointments,
  doctorAppointments,
  updateAppointment,
  getAppointmentById 
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", auth, role("citizen"), createAppointment);
router.get("/mine", auth, role("citizen"), myAppointments);

router.get("/doctor", auth, role("doctor_admin"), doctorAppointments);
router.put("/:id", auth, role("doctor_admin"), updateAppointment);
router.get(
  "/:id",
  auth,
  role("citizen", "doctor_admin"),
  getAppointmentById
);
export default router;
