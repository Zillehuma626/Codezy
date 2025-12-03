// ManageTeachers.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus, Edit2, Trash2, User, Loader2, Filter,
  LogOut, Bell, LayoutDashboard, ListChecks, BookOpenCheck, LineChart,
  CreditCard, MessageSquare, UserCog, X
} from "lucide-react";

const API_URL = "http://localhost:5000/api/teachers";

const teacherCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } })
};

const defaultTeacher = {
  name: '',
  email: '',
  role: '',
  status: 'Active',
  courses: [],
  courseLoad: 0,
  classes: [],
  classesLoad: 0,
  students: 0,
  coursesStr: '',
  classesStr: '',
  department: [],
  departmentStr: '',
  password: ''
};

const ManageTeachers = () => {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalTab, setModalTab] = useState('manual');
  const [CSVFile, setCSVFile] = useState(null);
  const [newTeacher, setNewTeacher] = useState({ ...defaultTeacher });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [activeMenu, setActiveMenu] = useState('Manage Teachers');

  const [isEditing, setIsEditing] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_URL);
      const normalized = (res.data || []).map(t => ({
        ...t,
        courses: t.courses || [],
        courseLoad: Number(t.courseLoad) || (Array.isArray(t.courses) ? t.courses.length : 0),
        classes: t.classes || [],
        classesLoad: Number(t.classesLoad) || (Array.isArray(t.classes) ? t.classes.length : 0),
        department: t.department || [],
        students: Number(t.students) || 0,
        name: t.name ?? '',
        email: t.email ?? '',
        role: t.role ?? '',
        status: t.status ?? 'Active'
      }));
      setTeachers(normalized);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const safeSetNewTeacher = (updater) => {
    setNewTeacher(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return {
        name: next.name ?? '',
        email: next.email ?? '',
        role: next.role ?? '',
        status: next.status ?? 'Active',
        courses: Array.isArray(next.courses) ? next.courses : (next.coursesStr ?? '').split(',').map(x => x.trim()).filter(Boolean),
        courseLoad: Number(next.courseLoad) || (Array.isArray(next.courses) ? next.courses.length : (next.coursesStr ? next.coursesStr.split(',').filter(Boolean).length : 0)),
        classes: Array.isArray(next.classes) ? next.classes : (next.classesStr ?? '').split(',').map(x => x.trim()).filter(Boolean),
        classesLoad: Number(next.classesLoad) || (Array.isArray(next.classes) ? next.classes.length : (next.classesStr ? next.classesStr.split(',').filter(Boolean).length : 0)),
        department: Array.isArray(next.department) ? next.department : (next.departmentStr ?? '').split(',').map(x => x.trim()).filter(Boolean),
        students: next.students === '' ? 0 : Number(next.students) || 0,
        coursesStr: next.coursesStr ?? '',
        classesStr: next.classesStr ?? '',
        departmentStr: next.departmentStr ?? '',
        password: next.password ?? ''
      };
    });
  };

  const handleSaveTeacher = async () => {
    if (!newTeacher.name?.trim() || !newTeacher.email?.trim() || !newTeacher.role?.trim()) {
      return alert("Please fill all required fields (name, email, role).");
    }

    const courseArray = newTeacher.coursesStr
      ? newTeacher.coursesStr.split(',').map(c => c.trim()).filter(c => c)
      : [];
    const classArray = newTeacher.classesStr
      ? newTeacher.classesStr.split(',').map(c => c.trim()).filter(c => c)
      : [];
    const departmentArray = newTeacher.departmentStr
      ? newTeacher.departmentStr.split(',').map(d => d.trim()).filter(d => d)
      : [];

    const payload = {
      name: newTeacher.name.trim(),
      email: newTeacher.email.trim(),
      role: newTeacher.role.trim(),
      status: newTeacher.status ?? 'Active',
      courses: courseArray,
      courseLoad: courseArray.length,
      classes: classArray,
      classesLoad: classArray.length,
      department: departmentArray,
      students: Number(newTeacher.students) || 0,
      password: newTeacher.password?.trim() || undefined
    };

    try {
      if (isEditing) {
        const res = await axios.put(`${API_URL}/${editingTeacherId}`, payload);
        setTeachers(prev => prev.map(t => t._id === editingTeacherId ? res.data : t));
        setIsEditing(false);
        setEditingTeacherId(null);
      } else {
        const res = await axios.post(API_URL, payload);
        setTeachers(prev => [res.data, ...prev]);
      }
      setNewTeacher({ ...defaultTeacher });
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to save teacher:", err);
      alert("Failed to save teacher.");
    }
  };

  const handleDeleteTeacher = async id => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTeachers(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error("Failed to delete teacher:", err);
      alert("Failed to delete teacher.");
    }
  };

  const handleEditTeacher = t => {
    setNewTeacher({
      name: t.name ?? '',
      email: t.email ?? '',
      role: t.role ?? '',
      status: t.status ?? 'Active',
      courses: t.courses || [],
      courseLoad: t.courseLoad || (t.courses ? t.courses.length : 0),
      classes: t.classes || [],
      classesLoad: t.classesLoad || (t.classes ? t.classes.length : 0),
      department: t.department || [],
      departmentStr: Array.isArray(t.department) ? t.department.join(', ') : '',
      students: t.students || 0,
      coursesStr: Array.isArray(t.courses) ? t.courses.join(', ') : '',
      classesStr: Array.isArray(t.classes) ? t.classes.join(', ') : '',
      password: ''
    });
    setIsEditing(true);
    setEditingTeacherId(t._id);
    setModalTab('manual');
    setShowAddModal(true);
  };

  const handleCSVUpload = f => setCSVFile(f);

  const detectDelimiterFromHeader = headerLine => {
    if (headerLine.indexOf('\t') !== -1) return '\t';
    if (headerLine.indexOf('|') !== -1) return '|';
    return ',';
  };

  const parseCSVToObjects = (text) => {
    const clean = text.replace(/\r/g, '\n').replace(/\n+/g, '\n').trim().replace(/^\uFEFF/, '');
    if (!clean) return [];

    const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) return [];

    const delimiter = detectDelimiterFromHeader(lines[0]);
    const rawHeaders = lines[0].split(delimiter).map(h => h.trim().replace(/^"(.+(?="$))"$/, '$1'));
    const headers = rawHeaders.map(h => h.toLowerCase());

    const rows = lines.slice(1).map(line => {
      const parts = line.split(delimiter).map(p => p.trim().replace(/^"(.+(?="$))"$/, '$1'));
      const obj = {};
      for (let i = 0; i < headers.length; i++) {
        obj[ rawHeaders[i] || headers[i] || `col${i}` ] = parts[i] ?? '';
      }
      return obj;
    });

    return rows;
  };

  const normalizeParsedRowsForBackend = (rows) => {
    return rows.map(r => {
      const lookup = key => {
        if (r[key] !== undefined) return r[key];
        const foundKey = Object.keys(r).find(k => k.toLowerCase() === key.toLowerCase());
        return foundKey ? r[foundKey] : undefined;
      };

      const rawCourses = lookup('Courses') ?? lookup('courses') ?? '';
      const rawClasses = lookup('Classes') ?? lookup('classes') ?? '';
      const rawDepartment = lookup('Department') ?? lookup('department') ?? '';

      const splitList = (s) => {
        if (!s) return [];
        const clean = ('' + s).replace(/^"(.+(?="$))"$/, '$1').trim();
        if (clean.indexOf(';') !== -1) return clean.split(';').map(x => x.trim()).filter(Boolean);
        if (clean.indexOf('|') !== -1) return clean.split('|').map(x => x.trim()).filter(Boolean);
        if (clean.indexOf(',') !== -1) return clean.split(',').map(x => x.trim()).filter(Boolean);
        return clean ? [clean] : [];
      };

      const coursesArr = splitList(rawCourses);
      const classesArr = splitList(rawClasses);
      const departmentArr = splitList(rawDepartment);

      const courseLoadFromCSV = lookup('CourseLoad') ?? lookup('courseLoad') ?? lookup('courseload');
      const classesLoadFromCSV = lookup('ClassesLoad') ?? lookup('classesLoad') ?? lookup('classesload');

      return {
        Name: (lookup('Name') ?? lookup('name') ?? '').trim(),
        Email: (lookup('Email') ?? lookup('email') ?? '').trim(),
        Role: (lookup('Role') ?? lookup('role') ?? '').trim(),
        Courses: coursesArr.join(','),
        CourseLoad: Number(courseLoadFromCSV) || coursesArr.length,
        Status: (lookup('Status') ?? 'Active') || 'Active',
        Classes: classesArr.join(','),
        ClassesLoad: Number(classesLoadFromCSV) || classesArr.length,
        Students: Number(lookup('Students') ?? 0) || 0,
        Password: lookup('Password') ?? '',
        Department: departmentArr
      };
    });
  };

  const handleUploadCSV = async () => {
    if (!CSVFile) return alert("Please select a CSV file.");
    const reader = new FileReader();

    reader.onload = async e => {
      try {
        const text = e.target.result;
        const parsed = parseCSVToObjects(text);
        if (!parsed.length) return alert("CSV appears empty or malformed.");
        const payload = normalizeParsedRowsForBackend(parsed).filter(r => r.Name && r.Email && r.Role);
        if (!payload.length) return alert("No valid rows found in CSV (missing Name, Email or Role).");
        const res = await axios.post(`${API_URL}/bulk`, payload);
        const created = Array.isArray(res.data.created) ? res.data.created : [];
        setTeachers(prev => [...created, ...prev]);
        setShowAddModal(false);
        setCSVFile(null);
        alert(`Uploaded ${created.length} teachers successfully.`);
      } catch (err) {
        console.error("CSV upload failed:", err);
        if (err?.response?.data?.message) {
          alert(`Upload failed: ${err.response.data.message}`);
        } else {
          alert("Failed to upload CSV.");
        }
      }
    };

    reader.readAsText(CSVFile);
  };

  const filteredTeachers = teachers.filter(t => {
    const q = (searchQuery ?? '').toLowerCase().trim();
    const matchesSearch = !q || (t.name ?? '').toLowerCase().includes(q) || (t.email ?? '').toLowerCase().includes(q);
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchesDept = filterDepartment === 'All' || t.department?.includes(filterDepartment);
    return matchesSearch && matchesStatus && matchesDept;
  });

  const getStatusColor = status =>
    status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 font-semibold' : 'bg-amber-500/10 text-amber-600 font-semibold';
  const getStatusDotColor = status =>
    status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500';

  const sidebarItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Manage Teachers', icon: ListChecks },
    { label: 'Manage Courses', icon: BookOpenCheck },
    { label: 'View Progress', icon: LineChart },
    { label: 'Payment & Subscription', icon: CreditCard },
    { label: 'Feedback', icon: MessageSquare },
    { label: 'Contact Super Admin', icon: UserCog },
  ];

  const SidebarItem = ({ icon: Icon, label }) => {
    const isSelected = activeMenu === label;
    return (
      <motion.button
        onClick={() => {
          setActiveMenu(label);
          if (label === 'Manage Teachers') navigate('/admin/teachers');
          if (label === 'Dashboard') navigate('/admin');
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${isSelected ? 'bg-indigo-600/50 text-white' : 'hover:bg-blue-700/50 text-blue-200'}`}
      >
        <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-700' : 'bg-blue-800/70'}`}>
          <Icon size={20} className={isSelected ? 'text-white' : 'text-blue-200'} />
        </div>
        <span className="font-medium">{label}</span>
      </motion.button>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-700/50">
          <h1 className="text-2xl font-bold text-white">Codezy</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {sidebarItems.map(item => <SidebarItem key={item.label} icon={item.icon} label={item.label} />)}
        </nav>
        <a href="/login" className="m-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center justify-center">
          <LogOut size={18} className="mr-2" /> Logout
        </a>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="w-full bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <User size={20} className="text-gray-600" />
            </button>
          </div>
        </header>

        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Manage Teachers</h1>
          <motion.button
            onClick={() => {
              setModalTab('manual');
              setNewTeacher({ ...defaultTeacher });
              setIsEditing(false);
              setShowAddModal(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-xl shadow flex items-center gap-2 font-semibold"
          >
            <Plus size={16} /> Add New Teacher
          </motion.button>
        </div>

        <div className="px-6 flex flex-wrap gap-3 mb-4 items-center">
          <input type="text" placeholder="Search teachers..." className="flex-1 border px-3 py-2 rounded-lg" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border px-3 py-2 rounded-lg">
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
          </select>
          <select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} className="border px-3 py-2 rounded-lg">
            <option value="All">All Departments</option>
            {[...new Set(teachers.flatMap(t => t.department || []))].map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>

        {/* Teacher cards */}
        <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <Loader2 size={36} className="animate-spin mx-auto col-span-full" />
          ) : (
            filteredTeachers.map((t, i) => (
              <motion.div
                key={t._id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={teacherCardVariants}
                className="bg-white rounded-xl p-4 shadow relative hover:shadow-lg transition group"
              >
                {/* Edit/Delete buttons */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                  <Edit2 size={16} className="cursor-pointer text-blue-600" onClick={() => handleEditTeacher(t)} />
                  <Trash2 size={16} className="cursor-pointer text-red-600" onClick={() => handleDeleteTeacher(t._id)} />
                </div>

                {/* Basic info */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusDotColor(t.status)}`} />
                    <h2 className="font-bold text-lg">{t.name}</h2>
                  </div>
                  <span className={`px-2 py-0.5 rounded ${getStatusColor(t.status)} text-sm`}>{t.status}</span>
                </div>
                <p className="text-gray-600 text-sm">{t.email}</p>
                <p className="text-gray-500 text-sm mt-1 font-medium">Role: {t.role}</p>

                {/* Interactive collapsible sections */}
                <div className="mt-2 space-y-1">
                  {t.department?.length > 0 && (
                    <details className="bg-indigo-50 p-2 rounded">
                      <summary className="cursor-pointer font-semibold text-indigo-700">Departments ({t.department.length})</summary>
                      <ul className="pl-4 mt-1 list-disc text-gray-700">
                        {t.department.map(d => <li key={d}>{d}</li>)}
                      </ul>
                    </details>
                  )}
                  {t.courses?.length > 0 && (
                    <details className="bg-green-50 p-2 rounded">
                      <summary className="cursor-pointer font-semibold text-green-700">Courses ({t.courseLoad})</summary>
                      <ul className="pl-4 mt-1 list-disc text-gray-700">
                        {t.courses.map(c => <li key={c}>{c}</li>)}
                      </ul>
                    </details>
                  )}
                  {t.classes?.length > 0 && (
                    <details className="bg-yellow-50 p-2 rounded">
                      <summary className="cursor-pointer font-semibold text-yellow-700">Classes ({t.classesLoad})</summary>
                      <ul className="pl-4 mt-1 list-disc text-gray-700">
                        {t.classes.map(c => <li key={c}>{c}</li>)}
                      </ul>
                    </details>
                  )}
                </div>

                {/* Students */}
                <p className="text-gray-600 text-sm mt-2">Students: {t.students}</p>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{isEditing ? 'Edit Teacher' : 'Add Teacher'}</h2>
              <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>

            <div className="flex mb-4 gap-2 border-b">
              <button className={`flex-1 py-2 ${modalTab === 'manual' ? 'border-b-2 border-blue-700 font-semibold' : ''}`} onClick={() => setModalTab('manual')}>Manual Entry</button>
              <button className={`flex-1 py-2 ${modalTab === 'csv' ? 'border-b-2 border-blue-700 font-semibold' : ''}`} onClick={() => setModalTab('csv')}>CSV Upload</button>
            </div>

            {modalTab === 'manual' && (
              <div className="space-y-3">
                <input type="text" placeholder="Name" className="w-full border px-3 py-2 rounded-lg" value={newTeacher.name} onChange={e => safeSetNewTeacher(p => ({ ...p, name: e.target.value }))} />
                <input type="email" placeholder="Email" className="w-full border px-3 py-2 rounded-lg" value={newTeacher.email} onChange={e => safeSetNewTeacher(p => ({ ...p, email: e.target.value }))} />
                <input type="text" placeholder="Role" className="w-full border px-3 py-2 rounded-lg" value={newTeacher.role} onChange={e => safeSetNewTeacher(p => ({ ...p, role: e.target.value }))} />
                <input type="text" placeholder="Courses (comma-separated)" className="w-full border px-3 py-2 rounded-lg" value={newTeacher.coursesStr} onChange={e => safeSetNewTeacher(p => ({ ...p, coursesStr: e.target.value }))} />
                <input type="text" placeholder="Classes (comma-separated)" className="w-full border px-3 py-2 rounded-lg" value={newTeacher.classesStr} onChange={e => safeSetNewTeacher(p => ({ ...p, classesStr: e.target.value }))} />
                <input type="text" placeholder="Department(s) (comma-separated)" className="w-full border px-3 py-2 rounded-lg" value={newTeacher.departmentStr} onChange={e => safeSetNewTeacher(p => ({ ...p, departmentStr: e.target.value }))} />
                <input type="number" placeholder="Students" className="w-full border px-3 py-2 rounded-lg" value={newTeacher.students} onChange={e => safeSetNewTeacher(p => ({ ...p, students: e.target.value }))} />
                <input type="password" placeholder="Password (optional)" className="w-full border px-3 py-2 rounded-lg" value={newTeacher.password} onChange={e => safeSetNewTeacher(p => ({ ...p, password: e.target.value }))} />
                <button onClick={handleSaveTeacher} className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-xl mt-2 w-full">{isEditing ? 'Update Teacher' : 'Save Teacher'}</button>
              </div>
            )}

            {modalTab === 'csv' && (
              <div className="space-y-3">
                <input type="file" accept=".csv" onChange={e => handleCSVUpload(e.target.files[0])} />
                <button onClick={handleUploadCSV} className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-xl mt-2 w-full">Upload CSV</button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageTeachers;
