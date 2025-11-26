import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { BookOpen, FlaskConical, Users, Plus, Upload, FileText, Sparkles, Zap, TrendingUp } from 'lucide-react';

export default function TeacherDashboard() {
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [stats, setStats] = useState({ courses: 0, labs: 0, students: 0 });

  const courses = [
    {
      title: 'Programming Fundamentals',
      code: 'FA22-BCS-7B',
      status: 'Active',
      students: 32,
      labs: 8,
      statusColor: 'bg-emerald-100 text-emerald-700'
    },
    {
      title: 'Data Structures',
      code: 'FA22-BCS-5A',
      status: 'Active',
      students: 28,
      labs: 6,
      statusColor: 'bg-emerald-100 text-emerald-700'
    },
    {
      title: 'Web Development',
      code: 'SP23-BCS-3C',
      status: 'Pending',
      students: 25,
      labs: 4,
      statusColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      title: 'Database Systems',
      code: 'FA22-BCS-6A',
      status: 'Active',
      students: 30,
      labs: 5,
      statusColor: 'bg-emerald-100 text-emerald-700'
    }
  ];

  const notifications = [
    {
      title: 'Lab 2 Deadline Approaching',
      description: 'Programming Fundamentals lab due in 2 days',
      color: 'bg-red-50',
      icon: '🚨',
      urgent: true
    },
    {
      title: 'New Student Enrolled',
      description: 'Web Development has 1 new student',
      color: 'bg-blue-50',
      icon: '👤',
      urgent: false
    },
    {
      title: 'Lab 3 Grading Complete',
      description: 'All submissions reviewed',
      color: 'bg-green-50',
      icon: '✅',
      urgent: false
    }
  ];

  useEffect(() => {
    setMounted(true);
    
    // Animate stats counting up
    const timer = setTimeout(() => {
      setStats({ courses: 12, labs: 28, students: 345 });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Floating particles background effect
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-indigo-300/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <FloatingParticles />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-pink-500/15 rounded-full blur-3xl animate-pulse-slower"></div>

      {/* Navbar with Glass Morphism */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="text-indigo-600 font-bold text-xl flex items-center transform hover:scale-105 transition-transform duration-300">
                <span className="text-2xl mr-1 animate-pulse">&lt;/&gt;</span>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Codezy
                </span>
                <Sparkles className="ml-1 text-yellow-500 animate-spin-slow" size={16} />
              </div>
            </div>
            <div className="hidden md:flex space-x-8">
              {['Dashboard', 'My Courses', 'Create Lab', 'Reports', 'Profile', 'Logout'].map((item, index) => (
                <a
                  key={item}
                  href={item === 'Dashboard' ? '/dashboard' : 
                        item === 'Logout' ? '/loginpage' : 
                        `/${item.toLowerCase().replace(' ', '')}`}
                  className={`relative py-5 px-1 font-medium transition-all duration-300 transform hover:scale-105 ${
                    item === 'Dashboard' 
                      ? 'text-indigo-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item}
                  {item === 'Dashboard' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Banner with Enhanced Animation */}
            <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-2xl p-6 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-500 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative z-10">
                <h1 className="text-2xl font-bold mb-1 animate-fade-in-up">
                  Welcome back, Prof. Ali! 👋
                </h1>
                <p className="text-indigo-100 animate-fade-in-up animation-delay-200">
                  Ready to inspire your students today?
                </p>
              </div>
              <div className="absolute top-4 right-4 animate-bounce-slow">
                <Zap className="text-yellow-300" size={24} />
              </div>
            </div>

            {/* Stats Cards with Counting Animation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: BookOpen, color: 'text-indigo-600', label: 'Total Courses', value: stats.courses },
                { icon: FlaskConical, color: 'text-emerald-600', label: 'Active Labs', value: stats.labs },
                { icon: Users, color: 'text-cyan-600', label: 'Total Students', value: stats.students }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                  onMouseEnter={() => setHoveredCard(`stat-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <stat.icon 
                        className={`${stat.color} transform group-hover:scale-110 transition-transform duration-300`} 
                        size={24} 
                      />
                      <TrendingUp className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={16} />
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 animate-count">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* My Courses Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 animate-fade-in-left">
                  My Courses
                </h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group">
                  <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                  <span>New Course</span>
                </button>
              </div>

              {/* Course Cards Grid with Staggered Animation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.map((course, index) => (
                  <div 
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/20 transform hover:scale-105 hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                    onMouseEnter={() => setHoveredCard(`course-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-700 transition-colors duration-300">
                          {course.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold transform group-hover:scale-110 transition-transform duration-300 ${course.statusColor}`}>
                          {course.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mb-4 transform group-hover:translate-x-2 transition-transform duration-300">
                        {course.code}
                      </p>

                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100/50">
                        <div className="text-center transform group-hover:scale-110 transition-transform duration-300">
                          <p className="text-gray-500 text-xs mb-1">Students</p>
                          <p className="text-2xl font-bold text-gray-900">{course.students}</p>
                        </div>
                        <div className="text-center transform group-hover:scale-110 transition-transform duration-300">
                          <p className="text-gray-500 text-xs mb-1">Labs</p>
                          <p className="text-2xl font-bold text-gray-900">{course.labs}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {['Manage Students', 'Manage Labs', 'View Reports'].map((action, actionIndex) => (
                          <button 
                            key={actionIndex}
                            className="text-xs text-gray-600 hover:text-indigo-600 font-medium transform hover:scale-105 transition-all duration-300 px-2 py-1 rounded-lg hover:bg-indigo-50"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Zap className="mr-2 text-yellow-500 animate-pulse" size={18} />
                Quick Actions
              </h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group">
                  <Upload size={18} className="group-hover:animate-bounce" />
                  <span>Upload Student List</span>
                </button>
                <Link to="/createlab">
                  <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Create New Lab</span>
                  </button>
                </Link>
                {/* Added space between buttons and fixed View Reports redirect */}
                <div className="mt-2"></div>
                <Link to="/reports">
                  <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group">
                    <FileText size={18} className="group-hover:animate-pulse" />
                    <span>View Reports</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
              <h3 className="font-bold text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-xl ${notification.color} border-l-4 ${
                      notification.urgent 
                        ? 'border-red-400 animate-pulse' 
                        : 'border-blue-400'
                    } transform hover:scale-105 transition-all duration-300 group cursor-pointer`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="text-lg transform group-hover:scale-110 transition-transform duration-300">
                        {notification.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">{notification.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes count {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
        .animate-fade-in-left { animation: fadeInLeft 0.6s ease-out; }
        .animate-count { animation: count 0.5s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animation-delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  );
}