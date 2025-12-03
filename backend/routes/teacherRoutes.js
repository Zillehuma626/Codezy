import express from "express";
import Teacher from "../models/Teacher.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import multer from "multer";
import Papa from "papaparse";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* -------------------------------------
   GET ALL TEACHERS
-------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 }).select("-password");
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------------
   CREATE SINGLE TEACHER (Manual)
-------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const data = { ...req.body };

    if (!data.name || !data.email || !data.role) {
      return res.status(400).json({ message: "Name, Email, and Role are required." });
    }

    data.email = data.email.toLowerCase();
    if (!data.password) data.password = crypto.randomBytes(6).toString("hex");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    // Avoid duplicates
    const existing = await Teacher.findOne({ email: data.email });
    if (existing) return res.status(400).json({ message: "A teacher with this email already exists." });

    // Ensure arrays
    data.courses = Array.isArray(data.courses) ? data.courses : (data.coursesStr ? data.coursesStr.split(',').map(c => c.trim()).filter(Boolean) : []);
    data.classes = Array.isArray(data.classes) ? data.classes : (data.classesStr ? data.classesStr.split(',').map(c => c.trim()).filter(Boolean) : []);
    data.department = Array.isArray(data.department) ? data.department : (data.departmentStr ? data.departmentStr.split(',').map(d => d.trim()).filter(Boolean) : []);
    data.courseLoad = Number(data.courseLoad) || data.courses.length;
    data.classesLoad = Number(data.classesLoad) || data.classes.length;
    data.students = Number(data.students) || 0;
    data.status = data.status === "On Leave" ? "On Leave" : "Active";

    const teacher = new Teacher(data);
    const saved = await teacher.save();
    const safe = saved.toObject();
    delete safe.password;
    res.status(201).json(safe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/:id/details", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate({
        path: "courses",
        populate: { path: "classes" }   // nested populate
      });

    res.json(teacher);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------------
   BULK TEACHERS UPLOAD (CSV)
-------------------------------------- */
router.post("/bulk", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "CSV file is required" });

  try {
    const csvString = req.file.buffer.toString("utf-8");
    const parsed = Papa.parse(csvString, { header: true, skipEmptyLines: true });
    const items = parsed.data;

    const prepared = await Promise.all(items.map(async t => {
      const coursesArr = t.Courses ? t.Courses.split(',').map(c => c.trim()).filter(Boolean) : [];
      const classesArr = t.Classes ? t.Classes.split(',').map(c => c.trim()).filter(Boolean) : [];
      const deptArr = t.Department ? t.Department.split(',').map(d => d.trim()).filter(Boolean) : [];
      const password = t.Password?.trim() || crypto.randomBytes(6).toString("hex");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      return {
        name: t.Name?.trim() || "",
        email: t.Email?.trim().toLowerCase() || "",
        role: t.Role?.trim() || "",
        courses: coursesArr,
        courseLoad: Number(t.CourseLoad) || coursesArr.length,
        classes: classesArr,
        classesLoad: Number(t.ClassesLoad) || classesArr.length,
        students: Number(t.Students) || 0,
        status: t.Status === "On Leave" ? "On Leave" : "Active",
        password: hashedPassword,
        department: deptArr,
      };
    }));

    // Remove duplicates inside CSV
    const seen = new Set();
    const unique = prepared.filter(t => {
      if (!t.email) return false;
      if (seen.has(t.email)) return false;
      seen.add(t.email);
      return true;
    });

    const created = await Teacher.insertMany(unique, { ordered: false });
    const createdSafe = created.map(c => {
      const obj = c.toObject();
      delete obj.password;
      return obj;
    });

    res.json({
      created: createdSafe,
      message: createdSafe.length === unique.length ? "All teachers added successfully" : "Some entries skipped due to duplicate emails"
    });
  } catch (err) {
    console.log("Bulk insert error:", err);
    res.status(500).json({ message: "Bulk upload failed", error: err.message });
  }
});

/* -------------------------------------
   UPDATE TEACHER
-------------------------------------- */
router.put("/:id", async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.email) data.email = data.email.toLowerCase();

    const exists = await Teacher.findOne({ email: data.email, _id: { $ne: req.params.id } });
    if (exists) return res.status(400).json({ message: "Another teacher with this email already exists." });

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    // Ensure arrays
    data.courses = Array.isArray(data.courses) ? data.courses : (data.coursesStr ? data.coursesStr.split(',').map(c => c.trim()).filter(Boolean) : []);
    data.classes = Array.isArray(data.classes) ? data.classes : (data.classesStr ? data.classesStr.split(',').map(c => c.trim()).filter(Boolean) : []);
    data.department = Array.isArray(data.department) ? data.department : (data.departmentStr ? data.departmentStr.split(',').map(d => d.trim()).filter(Boolean) : []);
    data.courseLoad = Number(data.courseLoad) || data.courses.length;
    data.classesLoad = Number(data.classesLoad) || data.classes.length;
    data.students = Number(data.students) || 0;
    data.status = data.status === "On Leave" ? "On Leave" : "Active";

    const updated = await Teacher.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ message: "Teacher not found" });

    const safe = updated.toObject();
    delete safe.password;
    res.json(safe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------------
   DELETE TEACHER
-------------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/:id", async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  res.json(teacher);
});

router.get("/assigned/:teacherId", async (req, res) => {
  const courses = await Course.find({ assignedTeacherId: req.params.teacherId });
  res.json(courses);
});

export default router;
