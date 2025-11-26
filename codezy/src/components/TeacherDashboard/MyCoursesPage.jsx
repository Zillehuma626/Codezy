import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Users, FlaskConical, Calendar, MoreVertical, Sparkles, Zap, TrendingUp, BookOpen, Clock } from 'lucide-react';

const MyCoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [mounted, setMounted] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, students: 0, labs: 0 });

  const courses = [
    {
      id: 1,
      title: 'Programming Fundamentals',
      code: 'FA22-BCS-7B',
      status: 'Active',
      students: 32,
      labs: 8,
      semester: 'Fall 2022',
      progress: 75,
      lastActivity: '2 hours ago',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Data Structures',
      code: 'FA22-BCS-5A',
      status: 'Active',
      students: 28,
      labs: 6,
      semester: 'Fall 2022',
      progress: 60,
      lastActivity: '5 hours ago',
      color: 'from-emerald-500 to-green-500'
    },
    {
      id: 3,
      title: 'Web Development',
      code: 'SP23-BCS-3C',
      status: 'Pending',
      students: 25,
      labs: 4,
      semester: 'Spring 2023',
      progress: 40,
      lastActivity: '1 day ago',
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 4,
      title: 'Database Systems',
      code: 'FA22-BCS-6A',
      status: 'Active',
      students: 30,
      labs: 5,
      semester: 'Fall 2022',
      progress: 85,
      lastActivity: '3 hours ago',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 5,
      title: 'Operating Systems',
      code: 'SP23-BCS-4B',
      status: 'Completed',
      students: 35,
      labs: 10,
      semester: 'Spring 2023',
      progress: 100,
      lastActivity: '2 weeks ago',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 6,
      title: 'Computer Networks',
      code: 'FA22-BCS-8A',
      status: 'Active',
      students: 29,
      labs: 7,
      semester: 'Fall 2022',
      progress: 55,
      lastActivity: '4 hours ago',
      color: 'from-red-500 to-rose-500'
    }
  ];

  useEffect(() => {
    setMounted(true);
    
    // Animate stats counting up
    const timer = setTimeout(() => {
      const total = courses.length;
      const active = courses.filter(c => c.status === 'Active').length;
      const students = courses.reduce((sum, course) => sum + course.students, 0);
      const labs = courses.reduce((sum, course) => sum + course.labs, 0);
      
      setStats({ total, active, students, labs });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Floating particles background effect
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-indigo-300/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${20 + Math.random() * 15}s`
          }}
        />
      ))}
    </div>
  );

  const StatsOverview = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { 
          label: 'Total Courses', 
          value: stats.total, 
          icon: BookOpen, 
          color: 'from-indigo-500 to-purple-500',
          change: '+2'
        },
        { 
          label: 'Active Courses', 
          value: stats.active, 
          icon: Zap, 
          color: 'from-emerald-500 to-green-500',
          change: '+1'
        },
        { 
          label: 'Total Students', 
          value: stats.students, 
          icon: Users, 
          color: 'from-cyan-500 to-blue-500',
          change: '+15'
        },
        { 
          label: 'Active Labs', 
          value: stats.labs, 
          icon: FlaskConical, 
          color: 'from-amber-500 to-orange-500',
          change: '+8'
        }
      ].map((stat, index) => (
        <div 
          key={index}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
              <stat.icon className="text-white" size={24} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <TrendingUp size={14} />
              <span>{stat.change}</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1 animate-count">
            {stat.value}
          </p>
          <p className="text-gray-600 text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="text-indigo-600 font-bold text-xl flex items-center cursor-pointer"
              >
                <span className="text-2xl mr-1">&lt;/&gt;</span>
                <span>Codezy</span>
              </motion.div>
            </div>
            <div className="hidden md:flex space-x-8 font-medium">
              <a href="/dashboard" className="hover:text-indigo-600 transition">
                Dashboard
              </a>
              <a href="/mycourses" className="text-indigo-600 border-b-2 border-indigo-600">
                My Courses
              </a>
              <a href="/createlab" className="hover:text-indigo-600 transition">
                Create Lab
              </a>
              <a href="/reports" className="hover:text-indigo-600 transition">
                Reports
              </a>
              <a href="/profile" className="hover:text-indigo-600 transition">
                Profile
              </a>
              <a href="/loginpage" className="hover:text-indigo-600 transition">
                Logout
              </a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Animated Background Elements */}
      <FloatingParticles />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slower"></div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 transform hover:scale-105 transition-transform duration-500">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Courses
          </h1>
          <p className="text-gray-600 text-lg animate-pulse">
            Manage and monitor all your teaching courses with real-time insights
          </p>
          <div className="flex justify-center mt-4">
            <Sparkles className="text-yellow-500 animate-spin-slow" size={24} />
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Actions Bar */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 mb-8 transform hover:scale-105 transition-all duration-500">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
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

            {/* Filter and Actions */}
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
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors">
                  ▼
                </div>
              </div>

              {/* New Course Button */}
              <button className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group whitespace-nowrap">
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold">New Course</span>
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <div 
              key={course.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 transform hover:scale-105 hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
              onMouseEnter={() => setHoveredCourse(course.id)}
              onMouseLeave={() => setHoveredCourse(null)}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Header */}
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors duration-300">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 transform group-hover:translate-x-2 transition-transform duration-300">
                    {course.code}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transform hover:scale-110 transition-all duration-300 p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Status & Semester */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(course.status)} transform group-hover:scale-105 transition-transform duration-300`}>
                  {course.status}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1 transform group-hover:translate-x-2 transition-transform duration-300">
                  <Calendar size={14} />
                  {course.semester}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4 relative z-10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Course Progress</span>
                  <span className="font-semibold text-gray-900">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${course.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100/50 relative z-10">
                <div className="flex items-center gap-3 transform group-hover:scale-105 transition-transform duration-300">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Students</p>
                    <p className="text-lg font-bold text-gray-900">{course.students}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 transform group-hover:scale-105 transition-transform duration-300">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <FlaskConical size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Labs</p>
                    <p className="text-lg font-bold text-gray-900">{course.labs}</p>
                  </div>
                </div>
              </div>

              {/* Last Activity */}
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <Clock size={14} className="text-gray-400" />
                <p className="text-xs text-gray-500">Last activity: {course.lastActivity}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 relative z-10">
                <button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm font-semibold">
                  View Details
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 text-sm font-semibold">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-500">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-500 text-xl font-semibold mb-2">No courses found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => { setSearchTerm(''); setFilterStatus('All'); }}
              className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes count {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float { animation: float 25s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-count { animation: count 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default MyCoursesPage;