import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  LogOut, 
  Bell, 
  Settings, 
  Users, 
  BookOpen, 
  Edit2, 
  Trash2, 
  Menu,
  X,
  TrendingUp,
  UserCheck,
  Sparkles,
  Zap,
  Shield,
  Download,
  Upload,
  Filter,
  MoreVertical,
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const [stats, setStats] = useState({ faculty: 0, students: 0 });
  const [activePanel, setActivePanel] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Animate stats counting
    setTimeout(() => {
      setStats({ faculty: 14, students: 312 });
    }, 500);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { icon: Bell, label: 'Make Announcement', color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, label: 'Create Competition', color: 'from-green-500 to-emerald-500' },
    { icon: Settings, label: 'Advanced Management', color: 'from-orange-500 to-red-500' }
  ];

  const facultyMembers = [
    {
      id: 1,
      initials: 'SM',
      name: 'Dr. Sarah Malik',
      position: 'Professor',
      classesManaged: 8,
      joinDate: '2018-03-15',
      subjects: [
        { name: 'PF', status: 'Active' },
        { name: 'OOP', status: 'Active' },
        { name: 'ICT', status: 'Pending' }
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      initials: 'AA',
      name: 'Dr. Ali Ahmed',
      position: 'Associate Professor',
      classesManaged: 6,
      joinDate: '2019-08-22',
      subjects: [
        { name: 'DSA', status: 'Active' },
        { name: 'AI', status: 'Active' }
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      initials: 'RK',
      name: 'Dr. Rizwan Khan',
      position: 'Assistant Professor',
      classesManaged: 5,
      joinDate: '2020-01-10',
      subjects: [
        { name: 'ML', status: 'Active' },
        { name: 'PF', status: 'Pending' }
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      initials: 'NS',
      name: 'Dr. Nida Shah',
      position: 'Professor',
      classesManaged: 7,
      joinDate: '2017-11-05',
      subjects: [
        { name: 'OOP', status: 'Active' },
        { name: 'ICT', status: 'Active' }
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 5,
      initials: 'FA',
      name: 'Dr. Farhan Ali',
      position: 'Lecturer',
      classesManaged: 4,
      joinDate: '2021-06-18',
      subjects: [
        { name: 'DSA', status: 'Active' },
        { name: 'AI', status: 'Pending' }
      ],
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 6,
      initials: 'ZA',
      name: 'Dr. Zainab Ahmed',
      position: 'Associate Professor',
      classesManaged: 6,
      joinDate: '2019-09-30',
      subjects: [
        { name: 'ML', status: 'Active' },
        { name: 'PF', status: 'Active' }
      ],
      color: 'from-teal-500 to-green-500'
    }
  ];

  // Handle menu item clicks
  const handleMenuItemClick = (label) => {
    setActivePanel(label);
    console.log(`Opening panel for: ${label}`);
    // Here you would typically open a modal or navigate to a specific panel
    // For now, we'll just log it and set the active panel
  };

  // Floating particles background effect
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-blue-300/30 rounded-full animate-float"
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

  const sidebarVariants = {
    open: { 
      x: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      x: '-100%', 
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };

  const navbarVariants = {
    hidden: { 
      y: -100, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 20,
        duration: 0.8
      } 
    }
  };

  const statsVariants = {
    hidden: { 
      y: 50, 
      opacity: 0,
      scale: 0.8
    },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        delay: i * 0.2, 
        type: 'spring', 
        stiffness: 100,
        damping: 15
      }
    })
  };

  const cardVariants = {
    hidden: { 
      y: 30, 
      opacity: 0,
      rotateX: -15
    },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: { 
        delay: i * 0.15, 
        type: 'spring', 
        stiffness: 100,
        damping: 15
      }
    })
  };

  const menuItemVariants = {
    hidden: { 
      x: -50, 
      opacity: 0,
      scale: 0.8
    },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        delay: i * 0.1, 
        type: 'spring', 
        stiffness: 200,
        damping: 20
      }
    })
  };

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25';
  };

  const countUpVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 200, damping: 15 }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <FloatingParticles />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slower"></div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial={isMobile ? "closed" : "open"}
        animate={sidebarOpen || !isMobile ? "open" : "closed"}
        className="fixed md:relative z-50 w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white flex flex-col h-full shadow-2xl"
      >
        {/* Logo */}
        <motion.div 
          className="p-6 border-b border-blue-700/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ 
                scale: 1.05,
                rotate: 5,
                transition: { type: 'spring', stiffness: 300 }
              }}
            >
              <span className="text-blue-900 font-bold text-xl">&lt;/&gt;</span>
            </motion.div>
            <div>
              <motion.h1 
                className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                Codezy
              </motion.h1>
              <motion.p 
                className="text-blue-300/80 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                An powered coding lab
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-3">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              custom={index}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ 
                scale: 1.02,
                x: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transition: { type: 'spring', stiffness: 400 }
              }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setActiveMenu(item.label)}
              onHoverEnd={() => setActiveMenu('')}
              onClick={() => handleMenuItemClick(item.label)}
              className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-blue-200 hover:text-white transition-all duration-300 relative overflow-hidden ${
                activeMenu === item.label ? 'shadow-lg' : ''
              }`}
            >
              {/* Animated Background */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 rounded-xl`}
                animate={{ opacity: activeMenu === item.label ? 0.1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color} shadow-lg`}>
                <item.icon size={20} className="text-white" />
              </div>
              <span className="font-medium">{item.label}</span>
              
              {/* Hover Sparkle */}
              <AnimatePresence>
                {activeMenu === item.label && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute right-4"
                  >
                    <Sparkles size={16} className="text-yellow-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </nav>

        {/* Logout Button */}
        <motion.div 
          className="p-4 border-t border-blue-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <a href="/loginpage">
            <motion.button
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(220, 38, 38, 0.9)',
                transition: { type: 'spring', stiffness: 400 }
              }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 group"
            >
              <motion.div
                animate={{ x: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <LogOut size={18} />
              </motion.div>
              <span className="font-semibold">Logout</span>
            </motion.button>
          </a>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <motion.nav
          variants={navbarVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/60 sticky top-0 z-30"
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
              <motion.h1 
                className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                Admin Dashboard
              </motion.h1>
            </div>

            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-white rounded-2xl px-4 py-2 shadow-lg border border-gray-200/50 cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  A
                </motion.div>
                <span className="text-gray-700 font-semibold">Admin</span>
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={14} className="text-yellow-500" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.nav>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {/* Active Panel Indicator */}
          <AnimatePresence>
            {activePanel && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="text-yellow-300" size={24} />
                    <div>
                      <h3 className="font-bold text-lg">{activePanel} Panel</h3>
                      <p className="text-blue-100 text-sm">Manage your {activePanel.toLowerCase()} settings</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActivePanel(null)}
                    className="text-white hover:text-yellow-300 transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {[
              {
                title: 'Total Faculty Members',
                value: stats.faculty,
                icon: Users,
                color: 'from-blue-500 to-cyan-500',
                change: '+2.5%'
              },
              {
                title: 'Total Students Enrolled',
                value: stats.students,
                icon: BookOpen,
                color: 'from-green-500 to-emerald-500',
                change: '+3.2%'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                custom={index}
                variants={statsVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  rotateY: 5,
                  transition: { type: 'spring', stiffness: 300 }
                }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
                      <motion.p 
                        className="text-4xl font-bold text-gray-900"
                        variants={countUpVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div 
                      className={`p-4 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className="text-white" size={28} />
                    </motion.div>
                  </div>
                  <motion.div 
                    className="mt-4 flex items-center text-sm text-green-600 font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.3 + 0.5 }}
                  >
                    <TrendingUp size={16} className="mr-2" />
                    <span>{stat.change} from last month</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Faculty Access List */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: 'spring' }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <motion.h2 
                  className="text-2xl font-bold text-gray-900 flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg">
                    <UserCheck className="text-white" size={24} />
                  </div>
                  Faculty Access List
                </motion.h2>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <motion.div 
                    className="relative group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder="Search faculty..."
                      className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 w-full group-hover:shadow-lg"
                    />
                  </motion.div>
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 20px 25px -5px rgba(6, 182, 212, 0.3)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-cyan-500/25 font-semibold"
                  >
                    <motion.div
                      animate={{ rotate: [0, 180, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Plus size={20} />
                    </motion.div>
                    <span>Add Faculty</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Faculty Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {facultyMembers.map((faculty, index) => (
                  <motion.div
                    key={faculty.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ 
                      scale: 1.03,
                      y: -8,
                      rotateY: 5,
                      transition: { type: 'spring', stiffness: 300 }
                    }}
                    className="bg-white border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                  >
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${faculty.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    {/* Faculty Header */}
                    <div className="flex items-center space-x-4 mb-4 relative z-10">
                      <motion.div 
                        className={`w-14 h-14 bg-gradient-to-r ${faculty.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {faculty.initials}
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-gray-800 transition-colors">
                          {faculty.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{faculty.position}</p>
                      </div>
                    </div>

                    {/* Classes Managed */}
                    <div className="flex items-center space-x-3 mb-4 text-gray-600 relative z-10">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <UserCheck size={16} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">Total classes managed: {faculty.classesManaged}</span>
                    </div>

                    {/* Subjects */}
                    <div className="mb-4 relative z-10">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Subjects:</p>
                      <div className="flex flex-wrap gap-2">
                        {faculty.subjects.map((subject, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + idx * 0.1 }}
                            className="flex items-center space-x-1"
                          >
                            <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-medium border border-gray-200">
                              {subject.name}
                            </span>
                            <motion.span 
                              className={`text-xs px-3 py-1.5 rounded-lg font-semibold border ${getStatusColor(subject.status)}`}
                              whileHover={{ scale: 1.1 }}
                            >
                              {subject.status}
                            </motion.span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100/50 relative z-10">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.2, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-blue-600 transition-colors duration-200 p-2 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-green-600 transition-colors duration-200 p-2 hover:bg-green-50 rounded-lg"
                        >
                          <Eye size={18} />
                        </motion.button>
                      </div>
                      <motion.button
                        whileHover={{ 
                          scale: 1.05,
                          x: 5
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors duration-200 flex items-center space-x-1 group"
                      >
                        <span>View Profile</span>
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
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
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;