import React, { useState } from 'react';
import NotificationDropdown from './NotificationDropdown';
import { 
  Bell, MessageCircle, X, Send, Maximize2, Minimize2, 
  Trophy, Star, Target, Flame, BookOpen, Lock, CheckCircle, LogOut 
} from 'lucide-react';

const AchievementsPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All Badges");
  const [chatMessage, setChatMessage] = useState("");

  const fullName = localStorage.getItem("fullName") || "Jordan";

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("userId");
      localStorage.removeItem("fullName");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
  };

  const summaryStats = [
    { label: "Badges Earned", value: "4/12", icon: <Trophy className="text-purple-500" /> },
    { label: "Total XP", value: "500 XP", icon: <Star className="text-yellow-500" /> },
    { label: "In Progress", value: "7", icon: <Flame className="text-orange-500" /> },
    { label: "Completion", value: "33%", icon: <Target className="text-blue-500" /> },
  ];

  const filters = ["All Badges", "Unlocked", "Learning", "Labs", "Quizzes", "Streaks"];

  const allBadges = [
    { title: "First Steps", desc: "Complete your first lesson", xp: 50, icon: "⭐", category: "Learning", status: "unlocked" },
    { title: "Lab Master", desc: "Complete 5 coding labs", xp: 100, icon: "📖", category: "Labs", status: "unlocked" },
    { title: "Week Warrior", desc: "Maintain a 7-day learning streak", xp: 150, icon: "🔥", category: "Streaks", status: "unlocked" },
    { title: "Quiz Champion", desc: "Score 90% or higher in a quiz", xp: 200, icon: "🏆", category: "Quizzes", status: "unlocked" },
    { title: "Dedicated Learner", target: "Complete 10 labs", current: 8, total: 10, xp: 250, category: "Labs", status: "in-progress", color: "bg-green-500" },
    { title: "Marathon Runner", target: "Maintain 30-day streak", current: 12, total: 30, xp: 500, category: "Streaks", status: "in-progress", color: "bg-orange-500" },
    { title: "Knowledge Seeker", target: "Complete 3 courses", current: 2, total: 3, xp: 300, category: "Learning", status: "in-progress", color: "bg-blue-500" },
    { title: "Perfect Score", target: "Get 100% on 3 quizzes", current: 0, total: 3, xp: 400, category: "Quizzes", status: "locked", icon: "🔒" }
  ];

  const filteredBadges = allBadges.filter(badge => {
    if (activeFilter === "All Badges") return true;
    if (activeFilter === "Unlocked") return badge.status === "unlocked";
    return badge.category === activeFilter;
  });

  const unlockedCount = filteredBadges.filter(b => b.status === "unlocked").length;
  const inProgressCount = filteredBadges.filter(b => b.status === "in-progress").length;
  const lockedCount = filteredBadges.filter(b => b.status === "locked").length;

  return (
    <div className="min-h-screen bg-white font-sans relative">
      {/* --- NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-8">
          <a href="/learner-dashboard" className="text-purple-700 font-bold text-xl flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="bg-purple-700 text-white px-1.5 py-0.5 rounded-md text-sm font-mono">{"</>"}</div> 
            Codezy
          </a>
          <div className="hidden md:flex gap-2 text-sm font-semibold">
            <a href="/courses" className="text-gray-500 hover:text-purple-700 px-4 py-2 transition-colors">Courses</a>
            <a href="/roadmap" className="text-gray-500 hover:text-purple-700 px-4 py-2 transition-colors">Roadmap</a>
            <a href="/labs" className="text-gray-500 hover:text-purple-700 px-4 py-2 transition-colors">Labs</a>
            <a href="/achievements" className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl transition-all font-bold">Achievements</a>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <NotificationDropdown />
          
          {/* LOGOUT BUTTON */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold text-xs transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
          >
            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
          </button>

          <a href="/learner-profile" className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold uppercase border border-purple-200 cursor-pointer hover:bg-purple-200 transition-colors">
            {fullName.charAt(0)}
          </a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-10">
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-gray-800">Achievements & Badges 🏆</h1>
          <p className="text-gray-500 text-sm mt-1">Track your progress and unlock new badges as you learn</p>
        </header>

        {/* SUMMARY STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {summaryStats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-gray-100 p-5 rounded-2xl flex items-center gap-5 shadow-sm transition-transform hover:scale-105">
              <div className="bg-gray-50 p-3 rounded-xl">{stat.icon}</div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                <p className="text-lg font-black text-gray-800 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {filters.map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                activeFilter === filter 
                ? 'bg-purple-700 text-white border-purple-700 shadow-lg shadow-purple-100' 
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* UNLOCKED SECTION */}
        {unlockedCount > 0 && (
          <section className="mb-16 animate-in fade-in duration-500">
            <h2 className="text-lg font-extrabold text-gray-800 mb-8 flex items-center gap-2">Unlocked Badges 🎉</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredBadges.filter(b => b.status === "unlocked").map((badge, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all">
                  <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                    {badge.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{badge.title}</h3>
                  <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">{badge.desc}</p>
                  <div className="mt-auto flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase">
                    <CheckCircle size={12} /> Unlocked +{badge.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* IN PROGRESS SECTION */}
        {inProgressCount > 0 && (
          <section className="mb-16 animate-in fade-in duration-500">
            <h2 className="text-lg font-extrabold text-gray-800 mb-8 flex items-center gap-2">In Progress 🚀</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBadges.filter(b => b.status === "in-progress").map((badge, idx) => (
                <ProgressCard key={idx} {...badge} />
              ))}
            </div>
          </section>
        )}

        {/* LOCKED SECTION */}
        {lockedCount > 0 && (activeFilter === "All Badges" || activeFilter === "Quizzes" || activeFilter === "Learning") && (
          <section className="mb-16 animate-in fade-in duration-500">
            <h2 className="text-lg font-extrabold text-gray-800 mb-8 flex items-center gap-2">Locked Badges 🔒</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {filteredBadges.filter(b => b.status === "locked").map((badge, idx) => (
                 <div key={idx} className="bg-gray-50 rounded-3xl border border-gray-200 p-6 opacity-60 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center text-2xl mb-4 text-gray-400">
                      <Lock size={24} />
                    </div>
                    <h3 className="font-bold text-gray-500 mb-1">{badge.title}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{badge.target}</p>
                 </div>
               ))}
            </div>
          </section>
        )}

        {/* EMPTY STATE */}
        {filteredBadges.length === 0 && (
          <div className="text-center py-24 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
            <Trophy size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-gray-400 font-medium">No badges found for this category.</p>
          </div>
        )}
      </main>

      {/* --- AI CHATBOT --- */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        {isChatOpen && (
          <div className={`mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${isMaximized ? 'w-[90vw] h-[85vh] fixed bottom-[7.5vh] right-[5vw]' : 'w-[350px] h-[550px]'}`}>
            <div className="bg-gradient-to-r from-[#D91B5C] via-[#7C3AED] to-[#7C3AED] p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">✨</div>
                <div><h3 className="font-bold text-md leading-tight">Codezy AI Coach</h3><div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div><span className="text-xs opacity-90 font-medium">Online</span></div></div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsMaximized(!isMaximized)} className="hover:scale-110 transition-transform">{isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
                <X size={20} className="cursor-pointer hover:scale-110 transition-transform" onClick={() => setIsChatOpen(false)} />
              </div>
            </div>
            <div className="flex-1 p-6 bg-white overflow-y-auto italic text-gray-400 text-sm leading-relaxed">
               I'm analyzing your learning journey... It looks like you're close to unlocking the "Dedicated Learner" badge. Keep going!
            </div>
            <div className="p-4 bg-white border-t border-gray-50 flex gap-2">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..." 
                className="flex-1 bg-gray-50 px-4 py-2 rounded-xl text-sm outline-none focus:ring-1 focus:ring-purple-200 transition-all" 
              />
              <button className="bg-gradient-to-br from-[#A21CAF] to-[#DB2777] text-white p-3 rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all"><Send size={18} /></button>
            </div>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 bg-gradient-to-br from-[#7C3AED] via-[#A21CAF] to-[#DB2777] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 shadow-purple-200"><MessageCircle size={28} /></button>
      </div>
    </div>
  );
};

const ProgressCard = ({ title, target, current, total, xp, color }) => {
  const percentage = (current / total) * 100;
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
      <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-[11px] text-gray-400 mb-6 italic font-medium leading-none">{target}</p>
      <div className="flex justify-between text-[10px] font-extrabold mb-2">
        <span className="text-purple-600 uppercase tracking-widest">{current}/{total}</span>
        <span className="text-gray-400">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-6 shadow-inner">
        <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="text-[10px] font-black text-purple-700 uppercase flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-lg w-fit border border-purple-100">
        <Star size={12} fill="currentColor" /> +{xp} XP on unlock
      </div>
    </div>
  );
};

export default AchievementsPage;