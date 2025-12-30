import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  appointmentNumber: String,
  appointmentDate: Date,
  timeSlot: String,
  symptoms: String,

  consultationType: {
    type: String,
    enum: ["in_person", "video", "phone"],
    default: "in_person"
  },

  status: {
    type: String,
    enum: ["scheduled", "confirmed", "completed", "cancelled"],
    default: "scheduled"
  },

  prescription: {
    medicines: [{
      name: String,
      dosage: String,
      duration: String
    }],
    advice: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

appointmentSchema.pre("save", function () {
  if (!this.appointmentNumber) {
    this.appointmentNumber = `APT-${Date.now()}`;
  }
  
});

export default mongoose.model("Appointment", appointmentSchema);
