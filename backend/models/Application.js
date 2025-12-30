import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scheme",
    required: true
  },

  applicationNumber: {
    type: String,
    unique: true,
    required: true
  },

  status: {
    type: String,
    enum: [
      "submitted",
      "under_review",
      "approved",
      "rejected",
      "pending_documents"
    ],
    default: "submitted"
  },

  documents: [
    {
      name: String,
      url: String,
      uploadedAt: Date
    }
  ],

  remarks: String,

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  reviewedAt: Date
}, { timestamps: true });

applicationSchema.pre("validate", async function () {
  if (!this.applicationNumber) {
    const count = await mongoose.model("Application").countDocuments();
    this.applicationNumber = `APP${Date.now()}${count + 1}`;
  }
  
});

export default mongoose.model("Application", applicationSchema);
