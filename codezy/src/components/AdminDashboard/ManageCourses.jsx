// ManageCourses.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus, BookOpenCheck, User, Bell, LayoutDashboard, ListChecks, LineChart,
  CreditCard, MessageSquare, UserCog, X, LogOut
} from "lucide-react";

const API_COURSES = "http://localhost:5000/api/courses";
const API_TEACHERS = "http://localhost:5000/api/teachers";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } })
};

const defaultLab = { title: "", marks: 0, duration: "" };
const defaultClass = { id: `cls-${Date.now()}`, name: "", teacherId: "", labs: [] };
const defaultCourse = { title: "", courseCode: "", status: "Active", classes: [], labs: [] };

const Tabs = ({ tabs, selectedTab, setSelectedTab }) => (
  <div className="flex space-x-2 border-b border-gray-200 mb-3">
    {tabs.map(tab => (
      <button
        key={tab}
        onClick={() => setSelectedTab(tab)}
        className={`px-4 py-2 font-medium rounded-t-xl transition ${
          selectedTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

// Helper: update course on backend
const updateCourseBackend = async (course) => {
  try {
    const payload = {
      title: course.title,
      courseCode: course.courseCode,
      status: course.status,
      classes: course.classes.map(cls => ({
        name: cls.name,
        teacher: cls.teacherId || cls.teacher, // 👈 FIXED
        labs: cls.labs || []
      }))
    };

    await axios.put(`${API_COURSES}/${course._id}`, payload);
  } catch (err) {
    console.error("Failed to update course:", err);
  }
};


const CourseCard = ({ course, teachers, updateCourses }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Classes");

  const handleAddClass = () => {
    const newClass = { ...defaultClass, id: `cls-${Date.now()}` };
    const updated = { ...course, classes: [...course.classes, newClass] };
    updateCourses(prev => prev.map(c => c._id === course._id ? updated : c));
    updateCourseBackend(updated);
  };

  const handleAddLab = (classIdx) => {
    const newLab = { ...defaultLab };
    const updatedClasses = course.classes.map((cl, i) => i === classIdx ? { ...cl, labs: [...cl.labs, newLab] } : cl);
    const updated = { ...course, classes: updatedClasses };
    updateCourses(prev => prev.map(c => c._id === course._id ? updated : c));
    updateCourseBackend(updated);
  };

  const handleChangeClassField = (classIdx, field, value) => {
    const updatedClasses = course.classes.map((cl, i) => i === classIdx ? { ...cl, [field]: value } : cl);
    const updated = { ...course, classes: updatedClasses };
    updateCourses(prev => prev.map(c => c._id === course._id ? updated : c));
    updateCourseBackend(updated);
  };

  const handleChangeLabField = (classIdx, labIdx, field, value) => {
    const updatedClasses = course.classes.map((cl, i) => i === classIdx
      ? { ...cl, labs: cl.labs.map((l, j) => j === labIdx ? { ...l, [field]: value } : l) }
      : cl
    );
    const updated = { ...course, classes: updatedClasses };
    updateCourses(prev => prev.map(c => c._id === course._id ? updated : c));
    updateCourseBackend(updated);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="bg-white rounded-xl p-4 shadow-md border border-gray-100 relative hover:shadow-lg transition"
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(prev => !prev)}
      >
        <div className="flex items-center space-x-3">
          <BookOpenCheck size={24} className="text-indigo-600" />
          <div>
            <h2 className="font-bold text-lg">{course.title || "New Course"}</h2>
            <p className="text-gray-500 text-sm">{course.courseCode || "---"}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${course.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-500"}`}>
          {course.status}
        </span>
      </div>

      {expanded && (
        <div className="mt-4 border-t pt-3">
          <Tabs tabs={["Classes"]} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

          {selectedTab === "Classes" && (
            <div className="space-y-2">
              {course.classes.map((cls, idx) => (
                <div key={cls.id} className="bg-gray-50 p-3 rounded-lg shadow-sm space-y-2">
                  <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                    <input
                      type="text"
                      placeholder="Class Name"
                      className="border p-2 rounded-lg w-full md:w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                      value={cls.name}
                      onChange={e => handleChangeClassField(idx, "name", e.target.value)}
                    />
                    <select
                      value={cls.teacherId || ""}
                      className="border p-2 rounded-lg w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                      onChange={e => handleChangeClassField(idx, "teacherId", e.target.value)}
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(t => (
                        <option key={t._id} value={t._id}>
                          {t.name} ({t.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Labs */}
                  <div className="ml-2 mt-1">
                    <h4 className="font-medium">Labs</h4>
                    {cls.labs.map((lab, lIdx) => (
                      <div key={lIdx} className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 mt-1">
                        <input
                          type="text"
                          placeholder="Lab Title"
                          className="border p-2 rounded-lg w-full md:w-32 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                          value={lab.title}
                          onChange={e => handleChangeLabField(idx, lIdx, "title", e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Marks"
                          className="border p-2 rounded-lg w-full md:w-20 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                          value={lab.marks}
                          onChange={e => handleChangeLabField(idx, lIdx, "marks", Number(e.target.value))}
                        />
                        <input
                          type="text"
                          placeholder="Duration"
                          className="border p-2 rounded-lg w-full md:w-24 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                          value={lab.duration}
                          onChange={e => handleChangeLabField(idx, lIdx, "duration", e.target.value)}
                        />
                      </div>
                    ))}
                    <button onClick={() => handleAddLab(idx)} className="mt-1 px-2 py-1 rounded bg-yellow-600 text-white text-sm">+ Add Lab</button>
                  </div>
                </div>
              ))}
              <button onClick={handleAddClass} className="mt-2 px-3 py-1 rounded bg-blue-700 text-white">+ Add Class</button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

const ManageCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ ...defaultCourse });
  const [activeMenu, setActiveMenu] = useState("Manage Courses");

  useEffect(() => {
    const fetchData = async () => {
      const teachersRes = await axios.get(API_TEACHERS);
      setTeachers(teachersRes.data || []);
      const coursesRes = await axios.get(API_COURSES);
      setCourses(coursesRes.data || []);
    };
    fetchData();
  }, []);

  const handleAddClassModal = () => {
    setNewCourse(prev => ({ ...prev, classes: [...prev.classes, { ...defaultClass, id: `cls-${Date.now()}` }] }));
  };

  const handleAddLabModal = () => {
    setNewCourse(prev => ({ ...prev, labs: [...prev.labs, { ...defaultLab }] }));
  };

  const handleSaveCourse = async () => {
    if (!newCourse.title || !newCourse.courseCode) return alert("Please enter course title and code.");
    try {
      const payload = {
        title: newCourse.title,
        courseCode: newCourse.courseCode,
        status: newCourse.status,
        classes: newCourse.classes.map(cls => ({
          name: cls.name,
          teacher: cls.teacherId,
          labs: cls.labs
        })),
        labs: newCourse.labs
      };
      const res = await axios.post(API_COURSES, payload);
      setCourses(prev => [...prev, res.data]);
      setNewCourse({ ...defaultCourse });
      setShowAddCourse(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save course.");
    }
  };

  const sidebarItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Manage Teachers', icon: ListChecks },
    { label: 'Manage Courses', icon: BookOpenCheck },
    { label: 'View Progress', icon: LineChart },
    { label: 'Payment & Subscription', icon: CreditCard },
    { label: 'Feedback', icon: MessageSquare },
    { label: 'Contact Super Admin', icon: UserCog },
  ];

  const SidebarItem = ({ icon: Icon, label }) => {
    const isSelected = activeMenu === label;
    return (
      <motion.button
        onClick={() => {
          setActiveMenu(label);
          if (label === 'Manage Courses') navigate('/admin/courses');
          if (label === 'Manage Teachers') navigate('/admin/teachers');
          if (label === 'Dashboard') navigate('/admin');
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${isSelected ? 'bg-indigo-600/50 text-white' : 'hover:bg-blue-700/50 text-blue-200'}`}
      >
        <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-700' : 'bg-blue-800/70'}`}>
          <Icon size={20} className={isSelected ? 'text-white' : 'text-blue-200'} />
        </div>
        <span className="font-medium">{label}</span>
      </motion.button>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-700/50">
          <h1 className="text-2xl font-bold text-white">Codezy</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {sidebarItems.map(item => <SidebarItem key={item.label} icon={item.icon} label={item.label} />)}
        </nav>
        <a href="/login" className="m-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center justify-center">
          <LogOut size={18} className="mr-2" /> Logout
        </a>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="w-full bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <User size={20} className="text-gray-600" />
            </button>
          </div>
        </header>

        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Manage Courses</h1>
          <motion.button
            onClick={() => setShowAddCourse(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-xl shadow flex items-center gap-2 font-semibold"
          >
            <Plus size={16} /> Add New Course
          </motion.button>
        </div>

        <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} teachers={teachers} updateCourses={setCourses} />
          ))}
        </div>
      </main>

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Course</h2>
              <button onClick={() => setShowAddCourse(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Course Title"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                value={newCourse.title}
                onChange={e => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Course Code"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                value={newCourse.courseCode}
                onChange={e => setNewCourse(prev => ({ ...prev, courseCode: e.target.value }))}
              />
              <select
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                value={newCourse.status}
                onChange={e => setNewCourse(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Classes */}
              <div className="mt-2">
                <h3 className="font-semibold">Classes</h3>
                {newCourse.classes.map((cls, idx) => (
                  <div key={cls.id} className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 mt-1">
                    <input
                      type="text"
                      placeholder="Class Name"
                      className="border p-2 rounded-lg w-full md:w-32 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                      value={cls.name}
                      onChange={e => setNewCourse(prev => ({
                        ...prev,
                        classes: prev.classes.map((c, i) => i === idx ? { ...c, name: e.target.value } : c)
                      }))}
                    />
                    <select
                      value={cls.teacherId || ""}
                      className="border p-2 rounded-lg w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                      onChange={e => setNewCourse(prev => ({
                        ...prev,
                        classes: prev.classes.map((c, i) => i === idx ? { ...c, teacherId: e.target.value } : c)
                      }))}
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(t => (
                        <option key={t._id} value={t._id}>
                          {t.name} ({t.email})
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <button onClick={handleAddClassModal} className="mt-2 px-3 py-1 rounded bg-blue-700 text-white">+ Add Class</button>
              </div>

              {/* Labs */}
              <div className="mt-2">
                <h3 className="font-semibold">Labs</h3>
                {newCourse.labs.map((lab, idx) => (
                  <div key={idx} className="flex space-x-2 mt-1">
                    <input
                      type="text"
                      placeholder="Lab Title"
                      className="border p-2 rounded-lg w-full md:w-32 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                      value={lab.title}
                      onChange={e => setNewCourse(prev => ({
                        ...prev,
                        labs: prev.labs.map((l, i) => i === idx ? { ...l, title: e.target.value } : l)
                      }))}
                    />
                    <input
                      type="number"
                      placeholder="Marks"
                      className="border p-2 rounded-lg w-full md:w-20 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                      value={lab.marks}
                      onChange={e => setNewCourse(prev => ({
                        ...prev,
                        labs: prev.labs.map((l, i) => i === idx ? { ...l, marks: Number(e.target.value) } : l)
                      }))}
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      className="border p-2 rounded-lg w-full md:w-24 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                      value={lab.duration}
                      onChange={e => setNewCourse(prev => ({
                        ...prev,
                        labs: prev.labs.map((l, i) => i === idx ? { ...l, duration: e.target.value } : l)
                      }))}
                    />
                  </div>
                ))}
                <button onClick={handleAddLabModal} className="mt-2 px-3 py-1 rounded bg-yellow-600 text-white">+ Add Lab</button>
              </div>

              <button onClick={handleSaveCourse} className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl font-semibold">Save Course</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
