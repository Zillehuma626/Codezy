import React from 'react';
import { 
  ArrowRight, 
  Check, 
  Monitor, 
  GraduationCap, 
  Zap, 
  Cpu, 
  Users, 
  BarChart3,
  Trophy,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroIllustration = () => (
  <div className="relative w-full h-80 lg:h-full bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-3xl overflow-hidden shadow-2xl">
    <img 
      src="../assets/landingpage.png" 
      alt="Students collaborating on coding projects" 
      className="w-full h-full object-cover p-4 rounded-3xl" 
    />
    <div className="absolute top-5 right-5 bg-white p-2 rounded-xl shadow-lg flex items-center space-x-2" />
  </div>
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const FeatureList = ({ items }) => (
  <ul className="space-y-4">
    {items.map((item, index) => (
      <motion.li
        key={index}
        className="flex items-start space-x-3 text-gray-600"
        variants={itemVariants}
      >
        <Check size={20} className="text-green-500 mt-1 flex-shrink-0" />
        <span className="font-medium">{item}</span>
      </motion.li>
    ))}
  </ul>
);

export default function LandingPage() {
  const navigate = useNavigate();

  const goToLogin = () => navigate('/login');
  const goToSubscription = () => navigate('/subscription');

  const individualFeatures = [
    "Self-paced interactive courses",
    "AI-powered code feedback & hints",
    "Achievement badges & certificates",
    "Progress tracking & analytics",
    "24/7 community support"
  ];

  const institutionalFeatures = [
    "Advanced teacher dashboard",
    "Real-time lab management",
    "Student progress analytics",
    "Collaborative coding environments",
    "Custom curriculum builder"
  ];

  return (
    <motion.div 
      className="min-h-screen bg-white font-sans overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Navbar */}
      <motion.nav className="sticky top-0 bg-white/90 backdrop-blur-sm shadow-md z-50" variants={itemVariants}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-indigo-600">&lt;/&gt;</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Codezy</span>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={goToLogin}
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>

            <motion.button
              onClick={goToLogin}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-full font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <div className="space-y-6">
            <motion.h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight" variants={itemVariants}>
              Empowering the Next <br />
              Generation of 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 ml-3">Coders</span>
            </motion.h1>

            <motion.p className="text-lg text-gray-600 max-w-lg" variants={itemVariants}>
              An intelligent platform for learning, teaching, and managing coding labs with AI assistance. Transform your coding education experience with personalized learning paths and real-time feedback.
            </motion.p>
            
            <motion.div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 pt-4" variants={itemVariants}>
              <motion.button
                onClick={goToLogin}
                className="flex items-center space-x-3 bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-xl shadow-indigo-500/40 hover:bg-indigo-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Learning</span>
                <ArrowRight size={20} />
              </motion.button>

              <motion.button
                className="flex items-center justify-center space-x-3 text-indigo-600 border-2 border-indigo-200 px-8 py-3 rounded-full font-semibold text-lg hover:bg-indigo-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            <motion.div className="flex space-x-8 pt-4" variants={itemVariants}>
              <div className="flex items-center space-x-2">
                <Users size={24} className="text-purple-600" />
                <span className="text-xl font-bold text-gray-900">50K+</span>
                <span className="text-gray-500 text-sm">Active Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap size={24} className="text-pink-600" />
                <span className="text-xl font-bold text-gray-900">1K+</span>
                <span className="text-gray-500 text-sm">Educators</span>
              </div>
            </motion.div>
          </div>

          {/* Right - Illustration */}
          <motion.div variants={itemVariants} className="relative hidden lg:block">
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 className="text-4xl font-extrabold text-gray-900 mb-4" variants={itemVariants}>
            Choose Your Learning Path
          </motion.h2>
          <motion.p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto" variants={itemVariants}>
            Whether you're an individual learner or an educational institution, we have the perfect plan to accelerate your coding journey.
          </motion.p>

          <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" variants={containerVariants}>
            {/* Pricing Card 1: Individual */}
            <motion.div className="bg-white p-8 rounded-3xl shadow-xl border-t-8 border-indigo-600/50 hover:shadow-2xl transition-all duration-300" variants={itemVariants} whileHover={{ y: -5 }}>
              <div className="flex items-center justify-center mb-6">
                <Trophy size={48} className="text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Individual Subscription</h3>
              <p className="text-gray-500 mb-8">Perfect for self-paced learners and coding enthusiasts</p>

              <div className="mb-10">
                <FeatureList items={individualFeatures} />
              </div>

              <p className="text-4xl font-extrabold text-gray-900 mb-6">
                Starting From 
                <span className="text-indigo-600 ml-2">$19</span>
                <span className="text-base font-medium text-gray-500">/month</span>
              </p>

              <motion.button
                onClick={goToSubscription}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue
              </motion.button>
            </motion.div>

            {/* Pricing Card 2: Institutional (Most Popular) */}
            <motion.div className="bg-white p-8 rounded-3xl shadow-xl border-t-8 border-purple-600 hover:shadow-2xl transition-all duration-300 relative" variants={itemVariants} whileHover={{ y: -5 }}>
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                Most Popular
              </span>
              <div className="flex items-center justify-center mb-6 pt-4">
                <Award size={48} className="text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Institutional Subscription</h3>
              <p className="text-gray-500 mb-8">Comprehensive solution for schools and organizations</p>
              
              <div className="mb-10">
                <FeatureList items={institutionalFeatures} />
              </div>

              <p className="text-4xl font-extrabold text-gray-900 mb-6">
                Starting From 
                <span className="text-purple-600 ml-2">$199</span>
                <span className="text-base font-medium text-gray-500">/month</span>
              </p>

              <motion.button
                onClick={goToSubscription}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
          
          <motion.button className="mt-10 text-indigo-600 font-semibold border-b border-indigo-200 hover:text-indigo-800 transition-colors" variants={itemVariants}>
            Compare All Plans
          </motion.button>

        </div>
      </section>

      {/* 3. Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.h2 className="text-4xl font-extrabold text-gray-900 mb-4" variants={itemVariants}>
          Powered by Cutting-Edge Technology
        </motion.h2>
        <motion.p className="text-lg text-gray-600 mb-16 max-w-4xl mx-auto" variants={itemVariants}>
          Experience the future of coding education with our innovative features
        </motion.p>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-10" variants={containerVariants}>
          <motion.div className="space-y-4 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300" variants={itemVariants}>
            <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
              <Cpu size={32} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">AI Assistant</h3>
            <p className="text-gray-600">Get intelligent code suggestions and personalized learning recommendations.</p>
          </motion.div>

          <motion.div className="space-y-4 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300" variants={itemVariants}>
            <div className="w-16 h-16 mx-auto bg-pink-100 rounded-full flex items-center justify-center">
              <Users size={32} className="text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Real-time Collaboration</h3>
            <p className="text-gray-600">Code together with classmates and receive instant feedback from instructors.</p>
          </motion.div>

          <motion.div className="space-y-4 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300" variants={itemVariants}>
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <BarChart3 size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Advanced Analytics</h3>
            <p className="text-gray-600">Track progress with detailed insights and performance metrics.</p>
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
}
