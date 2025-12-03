import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("classes.students");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ------------------------
   ADD NEW COURSE
------------------------- */
router.post("/", async (req, res) => {
  try {
    const { title, courseCode, classes } = req.body;

    // Basic validation
    if (!title || !courseCode) {
      return res.status(400).json({ message: "Title and Course Code are required" });
    }

    const newCourse = new Course({
      title,
      courseCode,
      classes: classes || [] // optional, empty array if none provided
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", course: newCourse });

  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ message: "Server error while creating course" });
  }
});


/* ------------------------
   GET COURSES ASSIGNED TO A TEACHER
------------------------- */
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;
    const courses = await Course.find({
      classes: { $elemMatch: { teacher: teacherId } }
    }).lean();

    if (!courses.length) return res.status(200).json([]);

    const response = courses.map(course => ({
      _id: course._id,
      title: course.title,
      courseCode: course.courseCode,
      classes: course.classes
        .filter(cls => cls.teacher?.toString() === teacherId)
        .map(cls => ({
          _id: cls._id,
          name: cls.name,
          students: cls.students || [],
          labs: cls.labs || []
        }))
    }));

    res.json(response);

  } catch (error) {
    console.error("Error fetching teacher courses:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ------------------------
   GET ALL STUDENTS OF CLASS
------------------------- */
router.get("/:courseId/classes/:classId/students", async (req, res) => {
  try {
    const { courseId, classId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const cls = course.classes.id(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    res.json(cls.students || []);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error fetching students" });
  }
});

/* ------------------------
   ADD STUDENTS TO CLASS
------------------------- */
router.post('/:courseId/classes/:classId/students', async (req, res) => {
  try {
    const { courseId, classId } = req.params;
    const { students } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const cls = course.classes.id(classId);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    const addedStudents = [];

    students.forEach(s => {
      const newStudent = {
        name: s.name,
        rollNumber: s.rollNumber,
        email: s.email,
        password: s.password,
        xp: s.xp || 0,
        progress: s.progress || 0,
      };
      cls.students.push(newStudent);
      addedStudents.push(cls.students.at(-1));
    });

    await course.save();
    res.json({ students: addedStudents });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while adding students' });
  }
});

/* ------------------------
   UPDATE SINGLE STUDENT
------------------------- */
router.put("/:courseId/classes/:classId/students/:studentId", async (req, res) => {
  try {
    const { courseId, classId, studentId } = req.params;
    const updatedData = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const cls = course.classes.id(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    const student = cls.students.id(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    Object.assign(student, updatedData);
    await course.save();

    res.json({ message: "Student updated successfully", student });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating student" });
  }
});

/* ------------------------
   DELETE SINGLE STUDENT
------------------------- */
router.delete("/:courseId/classes/:classId/students/:studentId", async (req, res) => {
  try {
    const { courseId, classId, studentId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const cls = course.classes.id(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    const student = cls.students.id(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.remove();
    await course.save();

    res.json({ message: "Student deleted successfully", studentId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting student" });
  }
});

/* ------------------------
   DELETE ALL STUDENTS IN CLASS
------------------------- */
router.delete("/:courseId/classes/:classId/students", async (req, res) => {
  try {
    const { courseId, classId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const cls = course.classes.id(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    cls.students = [];
    await course.save();

    res.json({ message: "All students deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting all students" });
  }
});

/* ------------------------
   GET ALL LABS FOR A CLASS
------------------------- */
router.get("/:courseId/classes/:classId/labs", async (req, res) => {
  try {
    const { courseId, classId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const cls = course.classes.id(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    res.json(cls.labs || []);
  } catch (err) {
    console.error("Error fetching labs:", err);
    res.status(500).json({ message: "Server error fetching labs" });
  }
});

/* ------------------------
   ADD LAB TO CLASS
    (Handles the full complex lab object via req.body)
------------------------- */
router.post("/:courseId/classes/:classId/labs", async (req, res) => {
  try {
    const { courseId, classId } = req.params;
    const complexLabPayload = req.body; // Full payload containing tasks, testCases, etc.

    // Basic validation based on the schema and frontend requirements
    if (!complexLabPayload.title || !complexLabPayload.marks || !complexLabPayload.tasks || complexLabPayload.tasks.length === 0) {
      return res.status(400).json({ message: "Lab must have a title, total marks, and at least one task." });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const cls = course.classes.id(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    // Mongoose automatically validates and embeds the entire complex object 
    // including tasks, testCases, and codeConstraints.
    cls.labs.push(complexLabPayload);
    await course.save();

    res.json({ message: "Complex Lab added successfully", lab: cls.labs.at(-1) });
  } catch (err) {
    console.error("Error adding lab:", err);
    // Ensure a meaningful error response, especially for validation errors
    res.status(500).json({ message: `Server error adding lab: ${err.message}` });
  }
});

/* ------------------------
   UPDATE LAB
------------------------- */
router.put("/:courseId/classes/:classId/labs/:labId", async (req, res) => {
  try {
    const { courseId, classId, labId } = req.params;
    const updatedData = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const cls = course.classes.id(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    const lab = cls.labs.id(labId);
    if (!lab) return res.status(404).json({ message: "Lab not found" });

    Object.assign(lab, updatedData);
    await course.save();

    res.json({ message: "Lab updated successfully", lab });

  } catch (err) {
    console.error("Error updating lab:", err);
    res.status(500).json({ message: "Server error updating lab" });
  }
});

/* ------------------------
   DELETE LAB
------------------------- */
router.delete("/:courseId/classes/:classId/labs/:labId", async (req, res) => {
  try {
    const { courseId, classId, labId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const cls = course.classes.id(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    const lab = cls.labs.id(labId);
    if (!lab) return res.status(404).json({ message: "Lab not found" });

    lab.remove();
    await course.save();

    res.json({ message: "Lab deleted successfully", labId });

  } catch (err) {
    console.error("Error deleting lab:", err);
    res.status(500).json({ message: "Server error deleting lab" });
  }
});

export default router;