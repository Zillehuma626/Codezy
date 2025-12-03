import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Plus, Users, FlaskConical, Calendar, MoreVertical, 
  Sparkles, Zap, TrendingUp, BookOpen, Clock 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyCoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [stats, setStats] = useState({ total: 0, active: 0, students: 0, labs: 0 });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchTeacherCourses = async () => {
    try {
      const teacherId = localStorage.getItem("userId");
      if (!teacherId) return;

      const res = await fetch(`http://localhost:5000/api/courses/teacher/${teacherId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCourses(data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeacherCourses(); }, []);

  // Flatten classes for easier display
  const flattenedCourses = [];
  courses.forEach(course => {
    if (course.classes?.length) {
      course.classes.forEach(cl => {
        flattenedCourses.push({ ...course, singleClass: cl });
      });
    } else {
      flattenedCourses.push(course);
    }
  });

  // Calculate stats
  useEffect(() => {
    const total = flattenedCourses.length;
    const active = flattenedCourses.filter(c => c.status === 'Active').length;
    const students = flattenedCourses.reduce((sum, course) => sum + (course.singleClass?.students?.length || 0), 0);
    const labs = flattenedCourses.reduce((sum, course) => sum + (course.labs?.length || 0), 0);
    setStats({ total, active, students, labs });
  }, [flattenedCourses]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredCourses = flattenedCourses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const StatsOverview = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { label: 'Total Courses', value: stats.total, icon: BookOpen, color: 'from-indigo-500 to-purple-500', change: '+0' },
        { label: 'Active Courses', value: stats.active, icon: Zap, color: 'from-emerald-500 to-green-500', change: '+0' },
        { label: 'Total Students', value: stats.students, icon: Users, color: 'from-cyan-500 to-blue-500', change: '+0' },
        { label: 'Active Labs', value: stats.labs, icon: FlaskConical, color: 'from-amber-500 to-orange-500', change: '+0' }
      ].map((stat, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
              <stat.icon className="text-white" size={24} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <TrendingUp size={14} />
              <span>{stat.change}</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1 animate-count">{stat.value}</p>
          <p className="text-gray-600 text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ rotate: 5, scale: 1.1 }} className="text-indigo-600 font-bold text-xl flex items-center cursor-pointer">
                <span className="text-2xl mr-1">&lt;/&gt;</span>
                <span>Codezy</span>
              </motion.div>
            </div>
            <div className="hidden md:flex space-x-8 font-medium">
              <a href="/teacher" className="hover:text-indigo-600 transition">Dashboard</a>
              <a href="/mycourses" className="text-indigo-600 border-b-2 border-indigo-600">My Courses</a>
              <a href="/createlab" className="hover:text-indigo-600 transition">Create Lab</a>
              <a href="/reports" className="hover:text-indigo-600 transition">Reports</a>
              <a href="/profile" className="hover:text-indigo-600 transition">Profile</a>
              <a href="/login" className="hover:text-indigo-600 transition">Logout</a>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <div className="text-center mb-8 transform hover:scale-105 transition-transform duration-500">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Courses
          </h1>
          <p className="text-gray-600 text-lg animate-pulse">
            Manage and monitor all your teaching courses with real-time insights
          </p>
        </div>

        <StatsOverview />

        {/* Search & Filter */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 mb-8 transform hover:scale-105 transition-all duration-500">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors duration-300" size={20} />
              <input
                type="text"
                placeholder="Search courses by title or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg"
              />
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative group flex-1 lg:flex-initial">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors duration-300" size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg appearance-none bg-white"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors">▼</div>
              </div>

              <button className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group whitespace-nowrap">
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold">New Course</span>
              </button>
            </div>
          </div>
        </div>

        {/* Courses List */}
        {loading ? (
          <p className="text-gray-500">Loading courses...</p>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-500">
            <p className="text-gray-500 text-xl font-semibold mb-2">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <div key={course._id + '-' + index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 transform hover:scale-105 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.courseCode}</p>
                    {course.singleClass && <p className="text-xs text-indigo-600 font-semibold mt-1">Class: {course.singleClass.name}</p>}
                  </div>
                  <MoreVertical size={20} className="text-gray-400" />
                </div>

                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100/50">
                  <div className="flex items-center gap-3">
                    <Users size={18} className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Students</p>
                      <p className="text-lg font-bold text-gray-900">{course.singleClass?.students?.length || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FlaskConical size={18} className="text-emerald-600" />
                    <div>
                      <p className="text-xs text-gray-500">Labs</p>
                      <p className="text-lg font-bold text-gray-900">{course.labs?.length || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      if (course.singleClass) {
                        navigate(`/courses/${course._id}/class/${course.singleClass._id}/students`);
                      } else {
                        alert("No class found for this course.");
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm font-semibold"
                  >
                    View Students
                  </button>
                  <button 
                    onClick={() => {
                      if (course.singleClass) {
                        navigate(`/courses/${course._id}/class/${course.singleClass._id}/labs`);
                      } else {
                        alert("No class found for this course.");
                      }
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 text-sm font-semibold"
                  >
                    Manage Labs
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
