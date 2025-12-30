import Grievance from "../models/Grievance.js";

/* ===============================
   CREATE GRIEVANCE (WITH FILES)
================================ */
export const createGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.create({
      user: req.user._id,
      category: req.body.category,
      subject: req.body.subject,
      description: req.body.description,

      location: {
        village: req.body.village,
        landmark: req.body.landmark
      },

      // ✅ Cloudinary gives URL in file.path
      attachments: req.files?.map(file => ({
        url: file.path,
        uploadedAt: new Date()
      })) || [],

      timeline: [
        {
          status: "submitted",
          changedBy: req.user._id,
          remark: "Grievance submitted"
        }
      ]
    });

    res.status(201).json({
      message: "Grievance submitted successfully",
      grievanceNumber: grievance.grievanceNumber
    });
  } catch (err) {
    console.error("CREATE GRIEVANCE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   CITIZEN: MY GRIEVANCES
================================ */
export const myGrievances = async (req, res) => {
  const grievances = await Grievance.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(grievances);
};

/* ===============================
   GET SINGLE GRIEVANCE
================================ */
export const getGrievanceById = async (req, res) => {
  const grievance = await Grievance.findById(req.params.id)
    .populate("user", "name email phone village");

  if (!grievance) {
    return res.status(404).json({ error: "Grievance not found" });
  }

  res.json(grievance);
};

/* ===============================
   GRAM PANCHAYAT: ALL GRIEVANCES
================================ */
export const allGrievancesForPanchayat = async (req, res) => {
  const grievances = await Grievance.find()
    .populate("user", "name phone village")
    .sort({ createdAt: -1 });

  res.json(grievances);
};

/* ===============================
   UPDATE STATUS / REMARKS
================================ */
export const updateGrievanceStatus = async (req, res) => {
  const { status, remarks, escalate } = req.body;

  const grievance = await Grievance.findById(req.params.id);
  if (!grievance) {
    return res.status(404).json({ error: "Grievance not found" });
  }

  grievance.status = status;
  grievance.remarks = remarks;

  grievance.timeline.push({
    status,
    changedBy: req.user._id,
    remark: remarks
  });

  if (escalate === true) {
    grievance.escalatedToState = true;
    grievance.status = "escalated";
  }

  await grievance.save();

  res.json({
    message: "Grievance updated successfully",
    grievance
  });
};
