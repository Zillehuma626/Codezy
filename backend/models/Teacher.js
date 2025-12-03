import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Teacher name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      default: null, // allow backend to generate password if not provided
    },
    role: {
      type: String,
      required: [true, "Role/Department is required"],
      trim: true,
    },
    courses: {
      type: [String],
      default: [],
      ref: "Course"
    },
    courseLoad: {
      type: Number,
      default: 0,
      min: [0, "Course load cannot be negative"],
    },
    classes: {
      type: [String],
      default: [],
    },
    classesLoad: {
      type: Number,
      default: 0,
      min: [0, "Classes load cannot be negative"],
    },
    department: {
      type: [String],
      default: [],
    },
    students: {
      type: Number,
      default: 0,
      min: [0, "Students cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Active", "On Leave"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// Hash password before saving, only if password is provided
teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Handle unique email errors nicely
teacherSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("A teacher with this email already exists."));
  } else {
    next(error);
  }
});

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
