import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js"; // assuming you have a Teacher model
import Course from "../models/Course.js"; // import your Course model

const router = express.Router();

// -----------------------------
// REGISTER API (for Users only)
// -----------------------------
router.post("/register", async (req, res) => {
  try {
    const { fullName, username, email, password, role } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    const existingTeacher = await Teacher.findOne({ $or: [{ username }, { email }] });

    if (existingUser || existingTeacher) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      userId: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
});

// -----------------------------
// LOGIN API
// -----------------------------
// LOGIN API
// -----------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // 1️⃣ Check Teacher collection first
    let user = await Teacher.findOne({ $or: [{ email }, { username: email }] });
    let detectedRole = "teacher";

    if (!user) {
      // 2️⃣ Check User collection next
      user = await User.findOne({ $or: [{ email }, { username: email }] });

      if (!user) {
        console.log("Searching in courses for student:", email);
        const courses = await Course.find({ "classes.students.email": email });
        let student = null;
        let courseId = null;
        let classId = null;

        for (const course of courses) {
          for (const cls of course.classes) {
            const stud = cls.students.find(s => s.email === email);
            if (stud) {
              student = stud;
              courseId = course._id;
              classId = cls._id;
              break;
            }
          }
          if (student) break;
        }

        if (!student) {
          return res.status(404).json({ message: "User not found. Please register first." });
        }

        // ✅ Plain-text password check for students
        if (student.password !== password) {
          return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
          { userId: student._id, role: "student", courseId, classId },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return res.json({
          message: "Login successful",
          token,
          userId: student._id,
          email: student.email,
          fullName: student.name,
          role: "student",
          courseId,
          classId
        });
      }

      detectedRole = user.role;
    }

    // If Teacher or User, use bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { userId: user._id, role: detectedRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      userId: user._id,
      email: user.email || "",
      fullName: user.fullName || user.name || "",
      role: detectedRole,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
