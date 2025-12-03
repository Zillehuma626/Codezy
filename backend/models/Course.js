import mongoose from "mongoose";

// --- 1. Nested Schemas for Complex Lab Details ---

// Test Case Schema
const testCaseSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  input: { type: String, default: '' },
  expectedOutput: { type: String, default: '' },
  comparisonMode: { 
    type: String, 
    enum: ['Exact', 'IgnoreWhitespace', 'Regex'], 
    default: 'Exact' 
  },
  notes: { type: String, default: '' },
  isHidden: { type: Boolean, default: false } // Hidden test case for grading
}, { _id: false }); // Use the client-generated 'id' for array access

// Code Constraints Schema
const codeConstraintsSchema = new mongoose.Schema({
  required: [String], // Array of strings for required constructs (e.g., 'for loop')
  forbidden: [String] // Array of strings for forbidden constructs (e.g., 'recursion')
}, { _id: false });

// Task Schema
const taskSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  marks: { type: Number, required: true },
  description: { type: String },
  testCases: [testCaseSchema], // Embed Test Cases
  codeConstraints: { type: codeConstraintsSchema, default: () => ({}) } // Embed Constraints
}, { _id: false }); // Use the client-generated 'id' for array access

// --- 2. Expanded Lab Schema ---

// Lab schema (Expanded)
const labSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // Original marks field is kept, but its usage will be for the total of all tasks.
  marks: { type: Number, required: true }, 
  // Keep duration as string, or consider using separate date/time fields for better querying.
  duration: { type: String, required: true }, 
  
  // NEW COMPLEX FIELDS
  description: { type: String },
  instructions: { type: String },
  difficulty: { 
    type: String, 
    enum: ["Easy", "Medium", "Hard"], 
    default: "Medium" 
  },
  dueDate: { type: Date }, // Separate field for better date handling
  dueTime: { type: String }, // Separate field for time
  
  tasks: [taskSchema] // Embed Tasks
});

// --- 3. Existing Schemas (Using Expanded Lab Schema) ---

// Student schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  email: { type: String },      // stored but not exposed to frontend
  password: { type: String },   // stored but not exposed to frontend
  xp: { type: Number, default: 0 },
  progress: { type: Number, default: 0 }
});

// Class schema
const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  students: [studentSchema],
  labs: [labSchema], // This now uses the expanded labSchema
});

// Course schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  classes: [classSchema],
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);