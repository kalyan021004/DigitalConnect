import Application from "../models/Application.js";


export const applyForScheme = async (req, res) => {
  const { schemeId } = req.body;

  // ❌ Prevent duplicate application
  const existing = await Application.findOne({
    user: req.user._id,
    scheme: schemeId
  });

  if (existing) {
    return res.status(400).json({
      error: "You have already applied for this scheme"
    });
  }

  const application = await Application.create({
    user: req.user._id,
    scheme: schemeId
  });

  res.status(201).json({
    message: "✅ Application submitted successfully",
    applicationNumber: application.applicationNumber
  });
};



export const getMyApplications = async (req, res) => {

    const apps = await Application.find({ user: req.user._id })
        .populate("scheme");
    res.json(apps);
}
// State Admin Only


export const getAllApplications = async (req, res) => {
  const apps = await Application.find()
    .populate("user", "name email")
    .populate("scheme", "name category");
  res.json(apps);
};

export const reviewApplication = async (req, res) => {
  const { status, remarks } = req.body;

  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ error: "Not found" });

  app.status = status;
  app.remarks = remarks;
  app.reviewedBy = req.user._id;
  app.reviewedAt = new Date();

  await app.save();

  res.json({ message: "Application reviewed", app });
};
export const getApplicationById = async (req, res) => {
  const app = await Application.findById(req.params.id)
    .populate("user", "name email phone village district state")
    .populate("scheme");

  if (!app) {
    return res.status(404).json({ error: "Application not found" });
  }

  // Citizen can see only their own
  if (
    req.user.role === "citizen" &&
    app.user._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ error: "Access denied" });
  }

  res.json(app);
};


