import Doctor from "../models/Doctor.js";

/* ===============================
   GET ALL DOCTORS (PUBLIC)
================================ */
export const getDoctors = async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
};

/* ===============================
   GET SINGLE DOCTOR
================================ */
export const getDoctorById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
  }
  res.json(doctor);
};
