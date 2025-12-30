import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // doctor_admin user
    required: true
  },

  name: String,
  specialization: String,
  hospital: String,
  location: String,
  phone: String,

  experience: Number,
  rating: Number,

  availableHours: String,

  accessibility: {
    wheelchairAccess: Boolean,
    signLanguageSupport: Boolean,
    disabledFriendlyToilet: Boolean
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Doctor", doctorSchema);
