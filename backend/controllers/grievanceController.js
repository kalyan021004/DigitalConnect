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

      // ✅ Attachments from Cloudinary (multer-storage-cloudinary)
      attachments: req.files?.map(file => ({
        url: file.path,
        uploadedAt: new Date()
      })) || [],

      status: "submitted",

      timeline: [
        {
          status: "submitted",
          changedBy: req.user._id,
          remark: "Grievance submitted",
          changedAt: new Date()
        }
      ]
    });

    res.status(201).json({
      message: "Grievance submitted successfully",
      grievanceNumber: grievance.grievanceNumber
    });

  } catch (err) {
    console.error("CREATE GRIEVANCE ERROR:", err);
    res.status(500).json({ error: "Failed to submit grievance" });
  }
};

/* ===============================
   CITIZEN: MY GRIEVANCES
================================ */
export const myGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(grievances);
  } catch (err) {
    console.error("MY GRIEVANCES ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ===============================
   GET SINGLE GRIEVANCE
================================ */
export const getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate("user", "name email phone village district state")
      .populate("timeline.changedBy", "name role");

    if (!grievance) {
      return res.status(404).json({ error: "Grievance not found" });
    }

    // 🔒 Citizen can view only their grievance
    if (
      req.user.role === "citizen" &&
      grievance.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(grievance);

  } catch (err) {
    console.error("GET GRIEVANCE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ===============================
   GRAM PANCHAYAT: ALL GRIEVANCES
================================ */
export const allGrievancesForPanchayat = async (req, res) => {
  try {
    const grievances = await Grievance.find()
      .populate("user", "name phone village")
      .sort({ createdAt: -1 });

    res.json(grievances);
  } catch (err) {
    console.error("ALL GRIEVANCES ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ===============================
   UPDATE STATUS / TIMELINE
================================ */
export const updateGrievanceStatus = async (req, res) => {
  try {
    const { status, remarks, escalate } = req.body;

    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ error: "Grievance not found" });
    }

    // 🔁 Handle escalation
    if (escalate === true) {
      grievance.status = "escalated";
      grievance.escalatedToState = true;
    } else {
      grievance.status = status;
    }

    // 🕒 Timeline entry (SOURCE OF TRUTH)
    grievance.timeline.push({
      status: grievance.status,
      changedBy: req.user._id,
      remark: remarks || `Marked as ${grievance.status}`,
      changedAt: new Date()
    });

    await grievance.save();

    res.json({
      message: "Grievance updated successfully",
      grievance
    });

  } catch (err) {
    console.error("UPDATE GRIEVANCE ERROR:", err);
    res.status(500).json({ error: "Failed to update grievance" });
  }
};
