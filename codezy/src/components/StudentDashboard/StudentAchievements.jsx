import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Zap, Target, Lock, CheckCircle, 
  Star, Award, Code, Database, Box, LogOut 
} from 'lucide-react';

const StudentAchievements = () => {
  const navigate = useNavigate();
  const STUDENT_ID = localStorage.getItem('userId');
  const studentName = localStorage.getItem('fullName') || 'Student';

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!STUDENT_ID) { navigate('/login'); return; }

    const fetchAchievements = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/students/${STUDENT_ID}/achievements`);
        const result = await response.json();
        setData(result);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setIsLoading(false);
      }
    };
    fetchAchievements();
  }, [STUDENT_ID, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FD] font-sans pb-20">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="text-indigo-600 font-bold text-xl flex items-center gap-1 cursor-pointer" onClick={() => navigate('/student')}>
            <span className="text-2xl font-black">&lt;/&gt;</span><span>Codezy</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <button className="hover:text-indigo-600 transition" onClick={() => navigate('/student')}>Dashboard</button>
            <button className="hover:text-indigo-600 transition" onClick={() => navigate('/student/courses')}>My Courses</button>
            <button className="text-indigo-600 border-b-2 border-indigo-600 pb-1">Achievements</button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/student/profile')} className="flex items-center gap-3 text-sm font-semibold text-gray-700">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold uppercase">{studentName.charAt(0)}</div>
            <span className="hidden md:inline">{studentName}</span>
          </button>
          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-rose-600 transition font-bold text-sm">
            <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900">Achievements & XP Progress</h1>
          <p className="text-gray-500 font-medium">Track your learning journey and unlock badges</p>
        </header>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center relative overflow-hidden">
            <div>
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Total XP Points</p>
              <h2 className="text-4xl font-black">{data?.totalXp || 0} XP</h2>
              <p className="text-indigo-200 text-[10px] mt-4 font-bold flex items-center gap-1">
                <Zap size={12} fill="currentColor" /> +{data?.weeklyXp || 0} XP this week
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md"><Zap size={32} /></div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Current Tier</p>
              <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                <span className="text-3xl">🥈</span> {data?.tier || 'Silver'}
              </h2>
              <p className="text-gray-400 text-[10px] mt-4 font-bold tracking-widest uppercase">XP Range: 1,000 - 2,499</p>
            </div>
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100"><Trophy className="text-gray-300" /></div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <div>
                 <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Next Tier</p>
                 <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">🥇 Gold</h2>
               </div>
               <span className="text-indigo-600 font-black text-sm">{data?.nextTierPercent || 0}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${data?.nextTierPercent || 0}%` }} className="h-full bg-indigo-600" />
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-4 uppercase">{data?.xpToNext || 0} XP to next tier</p>
          </div>
        </div>

        {/* Secondary Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Earned Badges', val: data?.earnedCount, icon: <Award className="text-emerald-500" />, bg: 'bg-emerald-50' },
            { label: 'Locked Badges', val: data?.lockedCount, icon: <Lock className="text-gray-400" />, bg: 'bg-gray-50' },
            { label: 'Total Badges', val: data?.totalCount, icon: <Trophy className="text-amber-500" />, bg: 'bg-amber-50' },
            { label: 'Completion', val: `${data?.completion}%`, icon: <Star className="text-purple-500" />, bg: 'bg-purple-50' },
          ].map((s, idx) => (
            <div key={idx} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className={`p-3 ${s.bg} rounded-xl`}>{s.icon}</div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-lg font-black text-gray-800">{s.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {['All', 'Programming', 'Object-Oriented', 'Data', 'Database', 'General'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap
              ${filter === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border border-gray-100 hover:border-indigo-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {(data?.badges || []).filter(b => filter === 'All' || b.category === filter).map((badge, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -5 }} 
              className={`bg-white rounded-3xl p-6 border transition-all relative overflow-hidden flex flex-col items-center text-center
              ${badge.isLocked ? 'border-gray-100 grayscale opacity-70' : 'border-indigo-50 shadow-xl shadow-indigo-50/20'}`}
            >
              {/* Badge Icon Container */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 relative z-10 
                ${badge.isLocked ? 'bg-gray-50 border-2 border-dashed border-gray-200' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'}`}>
                {badge.isLocked ? <Lock size={24} className="text-gray-300" /> : <Star size={32} fill="currentColor" />}
              </div>

              <h3 className="font-black text-gray-900 mb-2">{badge.title}</h3>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-6">{badge.description}</p>
              
              {!badge.isLocked ? (
                <div className="mt-auto w-full">
                  <div className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase py-1.5 rounded-lg flex items-center justify-center gap-1 mb-4">
                    <CheckCircle size={12} /> Earned
                  </div>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase">+{badge.xpAward} XP</p>
                  <p className="text-[9px] text-gray-300 mt-4 uppercase">Earned: {badge.earnedDate}</p>
                </div>
              ) : (
                <div className="mt-auto w-full">
                  <div className="bg-gray-100 text-gray-400 text-[10px] font-black uppercase py-1.5 rounded-lg mb-4 tracking-widest">Locked</div>
                  <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden mb-2">
                    <div className="bg-gray-300 h-full" style={{ width: `${badge.progress}%` }} />
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">{badge.progress}% Complete</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAchievements;