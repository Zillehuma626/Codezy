import express from "express";
import Teacher from "../models/Teacher.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import multer from "multer";
import Papa from "papaparse";
import Course from "../models/Course.js";
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import mongoose from "mongoose";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * HELPER: AGGREGATE TEACHER STATS
 * This function calculates real-time stats for teachers based on the Course collection.
 */
const getTeacherStats = async (teacherIds = []) => {
    const matchStage = teacherIds.length > 0 
        ? { $match: { "classes.teacher": { $in: teacherIds.map(id => new mongoose.Types.ObjectId(id)) } } }
        : { $match: { "classes.teacher": { $exists: true } } };

    const stats = await Course.aggregate([
        { $unwind: "$classes" },
        matchStage,
        {
            $group: {
                _id: "$classes.teacher",
                courseIds: { $addToSet: "$_id" },
                classNames: { $addToSet: "$classes.name" },
                studentCount: { $sum: { $size: { $ifNull: ["$classes.students", []] } } }
            }
        }
    ]);
    return stats;
};

/* -------------------------------------
   GET ALL TEACHERS (With Dynamic Stats)
-------------------------------------- */
router.get("/", async (req, res) => {
    try {
        const teachers = await Teacher.find().sort({ createdAt: -1 }).select("-password").lean();
        const stats = await getTeacherStats();

        // Merge dynamic stats into the teacher objects
        const enrichedTeachers = teachers.map(t => {
            const teacherStat = stats.find(s => s._id.toString() === t._id.toString());
            return {
                ...t,
                courseLoad: teacherStat ? teacherStat.courseIds.length : 0,
                classesLoad: teacherStat ? teacherStat.classNames.length : 0,
                students: teacherStat ? teacherStat.studentCount : 0,
                courses: teacherStat ? teacherStat.courseIds : [],
                classes: teacherStat ? teacherStat.classNames : []
            };
        });

        res.json(enrichedTeachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* -------------------------------------
   GET SINGLE TEACHER (With Dynamic Stats)
-------------------------------------- */
router.get("/:id", async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).select("-password").lean();
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });

        const stats = await getTeacherStats([teacher._id]);
        const s = stats[0] || { courseIds: [], classNames: [], studentCount: 0 };

        res.json({
            ...teacher,
            courseLoad: s.courseIds.length,
            classesLoad: s.classNames.length,
            students: s.studentCount,
            courses: s.courseIds,
            classes: s.classNames
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* -------------------------------------
   CREATE SINGLE TEACHER (Identity Only)
-------------------------------------- */
/* -------------------------------------
   CREATE SINGLE TEACHER
-------------------------------------- */
router.post("/", async (req, res) => {
    try {
        const { name, email, role, department, password, status } = req.body;
        const existing = await Teacher.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(400).json({ message: "Email exists" });

        // SEND PLAIN TEXT PASSWORD - The Model's pre-save hook will hash it
        const teacher = new Teacher({
            name,
            email: email.toLowerCase(),
            role,
            status: status || "Active",
            department: Array.isArray(department) ? department : department?.split(','),
            password: password || crypto.randomBytes(6).toString("hex")
        });

        await teacher.save();
        res.status(201).json({ message: "Teacher created" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/* -------------------------------------
   UPDATE TEACHER
-------------------------------------- */
router.put("/:id", async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: "Not found" });

        const { password, ...updateData } = req.body;
        Object.assign(teacher, updateData);

        // SEND PLAIN TEXT PASSWORD - The hook handles encryption
        if (password && password.trim() !== "") {
            teacher.password = password;
        }

        await teacher.save();
        res.json({ message: "Updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

/* -------------------------------------
   BULK TEACHERS UPLOAD )
-------------------------------------- */
router.post("/bulk", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "CSV file is required" });

    try {
        const csvString = req.file.buffer.toString("utf-8");
        const { data: items } = Papa.parse(csvString, { header: true, skipEmptyLines: true });

        const prepared = items.map(t => {
            return {
                name: t.Name?.trim() || "",
                email: t.Email?.trim().toLowerCase() || "",
                role: t.Role?.trim() || "",
                status: "Active",
                department: t.Department ? t.Department.split(',').map(d => d.trim()).filter(Boolean) : [],
                password: t.Password?.trim() || crypto.randomBytes(6).toString("hex")
            };
        });

        const unique = prepared.filter((t, index, self) => 
            t.email && self.findIndex(prev => prev.email === t.email) === index
        );
        const teachersToCreate = unique.map(t => new Teacher(t));
        await Promise.all(teachersToCreate.map(t => t.save()));
        
        res.json({ message: `Successfully imported ${unique.length} teachers.` });
    } catch (err) {
        console.error("Bulk upload error:", err);
        res.status(500).json({ message: "Bulk upload failed", error: err.message });
    }
});

/* -------------------------------------
   2FA & SECURITY ROUTES
-------------------------------------- */

router.get("/:id/2fa/setup", async (req, res) => {
    const teacher = await Teacher.findById(req.params.id);
    const secret = speakeasy.generateSecret({ name: `Codezy:${teacher.email}` });
    teacher.twoFactorSecret = secret.base32;
    await teacher.save();
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    res.json({ qrCodeUrl, secret: secret.base32 });
});

router.post("/:id/2fa/verify", async (req, res) => {
    const { token } = req.body;
    const teacher = await Teacher.findById(req.params.id);
    const verified = speakeasy.totp.verify({
        secret: teacher.twoFactorSecret,
        encoding: 'base32',
        token
    });
    if (verified) {
        teacher.isTwoFactorEnabled = true;
        await teacher.save();
        res.json({ message: "2FA Enabled successfully" });
    } else {
        res.status(400).json({ message: "Invalid code." });
    }
});

router.post("/:id/2fa/disable", async (req, res) => {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher found" });
    teacher.twoFactorSecret = null;
    teacher.isTwoFactorEnabled = false;
    await teacher.save();
    res.json({ message: "2FA Disabled" });
});

/* -------------------------------------
   UPDATE
-------------------------------------- */
/* -------------------------------------
   CREATE SINGLE TEACHER
-------------------------------------- */
router.post("/", async (req, res) => {
    try {
        const { name, email, role, department, password, status } = req.body;
        const existing = await Teacher.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(400).json({ message: "Email exists" });

        // SEND PLAIN TEXT PASSWORD - The Model's pre-save hook will hash it
        const teacher = new Teacher({
            name,
            email: email.toLowerCase(),
            role,
            status: status || "Active",
            department: Array.isArray(department) ? department : department?.split(','),
            password: password || crypto.randomBytes(6).toString("hex")
        });

        await teacher.save();
        res.status(201).json({ message: "Teacher created" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/* -------------------------------------
   UPDATE TEACHER
-------------------------------------- */
router.put("/:id", async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: "Not found" });

        const { password, ...updateData } = req.body;
        Object.assign(teacher, updateData);

        // SEND PLAIN TEXT PASSWORD - The hook handles encryption
        if (password && password.trim() !== "") {
            teacher.password = password;
        }

        await teacher.save();
        res.json({ message: "Updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});
//-------------------------------------
// DELETE
//-------------------------------------
router.delete("/:id", async (req, res) => {
    try {
        await Teacher.findByIdAndDelete(req.params.id);
        res.json({ message: "Teacher deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;