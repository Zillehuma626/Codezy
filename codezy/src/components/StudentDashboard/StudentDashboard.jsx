import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  FlaskConical, 
  Award, 
  TrendingUp, 
  Users, 
  Clock, 
  Play,
  Star,
  Zap,
  Sparkles,
  Target,
  ChevronRight,
  Calendar,
  FileText
} from 'lucide-react';

const StudentDashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [activeLab, setActiveLab] = useState(null);
  const [stats, setStats] = useState({
    courses: 0,
    labs: 0,
    xp: 0,
    badges: 0
  });
  
  // Refs for scrolling
  const activeLabsRef = useRef(null);
  const myCoursesRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    
    // Animate stats counting up
    setTimeout(() => {
      setStats({
        courses: 8,
        labs: 12,
        xp: 2450,
        badges: 5
      });
    }, 500);
  }, []);

  const activeLabs = [
    {
      id: 1,
      title: 'Python Data Structures',
      course: 'Programming Fundamentals',
      progress: 75,
      dueDate: '2024-02-15',
      icon: '🐍',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 2,
      title: 'React Component Lab',
      course: 'Web Development',
      progress: 40,
      dueDate: '2024-02-20',
      icon: '⚛️',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      title: 'Database Queries',
      course: 'Database Systems',
      progress: 90,
      dueDate: '2024-02-12',
      icon: '🗄️',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const courses = [
    {
      id: 1,
      title: 'Programming Fundamentals',
      instructor: 'Dr. Sarah Malik',
      progress: 85,
      icon: '💻',
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms',
      instructor: 'Dr. Ali Ahmed',
      progress: 60,
      icon: '📊',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 3,
      title: 'Web Development',
      instructor: 'Dr. Rizwan Khan',
      progress: 45,
      icon: '🌐',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 4,
      title: 'Database Systems',
      instructor: 'Dr. Nida Shah',
      progress: 30,
      icon: '🗃️',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 5,
      title: 'Machine Learning',
      instructor: 'Dr. Farhan Ali',
      progress: 20,
      icon: '🤖',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 6,
      title: 'Mobile App Development',
      instructor: 'Dr. Zainab Ahmed',
      progress: 10,
      icon: '📱',
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  const badges = [
    { id: 1, name: 'Quick Learner', icon: '⚡', color: 'from-yellow-500 to-amber-500' },
    { id: 2, name: 'Code Master', icon: '👨‍💻', color: 'from-purple-500 to-indigo-500' },
    { id: 3, name: 'Bug Hunter', icon: '🐛', color: 'from-green-500 to-emerald-500' },
    { id: 4, name: 'Early Bird', icon: '🐦', color: 'from-blue-500 to-cyan-500' },
    { id: 5, name: 'Perfect Score', icon: '🎯', color: 'from-red-500 to-pink-500' }
  ];

  // Scroll to sections
  const scrollToActiveLabs = () => {
    if (activeLabsRef.current) {
      activeLabsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToMyCourses = () => {
    if (myCoursesRef.current) {
      myCoursesRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Floating particles background effect
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
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

  const statsVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.8 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, type: 'spring', stiffness: 100 }
    })
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.1, type: 'spring', stiffness: 100 }
    })
  };

  const progressBarVariants = {
    hidden: { width: 0 },
    visible: (progress) => ({
      width: `${progress}%`,
      transition: { delay: 1, duration: 1.5, ease: 'easeOut' }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/20 relative overflow-hidden">
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
              <button 
                onClick={scrollToActiveLabs}
                className="hover:text-indigo-600 transition cursor-pointer"
              >
                Active Labs
              </button>
              <button 
                onClick={scrollToMyCourses}
                className="hover:text-indigo-600 transition cursor-pointer"
              >
                My Courses
              </button>
              <a href="/login" className="hover:text-indigo-600 transition">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Banner */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-2xl mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
          <div className="relative z-10">
            <motion.h1 
              className="text-3xl font-bold mb-2"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome back, Ahmed! 
            </motion.h1>
            <motion.p 
              className="text-indigo-100 text-lg"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Ready to level up your coding skills today?
            </motion.p>
          </div>
          <motion.div
            className="absolute top-4 right-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="text-yellow-300" size={32} />
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: 'Total Courses', 
              value: stats.courses, 
              icon: BookOpen, 
              color: 'from-blue-500 to-cyan-500',
              change: '+2'
            },
            { 
              title: 'Active Labs', 
              value: stats.labs, 
              icon: FlaskConical, 
              color: 'from-emerald-500 to-green-500',
              change: '+3'
            },
            { 
              title: 'XP Points', 
              value: stats.xp, 
              icon: TrendingUp, 
              color: 'from-purple-500 to-pink-500',
              change: '+150'
            },
            { 
              title: 'Badges Earned', 
              value: stats.badges, 
              icon: Award, 
              color: 'from-amber-500 to-orange-500',
              change: '+1'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              custom={index}
              variants={statsVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
                  <TrendingUp size={14} />
                  <span>{stat.change}</span>
                </div>
              </div>
              <motion.p 
                className="text-2xl font-bold text-gray-900 mb-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Active Labs & Courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Labs Section */}
            <motion.div
              ref={activeLabsRef}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
            >
              <div className="p-6 border-b border-gray-200/50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="text-yellow-500" size={24} />
                  Active Labs
                </h2>
                <p className="text-gray-600 text-sm mt-1">Continue where you left off</p>
              </div>
              
              <div className="p-6 space-y-4">
                {activeLabs.map((lab, index) => (
                  <motion.div
                    key={lab.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.02, x: 5 }}
                    onHoverStart={() => setActiveLab(lab.id)}
                    onHoverEnd={() => setActiveLab(null)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      activeLab === lab.id 
                        ? 'border-indigo-300 bg-indigo-50/50 shadow-md' 
                        : 'border-gray-200/50 hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <motion.span 
                          className="text-2xl"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                        >
                          {lab.icon}
                        </motion.span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{lab.title}</h3>
                          <p className="text-gray-600 text-sm">{lab.course}</p>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-1 text-gray-500 text-sm"
                      >
                        <Calendar size={14} />
                        <span>Due {lab.dueDate}</span>
                      </motion.div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gray-900">{lab.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            custom={lab.progress}
                            variants={progressBarVariants}
                            initial="hidden"
                            animate="visible"
                            className={`h-2 rounded-full bg-gradient-to-r ${lab.color} shadow-lg`}
                          />
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm font-semibold"
                      >
                        <Play size={14} />
                        Continue
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* My Courses Section */}
            <motion.div
              ref={myCoursesRef}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
            >
              <div className="p-6 border-b border-gray-200/50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="text-indigo-600" size={24} />
                  My Courses
                </h2>
                <p className="text-gray-600 text-sm mt-1">Your learning journey</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="bg-white border border-gray-200/50 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <motion.span 
                            className="text-2xl"
                            whileHover={{ scale: 1.3, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {course.icon}
                          </motion.span>
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                              {course.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{course.instructor}</p>
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <ChevronRight className="text-indigo-600" />
                        </motion.div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gray-900">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            custom={course.progress}
                            variants={progressBarVariants}
                            initial="hidden"
                            animate="visible"
                            className={`h-2 rounded-full bg-gradient-to-r ${course.color} shadow-lg`}
                          />
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-gray-100 to-white text-gray-700 hover:text-indigo-700 border border-gray-300 hover:border-indigo-300 px-4 py-3 rounded-lg hover:shadow-md transition-all duration-300 font-semibold text-sm"
                      >
                        View Course
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - XP & Badges */}
          <div className="space-y-8">
            {/* XP Progress */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="text-green-600" size={24} />
                Level Progress
              </h2>
              
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring' }}
                  className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-lg"
                >
                  15
                </motion.div>
                <p className="text-gray-600 text-sm">Current Level</p>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">XP to next level</span>
                  <span className="font-semibold text-gray-900">550/1000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '55%' }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg"
                  />
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex justify-between text-sm text-gray-600"
              >
                <span>Level 15</span>
                <span>Level 16</span>
              </motion.div>
            </motion.div>

            {/* Badges Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="text-yellow-600" size={24} />
                Earned Badges
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.8, type: 'spring' }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="text-center group cursor-pointer"
                  >
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-r ${badge.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {badge.icon}
                    </motion.div>
                    <p className="text-sm font-semibold text-gray-900">{badge.name}</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                whileHover={{ scale: 1.05 }}
                className="w-full mt-6 bg-gradient-to-r from-gray-100 to-white text-gray-700 border border-gray-300 hover:border-indigo-300 px-4 py-3 rounded-lg hover:shadow-md transition-all duration-300 font-semibold text-sm"
              >
                View All Badges
              </motion.button>
            </motion.div>
          </div>
        </div>
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
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-float { animation: float 25s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
        .animate-shine { animation: shine 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default StudentDashboard;