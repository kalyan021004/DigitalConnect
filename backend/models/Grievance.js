import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  grievanceNumber: {
    type: String,
    unique: true
  },

  category: String,
  subject: String,
  description: String,

  location: {
    village: String,
    landmark: String
  },

  status: {
    type: String,
    enum: ["submitted", "under_review", "resolved", "rejected", "escalated"],
    default: "submitted"
  },

  remarks: String,

  /* 🔹 FILE UPLOADS */
  attachments: [
    {
      url: String,
      uploadedAt: Date
    }
  ],

  /* 🔹 STATUS TIMELINE */
  timeline: [
    {
      status: String,
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      at: {
        type: Date,
        default: Date.now
      },
      remark: String
    }
  ],

  /* 🔹 ESCALATION */
  escalatedToState: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

grievanceSchema.pre("validate", function (next) {
  if (!this.grievanceNumber) {
    this.grievanceNumber = `GRV-${Date.now()}`;
  }
  
  
});

export default mongoose.model("Grievance", grievanceSchema);
