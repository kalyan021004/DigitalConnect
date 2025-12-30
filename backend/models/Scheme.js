import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },

  category: {
    type: String,
    enum: [
      "agriculture",
      "education",
      "health",
      "housing",
      "employment",
      "social_welfare"
    ],
    required: true
  },

  eligibility: {
    minAge: Number,
    maxAge: Number,
    gender: [String],
    category: [String],
    income: { max: Number },
    landHolding: { max: Number }
  },

  benefits: { type: String, required: true },

  documents: [{ name: String, required: Boolean }],

  applicationProcess: String,

  deadlines: {
    startDate: Date,
    endDate: Date
  },

  department: String,
  officialLink: String,

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Scheme", schemeSchema);
