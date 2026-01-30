import React, { useEffect, useState } from 'react';
import NotificationDropdown from './NotificationDropdown';
import axios from 'axios';
import { 
  Bell, Search, MessageCircle, X, Send, Maximize2, Minimize2, 
  Trophy, BookOpen, Flame, TrendingUp, LogOut 
} from 'lucide-react';

const CoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Levels");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const userId = localStorage.getItem("userId");
  const fullName = localStorage.getItem("fullName") || "User";

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

  useEffect(() => {
    // Fetch only enrollment data for this page
    if (userId) {
      axios.get(`http://localhost:5000/api/learners/dashboard-data/${userId}`)
        .then(res => setEnrolledCourses(res.data.enrolled || []))
        .catch(err => console.error(err));
    }
  }, [userId]);

  const filtered = enrolledCourses.filter(item => {
    const title = item.courseId?.title || "";
    const instructor = item.courseId?.instructor || "";
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All Levels" || item.courseId?.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
            <a href="/courses" className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl transition-all font-bold">Courses</a>
            <a href="/roadmap" className="text-gray-500 hover:text-purple-700 px-4 py-2 transition-colors">Roadmap</a>
            <a href="/labs" className="text-gray-500 hover:text-purple-700 px-4 py-2 transition-colors">Labs</a>
            <a href="/achievements" className="text-gray-500 hover:text-purple-700 px-4 py-2 transition-colors">Achievements</a>
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

          <a href="/learner-profile" className="w-9 h-9 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold uppercase cursor-pointer hover:bg-purple-200 transition-colors">
             {fullName.charAt(0)}
          </a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-10">
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
          <p className="text-gray-500 text-sm mt-1">View and continue learning your enrolled courses</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search your courses by title, instructor, or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm shadow-sm"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['All Levels', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
              <button 
                key={lvl}
                onClick={() => setActiveCategory(lvl)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold border whitespace-nowrap transition-all ${
                  activeCategory === lvl 
                  ? 'bg-purple-700 text-white border-purple-700 shadow-lg shadow-purple-200' 
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">My Enrolled Courses</h2>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{filtered.length} courses enrolled</span>
        </div>

        {/* --- COURSE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.length > 0 ? filtered.map(item => (
            <div key={item._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <img src={item.courseId?.thumbnail || "/placeholder.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.courseId?.title} />
                <span className="absolute top-4 left-4 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-lg shadow-lg">Subscribed</span>
                <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">{item.courseId?.category}</span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-800 text-md leading-tight h-10 line-clamp-2">{item.courseId?.title}</h3>
                <p className="text-xs text-gray-400 mt-2 italic">by {item.courseId?.instructor}</p>
                
                <div className="mt-6">
                  <div className="flex justify-between text-[10px] font-extrabold mb-2">
                    <span className="text-purple-600 uppercase tracking-widest">Progress</span>
                    <span className="text-gray-400 uppercase">{item.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.progress}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-6 text-[10px] text-gray-500 font-bold border-b border-gray-50 pb-4">
                    <span className="flex items-center gap-1">🕒 {item.courseId?.durationWeeks || 8} weeks</span>
                    <span className="flex items-center gap-1">🧪 {item.courseId?.totalLabs || 12} labs</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button className="bg-purple-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-purple-700 shadow-lg shadow-purple-100 transition-all active:scale-95">Continue →</button>
                  <button className="bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">Details</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50/50">
              <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-400 font-medium">No courses found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      {/* --- AI COACH --- */}
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
                <X size={20} className="cursor-pointer hover:scale-110 transition-transform" onClick={() => {setIsChatOpen(false); setIsMaximized(false);}} />
              </div>
            </div>
            <div className="flex-1 p-6 bg-white overflow-y-auto italic text-gray-400 text-sm leading-relaxed">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-gray-600 not-italic shadow-sm">
                Hi {fullName}! How can I help you with your courses today?
              </div>
            </div>
            <div className="p-4 bg-white border-t border-gray-50 flex gap-2">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type message..." 
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

export default CoursesPage;