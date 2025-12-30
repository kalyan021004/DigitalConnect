import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

/* -------- CREATE APPOINTMENT (CITIZEN) -------- */
export const createAppointment = async (req, res) => {
  const {
    doctorId,
    appointmentDate,
    timeSlot,
    symptoms,
    consultationType
  } = req.body;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
  }

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctor._id,
    appointmentDate,
    timeSlot,
    symptoms,
    consultationType
  });

  res.status(201).json({
    message: "Appointment booked",
    appointment
  });
};


/* -------- CITIZEN: MY APPOINTMENTS -------- */
// controllers/appointmentController.js
export const myAppointments = async (req, res) => {
  const apps = await Appointment.find({ patient: req.user._id })
    .populate("doctor", "name specialization hospital");

  res.json(apps);
};



/* -------- DOCTOR ADMIN DASHBOARD -------- */
export const doctorAppointments = async (req, res) => {
  console.log("Doctor Admin:", req.user._id);

  const doctor = await Doctor.findOne({ user: req.user._id });
  console.log("Doctor Profile:", doctor);

  if (!doctor) return res.json([]);

  const apps = await Appointment.find({ doctor: doctor._id })
    .populate("patient", "name phone email");

  res.json(apps);
};



/* -------- UPDATE STATUS / PRESCRIPTION -------- */
export const updateAppointment = async (req, res) => {
  const { status, prescription } = req.body;

  const app = await Appointment.findById(req.params.id);
  if (!app) return res.status(404).json({ error: "Appointment not found" });

  app.status = status;
  if (prescription) app.prescription = prescription;

  await app.save();
  res.json({ message: "Appointment updated", app });
};

// controllers/appointmentController.js
export const getAppointmentById = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("patient", "name email phone")
    .populate("doctor");

  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found" });
  }

  // 🔒 Doctor can see ONLY their appointments
  if (req.user.role === "doctor_admin") {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || appointment.doctor._id.toString() !== doctor._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }
  }

  res.json(appointment);
};


