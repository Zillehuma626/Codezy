import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { 
  BookOpen, FlaskConical, Users, Sparkles, Zap, TrendingUp, Lock, Unlock 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ labs: 0, students: 0 });
  const [teacherId, setTeacherId] = useState(null);
  const [teacherName, setTeacherName] = useState("");
  const [teacherLabs, setTeacherLabs] = useState([]);
  const [hoveredLab, setHoveredLab] = useState(null);

  // Fetch labs from all courses & classes
  const fetchTeacherLabs = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/courses/teacher/${id}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const coursesData = await res.json();

      const labsFromCourses = [];
      coursesData.forEach(course => {
        if (course.classes?.length) {
          course.classes.forEach(cl => {
            if (cl.labs?.length) {
              cl.labs.forEach(lab => {
                labsFromCourses.push({
                  ...lab,
                  courseTitle: course.title,
                  courseCode: course.courseCode,
                  className: cl.name,
                  students: cl.students?.length || 0
                });
              });
            }
          });
        }
      });

      setTeacherLabs(labsFromCourses);
    } catch (err) {
      console.error("Error fetching labs:", err);
      setTeacherLabs([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh function to pass to CreateLab
  const refreshLabs = () => {
    if (teacherId) fetchTeacherLabs(teacherId);
  };

  // Load teacher info
  useEffect(() => {
    const id = localStorage.getItem("userId");
    const name = localStorage.getItem("fullName");
    if (!id) return;

    setTeacherId(id);
    setTeacherName(name);
    fetchTeacherLabs(id);
  }, []);

  // Update stats
  useEffect(() => {
    const labsCount = teacherLabs?.length || 0;
    const studentsCount = teacherLabs?.reduce((total, lab) => total + (lab.students || 0), 0) || 0;
    setStats({ labs: labsCount, students: studentsCount });
  }, [teacherLabs]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">

      {/* Navbar stays unchanged */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xl">
              <span className="text-2xl">&lt;/&gt;</span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Codezy
              </span>
              <Sparkles className="text-yellow-500 animate-spin-slow" size={16} />
            </div>
            <div className="hidden md:flex space-x-8">
              <a className="py-5 px-1 text-indigo-600 font-medium" href="/dashboard">Dashboard</a>
              <a className="py-5 px-1 text-gray-600" href="/mycourses">My Courses</a>
              <a className="py-5 px-1 text-gray-600" href="/createlab">Create Lab</a>
              <a className="py-5 px-1 text-gray-600" href="/profile">Profile</a>
              <a className="py-5 px-1 text-gray-600" href="/loginpage">Logout</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left */}
          <div className="lg:col-span-2 space-y-6">

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-2xl p-6 text-white shadow-xl">
              <h1 className="text-2xl font-bold mb-1">
                Welcome back, {teacherName || "Teacher"}! 👋
              </h1>
              <p className="text-indigo-100">
                Ready to inspire your students today?
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[ 
                { icon: FlaskConical, label: 'Active Labs', value: stats.labs },
                { icon: Users, label: 'Total Students', value: stats.students }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className="text-indigo-600" size={24} />
                    <TrendingUp className="text-emerald-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* My Labs Display */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">My Labs</h2>
              </div>

              {loading ? (
                <p className="text-gray-500">Loading labs...</p>
              ) : teacherLabs.length === 0 ? (
                <p className="text-gray-500">You have no assigned labs.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {teacherLabs.map((lab, index) => (
                    <div 
                      key={lab._id || index}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 flex items-center gap-6 transform hover:scale-105 hover:shadow-xl transition-all duration-500"
                      onMouseEnter={() => setHoveredLab(lab._id)}
                      onMouseLeave={() => setHoveredLab(null)}
                    >
                      <div className="flex-shrink-0">
                        {lab.locked ? 
                          <Lock className="text-gray-500" size={28} /> : 
                          <Unlock className="text-green-500" size={28} />
                        }
                      </div>

                      <div className="flex-1 space-y-1">
                        <h3 className="font-bold text-lg text-gray-900">{lab.title}</h3>
                        <p className="text-sm text-gray-500">
                          {lab.courseTitle} ({lab.courseCode}) — Class: {lab.className}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(lab.status)}`}>
                            {lab.status || 'N/A'}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Users size={12} /> {lab.students || 0} students
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FlaskConical size={12} /> {lab.submissions || 0} submissions
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                          View Submissions
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Zap className="mr-2 text-yellow-500" size={18} />
                Quick Actions
              </h3>
              <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl">
                Upload Student List
              </button>
              <Link to="/createlab" state={{ refreshLabs }}>
                <button className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-xl">
                  Create New Lab
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
