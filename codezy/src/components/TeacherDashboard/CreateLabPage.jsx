import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Plus, Trash2, Calendar, Clock, FileText, Code, Sparkles, Zap, Upload, Download, Eye } from 'lucide-react';

const CreateLabPage = () => {
  const [labData, setLabData] = useState({
    title: '',
    course: '',
    description: '',
    dueDate: '',
    dueTime: '',
    totalMarks: '',
    instructions: '',
    difficulty: 'Medium'
  });

  const [tasks, setTasks] = useState([
    { id: 1, title: '', marks: '', description: '' }
  ]);

  const [resources, setResources] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const courses = [
    'Programming Fundamentals',
    'Data Structures',
    'Web Development',
    'Database Systems',
    'Operating Systems',
    'Computer Networks'
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Refs for scrolling
  const tasksSectionRef = React.useRef(null);
  const instructionsSectionRef = React.useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLabData(prev => ({ ...prev, [name]: value }));
  };

  const handleTaskChange = (id, field, value) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: '',
      marks: '',
      description: ''
    };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (id) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Lab Data:', labData);
    console.log('Tasks:', tasks);
    console.log('Resources:', resources);
    
    setIsSubmitting(false);
    alert('Lab created successfully!');
  };

  // Scroll to sections
  const scrollToSection = (section) => {
    setActiveSection(section);
    
    if (section === 'tasks' && tasksSectionRef.current) {
      tasksSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else if (section === 'instructions' && instructionsSectionRef.current) {
      instructionsSectionRef.current.scrollIntoView({ 
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

  const ProgressIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {['basic', 'tasks', 'instructions'].map((section, index) => (
        <React.Fragment key={section}>
          <div 
            className={`flex flex-col items-center cursor-pointer transition-all duration-500 ${
              activeSection === section ? 'scale-110' : 'scale-100'
            }`}
            onClick={() => scrollToSection(section)}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
              activeSection === section 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'border-gray-300 text-gray-400'
            }`}>
              {index + 1}
            </div>
            <span className={`text-xs mt-2 font-medium capitalize transition-colors duration-300 ${
              activeSection === section ? 'text-indigo-600' : 'text-gray-500'
            }`}>
              {section}
            </span>
          </div>
          {index < 2 && (
            <div className={`w-16 h-1 mx-2 transition-all duration-500 ${
              activeSection === section ? 'bg-indigo-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <FloatingParticles />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slower"></div>

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
              <a href="/mycourses" className="hover:text-indigo-600 transition">
                My Courses
              </a>
              <a href="/createlab" className="hover:text-indigo-600 transition">
                Create Lab
              </a>
              <span className="text-indigo-600 border-b-2 border-indigo-600">
                Reports
              </span>
              <a href="profile" className="hover:text-indigo-600 transition">
                Profile
              </a>
              <a href="loginpage" className="hover:text-indigo-600 transition">
                Logout
              </a>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-6xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 transform hover:scale-105 transition-transform duration-500">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Create New Lab
          </h1>
          <p className="text-gray-600 text-lg animate-pulse">
            Design and assign a new lab to your students with interactive features
          </p>
          <div className="flex justify-center mt-4">
            <Sparkles className="text-yellow-500 animate-spin-slow" size={24} />
          </div>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div 
            className={`bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 transform transition-all duration-700 ${
              activeSection === 'basic' ? 'scale-100 opacity-100' : 'scale-95 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
                  <FileText size={28} className="text-white" />
                </div>
                Basic Information
              </h2>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium animate-pulse">
                Required
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Zap size={16} className="text-yellow-500" />
                  Lab Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={labData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Sorting Algorithms Implementation"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  required
                />
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Course *
                </label>
                <select
                  name="course"
                  value={labData.course}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg appearance-none bg-white"
                  required
                >
                  <option value="">Choose a course</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors">
                  ▼
                </div>
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Difficulty Level
                </label>
                <select
                  name="difficulty"
                  value={labData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg"
                >
                  <option value="Easy">🎯 Easy</option>
                  <option value="Medium">⚡ Medium</option>
                  <option value="Hard">🔥 Hard</option>
                </select>
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-600" />
                  Due Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
                  <input
                    type="date"
                    name="dueDate"
                    value={labData.dueDate}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg"
                    required
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-indigo-600" />
                  Due Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
                  <input
                    type="time"
                    name="dueTime"
                    value={labData.dueTime}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Description
                </label>
                <textarea
                  name="description"
                  value={labData.description}
                  onChange={handleInputChange}
                  placeholder="Provide an overview of the lab objectives and requirements..."
                  rows="4"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div 
            ref={tasksSectionRef}
            className={`bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 transform transition-all duration-700 ${
              activeSection === 'tasks' ? 'scale-100 opacity-100' : 'scale-95 opacity-70'
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg">
                  <Code size={28} className="text-white" />
                </div>
                Lab Tasks
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({tasks.length} task{tasks.length !== 1 ? 's' : ''})
                </span>
              </h2>
              <button
                type="button"
                onClick={addTask}
                className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                Add Task
              </button>
            </div>

            <div className="space-y-6">
              {tasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className="border-2 border-gray-200 rounded-2xl p-6 bg-white/50 backdrop-blur-sm transform hover:scale-105 hover:shadow-xl transition-all duration-500 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">Task {index + 1}</h3>
                    </div>
                    {tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        className="text-red-500 hover:text-red-700 transform hover:scale-110 transition-all duration-300 p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Title
                      </label>
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => handleTaskChange(task.id, 'title', e.target.value)}
                        placeholder="e.g., Implement Bubble Sort"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marks
                      </label>
                      <input
                        type="number"
                        value={task.marks}
                        onChange={(e) => handleTaskChange(task.id, 'marks', e.target.value)}
                        placeholder="10"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300"
                      />
                    </div>
                    <div className="md:col-span-3 group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Description
                      </label>
                      <textarea
                        value={task.description}
                        onChange={(e) => handleTaskChange(task.id, 'description', e.target.value)}
                        placeholder="Describe what students need to do..."
                        rows="3"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div 
            ref={instructionsSectionRef}
            className={`bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 transform transition-all duration-700 ${
              activeSection === 'instructions' ? 'scale-100 opacity-100' : 'scale-95 opacity-70'
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-lg">
                <FileText size={28} className="text-white" />
              </div>
              Additional Instructions
            </h2>
            <div className="group">
              <textarea
                name="instructions"
                value={labData.instructions}
                onChange={handleInputChange}
                placeholder="Add any additional instructions, submission guidelines, or grading criteria..."
                rows="6"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg resize-none"
              ></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6 justify-center pt-8">
            <button
              type="button"
              className="flex items-center gap-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold">Cancel</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="font-semibold">Creating...</span>
                </>
              ) : (
                <>
                  <Save size={20} className="group-hover:animate-bounce" />
                  <span className="font-semibold">Create Lab</span>
                </>
              )}
            </button>
          </div>
        </form>
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
        .animate-float { animation: float 25s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
};

export default CreateLabPage;