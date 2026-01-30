import express from "express";
import Course from "../models/Course.js";
import mongoose from "mongoose";
import Teacher from "../models/Teacher.js";
import Student from "../models/Students.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/* ========================
   AUTH CONTEXT
======================== */
const getAuthContext = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("No token provided");

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return {
    tenantId: decoded.tenantId,
    userId: decoded.userId,
    role: decoded.role
  };
};

/* ========================
   TEACHER STATS (TENANT SAFE)
======================== */
const syncTeacherStats = async (teacherId, tenantId) => {
  if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) return;

  const stats = await Course.aggregate([
    { $match: { tenantId } },
    { $unwind: "$classes" },
    { $match: { "classes.teacher": new mongoose.Types.ObjectId(teacherId) } },
    {
      $group: {
        _id: "$classes.teacher",
        uniqueCourses: { $addToSet: "$_id" },
        classNames: { $addToSet: "$classes.name" },
        totalStudents: {
          $sum: { $size: { $ifNull: ["$classes.students", []] } }
        }
      }
    }
  ]);

  const payload = stats[0] || {
    uniqueCourses: [],
    classNames: [],
    totalStudents: 0
  };

  await Teacher.findByIdAndUpdate(teacherId, {
    courses: payload.uniqueCourses,
    classes: payload.classNames,
    courseLoad: payload.uniqueCourses.length,
    classesLoad: payload.classNames.length,
    students: payload.totalStudents
  });
};

/* ========================
   COURSES
======================== */

// CREATE COURSE
router.post("/", async (req, res) => {
  try {
    const { tenantId } = getAuthContext(req);
    const { title, courseCode, classes } = req.body;

    const course = await Course.create({
      title,
      courseCode,
      classes: classes || [],
      tenantId
    });

    const teacherIds = [...new Set((classes || []).map(c => c.teacher).filter(Boolean))];
    for (const t of teacherIds) {
      await syncTeacherStats(t, tenantId);
    }

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE COURSE
router.put("/:id", async (req, res) => {
  try {
    const { tenantId } = getAuthContext(req);
    const courseId = req.params.id;

    const oldCourse = await Course.findOne({ _id: courseId, tenantId });
    if (!oldCourse) return res.status(404).json({ message: "Course not found" });

    const teachersBefore = [...new Set(oldCourse.classes.map(c => c.teacher?.toString()).filter(Boolean))];

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, tenantId },
      req.body,
      { new: true }
    );

    const teachersAfter = [...new Set(updatedCourse.classes.map(c => c.teacher?.toString()).filter(Boolean))];
    const affected = [...new Set([...teachersBefore, ...teachersAfter])];

    for (const t of affected) {
      await syncTeacherStats(t, tenantId);
    }

    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE COURSE
router.delete("/:id", async (req, res) => {
  try {
    const { tenantId } = getAuthContext(req);

    const course = await Course.findOne({ _id: req.params.id, tenantId });
    if (!course) return res.status(404).json({ message: "Course not found" });

    for (const cls of course.classes) {
      if (cls.teacher) {
        await syncTeacherStats(cls.teacher, tenantId);
      }
    }

    await Course.findOneAndDelete({ _id: req.params.id, tenantId });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL COURSES
router.get("/", async (req, res) => {
  try {
    const { tenantId } = getAuthContext(req);
    const courses = await Course.find({ tenantId }).lean();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ========================
   STUDENTS
======================== */

// ADD STUDENTS
router.post("/:courseId/classes/:classId/students", async (req, res) => {
  try {
    const { tenantId } = getAuthContext(req);
    const { courseId, classId } = req.params;
    const { students } = req.body;

    const ids = [];

    for (const s of students) {
      const hashed = await bcrypt.hash(s.password || "123456", 10);

      const doc = await Student.findOneAndUpdate(
        { email: s.email, tenantId },
        {
          ...s,
          password: hashed,
          tenantId,
          course: courseId,
          classId
        },
        { upsert: true, new: true }
      );

      ids.push(doc._id);
    }

    await Course.findOneAndUpdate(
      { _id: courseId, tenantId, "classes._id": classId },
      { $addToSet: { "classes.$.students": { $each: ids } } }
    );

    res.json({ message: "Students added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET CLASS STUDENTS
router.get("/:courseId/classes/:classId/students", async (req, res) => {
  try {
    const { tenantId } = getAuthContext(req);

    const course = await Course.findOne({
      _id: req.params.courseId,
      tenantId
    }).populate("classes.students");

    if (!course) return res.status(404).json({ message: "Course not found" });

    const cls = course.classes.id(req.params.classId);
    res.json(cls?.students || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ========================
   TEACHER COURSES
======================== */
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const { tenantId } = getAuthContext(req);

    const courses = await Course.find({
      tenantId,
      "classes.teacher": req.params.teacherId
    }).lean();

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ========================
   LABS & SUBMISSIONS
======================== */

// GET SUBMISSIONS
router.get("/:courseId/classes/:classId/labs/:labId/submissions", async (req, res) => {
  try {
    const { tenantId } = getAuthContext(req);

    const course = await Course.findOne({
      _id: req.params.courseId,
      tenantId
    }).populate("classes.students", "name rollNumber");

    if (!course) return res.status(404).json({ message: "Course not found" });

    const cls = course.classes.id(req.params.classId);
    const lab = cls.labs.id(req.params.labId);

    res.json(
      cls.students.map(st => {
        const sub = lab.submissions.find(s => s.studentId.equals(st._id));
        return {
          studentId: st._id,
          name: st.name,
          rollNumber: st.rollNumber,
          submitted: !!sub,
          xp: sub?.xp || 0,
          status: sub?.status || "Not Submitted"
        };
      })
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE LAB
router.post("/:courseId/classes/:classId/labs", async (req, res) => {
  try {
    const { tenantId } = getAuthContext(req);

    const course = await Course.findOneAndUpdate(
      { _id: req.params.courseId, tenantId, "classes._id": req.params.classId },
      { $push: { "classes.$.labs": { ...req.body, submissions: [] } } },
      { new: true }
    );

    if (!course) return res.status(404).json({ message: "Not found" });

    res.status(201).json({ message: "Lab added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE LAB
router.delete("/:courseId/classes/:classId/labs/:labId", async (req, res) => {
  try {
    const { tenantId } = getAuthContext(req);

    await Course.updateOne(
      { _id: req.params.courseId, tenantId, "classes._id": req.params.classId },
      { $pull: { "classes.$.labs": { _id: req.params.labId } } }
    );

    res.json({ message: "Lab deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
