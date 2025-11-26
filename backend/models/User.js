import mongoose from "mongoose";

const allowedRoles = ["student", "teacher", "individual_learner", "organization", "admin"];

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: {
    type: String,
    enum: allowedRoles,
    default: "student"
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
