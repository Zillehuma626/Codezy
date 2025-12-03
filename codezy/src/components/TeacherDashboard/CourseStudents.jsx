import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Search, PlusCircle, Upload, X, Trash2, Edit2 } from 'lucide-react';
import Papa from 'papaparse';

const CourseStudents = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [classId, setClassId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [manualStudent, setManualStudent] = useState({
    name: '', rollNumber: '', email: '', password: '', xp: 0, progress: 0
  });
  const [editIndex, setEditIndex] = useState(null);

  // Fetch course and classes
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        const data = res.data;

        if (!data) {
          console.warn('Course not found:', courseId);
          navigate('/mycourses');
          return;
        }

        setCourse(data);

        if (data.classes?.length > 0) {
          setClassId(data.classes[0]._id);
          setStudents(data.classes[0].students || []);
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        navigate('/mycourses');
      }
    };
    fetchCourse();
  }, [courseId, navigate]);

  // Handle class selection change
  const handleClassChange = (id) => {
    setClassId(id);
    const cls = course.classes.find((c) => c._id === id);
    setStudents(cls?.students || []);
  };

  // CSV Upload
  const handleCSVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !classId) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsedStudents = results.data.map(row => ({
          name: row.name?.trim() || '',
          rollNumber: row.rollNumber?.trim() || '',
          email: row.email?.trim() || '',
          password: row.password?.trim() || '',
          xp: Number(row.xp) || 0,
          progress: Number(row.progress) || 0,
        }));

        try {
          const res = await axios.post(
            `http://localhost:5000/api/courses/${courseId}/classes/${classId}/students`,
            { students: parsedStudents }
          );
          setStudents(prev => [...prev, ...res.data.students]);
        } catch (err) {
          console.error('Error adding students to database:', err);
        }
        setShowModal(false);
      },
    });
  };

  // Add or edit student
  const handleAddOrEditStudent = async () => {
    if (!manualStudent.name || !manualStudent.rollNumber || !classId) return;

    const studentData = {
      name: manualStudent.name.trim(),
      rollNumber: manualStudent.rollNumber.trim(),
      email: manualStudent.email?.trim() || '',
      password: manualStudent.password?.trim() || '',
      xp: Number(manualStudent.xp) || 0,
      progress: Number(manualStudent.progress) || 0,
    };

    try {
      if (editIndex !== null) {
        // Edit student
        const studentId = students[editIndex]._id;
        const res = await axios.put(
          `http://localhost:5000/api/courses/${courseId}/classes/${classId}/students/${studentId}`,
          studentData
        );
        const updatedStudents = [...students];
        updatedStudents[editIndex] = res.data.student;
        setStudents(updatedStudents);
        setEditIndex(null);
      } else {
        // Add new student
        const res = await axios.post(
          `http://localhost:5000/api/courses/${courseId}/classes/${classId}/students`,
          { students: [studentData] }
        );
        setStudents(prev => [...prev, ...res.data.students]);
      }
    } catch (err) {
      console.error('Error saving student in database:', err);
    }

    setManualStudent({ name: '', rollNumber: '', email: '', password: '', xp: 0, progress: 0 });
    setShowModal(false);
  };

  // Delete single student
  const handleDeleteStudent = async (index) => {
    const student = students[index];
    if (!student || !window.confirm(`Delete ${student.name}?`)) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/courses/${courseId}/classes/${classId}/students/${student._id}`
      );
      setStudents(students.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Error deleting student:', err);
    }
  };

  // Delete all students
  const handleDeleteAll = async () => {
    if (!classId || !window.confirm('Delete all students?')) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/courses/${courseId}/classes/${classId}/students`
      );
      setStudents([]);
    } catch (err) {
      console.error('Error deleting all students:', err);
    }
  };

  // Edit student
  const handleEditStudent = (index) => {
    const s = students[index];
    setManualStudent({ ...s });
    setEditIndex(index);
    setShowModal(true);
  };

  if (!course) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
      <a href="/mycourses" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 text-sm">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to My Courses
      </a>

      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{course.title}</h1>

      {/* Class Selector */}
      {course.classes.length > 1 && (
        <div className="mb-4">
          <label className="font-medium text-gray-700 mr-2">Select Class:</label>
          <select
            value={classId || ''}
            onChange={(e) => handleClassChange(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {course.classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Enrolled Students</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-xl"
            >
              <Upload className="w-5 h-5" />
              <span>Manage Students</span>
            </button>
            {students.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete All</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 text-gray-900 rounded-lg border border-gray-300"
          />
        </div>

        <div className="grid grid-cols-12 py-3 border-b-2 border-indigo-600/50 text-xs uppercase font-medium text-gray-600 tracking-wider">
          <span className="col-span-4">Student</span>
          <span className="col-span-3">Roll Number</span>
          <span className="col-span-2">XP Points</span>
          <span className="col-span-2">Progress</span>
          <span className="col-span-1">Actions</span>
        </div>

        {students.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <PlusCircle className="w-10 h-10 mx-auto mb-4 text-indigo-600" />
            <p className="text-lg font-medium text-gray-800">No Enrolled Students Found</p>
            <p className="mt-1">Upload CSV or add manually to populate students.</p>
          </div>
        ) : (
          students
            .filter(
              s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((s, i) => (
              <div key={s._id} className="grid grid-cols-12 py-3 border-b border-gray-200 text-gray-700 items-center">
                <span className="col-span-4">{s.name}</span>
                <span className="col-span-3">{s.rollNumber}</span>
                <span className="col-span-2">{s.xp}</span>
                <span className="col-span-2">{s.progress}</span>
                <span className="col-span-1 flex justify-center gap-2">
                  <button onClick={() => handleEditStudent(i)} className="text-indigo-600 hover:text-indigo-800">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteStudent(i)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </span>
              </div>
            ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-lg">
            <button onClick={() => { setShowModal(false); setEditIndex(null); }} className="absolute top-3 right-3 text-gray-500 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">{editIndex !== null ? 'Edit Student' : 'Add Students'}</h3>

            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">Upload CSV</label>
              <input type="file" accept=".csv" onChange={handleCSVUpload} className="w-full text-sm text-gray-600" />
            </div>

            <input type="text" placeholder="Name" value={manualStudent.name} onChange={(e) => setManualStudent({ ...manualStudent, name: e.target.value })} className="w-full border mb-2 px-3 py-2 rounded-lg" />
            <input type="text" placeholder="Roll Number" value={manualStudent.rollNumber} onChange={(e) => setManualStudent({ ...manualStudent, rollNumber: e.target.value })} className="w-full border mb-2 px-3 py-2 rounded-lg" />
            <input type="email" placeholder="Email" value={manualStudent.email} onChange={(e) => setManualStudent({ ...manualStudent, email: e.target.value })} className="w-full border mb-2 px-3 py-2 rounded-lg" />
            <input type="password" placeholder="Password" value={manualStudent.password} onChange={(e) => setManualStudent({ ...manualStudent, password: e.target.value })} className="w-full border mb-2 px-3 py-2 rounded-lg" />
            <input type="number" placeholder="XP" value={manualStudent.xp} onChange={(e) => setManualStudent({ ...manualStudent, xp: e.target.value })} className="w-full border mb-2 px-3 py-2 rounded-lg" />
            <input type="number" placeholder="Progress" value={manualStudent.progress} onChange={(e) => setManualStudent({ ...manualStudent, progress: e.target.value })} className="w-full border mb-4 px-3 py-2 rounded-lg" />

            <button onClick={handleAddOrEditStudent} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl">
              {editIndex !== null ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseStudents;
