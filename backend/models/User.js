import mongoose from 'mongoose';

import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['citizen', 'gram_panchayat','state_admin', 'doctor_admin'],
    default: 'citizen'
  },
  village: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  aadhaar: { type: String, unique: true, sparse: true },
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  category: { type: String, enum: ['general', 'obc', 'sc', 'st', 'other'] },
  isVerified: { type: Boolean, default: false },
  profileImage: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;