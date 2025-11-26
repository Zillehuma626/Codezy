import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, Camera, Lock, BookOpen, Award, Settings, Sparkles, Zap, Shield, Bell, Palette, Globe, Download, Upload } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Sample user data
  const [userData, setUserData] = useState({
    personalInfo: {
      firstName: 'Ali',
      lastName: 'Ahmed',
      email: 'ali.ahmed@university.edu',
      phone: '+92 300 1234567',
      department: 'Computer Science',
      position: 'Associate Professor',
      office: 'CS-302',
      joinDate: '2018-09-01',
      bio: 'Dedicated educator with 6+ years of experience in computer science education. Specialized in programming fundamentals, data structures, and web development.'
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    preferences: {
      theme: 'light',
      language: 'english',
      emailNotifications: true,
      pushNotifications: true,
      weeklyReports: false
    }
  });

  const [profileStats, setProfileStats] = useState([
    {
      title: 'Courses Taught',
      value: '12',
      icon: BookOpen,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      change: '+2'
    },
    {
      title: 'Students Mentored',
      value: '345',
      icon: User,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      change: '+15'
    },
    {
      title: 'Labs Created',
      value: '48',
      icon: Award,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      change: '+8'
    },
    {
      title: 'Years Teaching',
      value: '6',
      icon: Calendar,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      change: '+1'
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (section, field, value) => {
    setUserData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsEditing(false);
    setIsSaving(false);
    console.log('Saving user data:', userData);
  };

  const handlePasswordChange = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUserData(prev => ({
      ...prev,
      security: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }));
    setIsSaving(false);
    console.log('Password changed successfully');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    // Redirect to login page
    window.location.href = '/loginpage';
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

  const TabButton = ({ icon: Icon, label, tab, isActive }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-500 transform hover:scale-105 group ${
        isActive
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon 
          size={20} 
          className={`transition-transform duration-300 ${
            isActive ? 'text-white transform scale-110' : 'group-hover:scale-110'
          }`} 
        />
        <span className="font-medium">{label}</span>
        {isActive && <Sparkles size={16} className="animate-pulse" />}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <FloatingParticles />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slower"></div>

      {/* Navbar */}
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
              {['Dashboard', 'My Courses', 'Create Lab', 'Reports', 'Profile'].map((item, index) => (
                <a
                  key={item}
                  href={item === 'Dashboard' ? '/dashboard' : `/${item.toLowerCase().replace(' ', '')}`}
                  className={`relative py-5 px-1 font-medium transition-all duration-300 transform hover:scale-105 ${
                    item === 'Profile' 
                      ? 'text-indigo-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item}
                  {item === 'Profile' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
                  )}
                </a>
              ))}
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="relative py-5 px-1 font-medium transition-all duration-300 transform hover:scale-105 text-gray-600 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 transform hover:scale-105 transition-transform duration-500">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-600 text-lg animate-pulse">
            Manage your account information and preferences with style
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Summary */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-500">
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4 group">
                  <div className="w-28 h-28 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg transform group-hover:scale-110 transition-all duration-500">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      'AA'
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-pointer group">
                    <Camera size={18} className="text-gray-600 group-hover:text-indigo-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{userData.personalInfo.firstName} {userData.personalInfo.lastName}</h2>
                <p className="text-gray-600 text-sm mb-1">{userData.personalInfo.position}</p>
                <p className="text-gray-500 text-sm">{userData.personalInfo.department}</p>
              </div>

              {/* Navigation Tabs */}
              <div className="space-y-3">
                <TabButton icon={User} label="Personal Info" tab="personal" isActive={activeTab === 'personal'} />
                <TabButton icon={Lock} label="Security" tab="security" isActive={activeTab === 'security'} />
                <TabButton icon={Settings} label="Preferences" tab="preferences" isActive={activeTab === 'preferences'} />
              </div>
            </div>

            {/* Stats Overview */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-500">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap size={20} className="text-yellow-500" />
                Teaching Overview
              </h3>
              <div className="space-y-4">
                {profileStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white transform hover:scale-105 transition-all duration-300 group">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${stat.bgColor} transform group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={stat.color} size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-700">
                <div className="px-8 py-6 border-b border-gray-200/50 flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                      <User size={24} className="text-white" />
                    </div>
                    Personal Information
                  </h3>
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={isSaving}
                    className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isEditing ? (
                      <Save size={20} className="group-hover:animate-bounce" />
                    ) : (
                      <Edit size={20} className="group-hover:rotate-12 transition-transform" />
                    )}
                    <span>{isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                  </button>
                </div>

                <div className="p-8 space-y-8">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['firstName', 'lastName'].map((field) => (
                      <div key={field} className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 capitalize">
                          {field.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <input
                          type="text"
                          value={userData.personalInfo[field]}
                          onChange={(e) => handleInputChange('personalInfo', field, e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { field: 'email', icon: Mail },
                      { field: 'phone', icon: Phone }
                    ].map(({ field, icon: Icon }) => (
                      <div key={field} className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 capitalize">
                          {field.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <div className="relative">
                          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
                          <input
                            type={field === 'email' ? 'email' : 'tel'}
                            value={userData.personalInfo[field]}
                            onChange={(e) => handleInputChange('personalInfo', field, e.target.value)}
                            disabled={!isEditing}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Professional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['department', 'position'].map((field) => (
                      <div key={field} className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 capitalize">
                          {field}
                        </label>
                        <input
                          type="text"
                          value={userData.personalInfo[field]}
                          onChange={(e) => handleInputChange('personalInfo', field, e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Location & Join Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { field: 'office', icon: MapPin },
                      { field: 'joinDate', icon: Calendar }
                    ].map(({ field, icon: Icon }) => (
                      <div key={field} className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 capitalize">
                          {field.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <div className="relative">
                          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
                          <input
                            type={field === 'joinDate' ? 'date' : 'text'}
                            value={userData.personalInfo[field]}
                            onChange={(e) => handleInputChange('personalInfo', field, e.target.value)}
                            disabled={!isEditing}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bio */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Bio</label>
                    <textarea
                      value={userData.personalInfo.bio}
                      onChange={(e) => handleInputChange('personalInfo', 'bio', e.target.value)}
                      disabled={!isEditing}
                      rows="4"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-700">
                <div className="px-8 py-6 border-b border-gray-200/50">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
                      <Shield size={24} className="text-white" />
                    </div>
                    Security Settings
                  </h3>
                </div>

                <div className="p-8 space-y-8">
                  {/* Change Password */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Lock size={20} />
                      Change Password
                    </h4>
                    <div className="space-y-6 max-w-md">
                      {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                        <div key={field} className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-3 capitalize">
                            {field.replace(/([A-Z])/g, ' $1')}
                          </label>
                          <input
                            type="password"
                            value={userData.security[field]}
                            onChange={(e) => handleInputChange('security', field, e.target.value)}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform hover:scale-105"
                            placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                          />
                        </div>
                      ))}
                      <button
                        onClick={handlePasswordChange}
                        disabled={isSaving}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50"
                      >
                        {isSaving ? 'Updating Password...' : 'Update Password'}
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="border-t border-gray-200/50 pt-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Shield size={20} />
                      Two-Factor Authentication
                    </h4>
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl transform hover:scale-105 transition-all duration-300">
                      <div>
                        <p className="font-medium text-gray-900">Enhanced Security</p>
                        <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                        <p className="text-xs text-gray-500 mt-2">Currently disabled</p>
                      </div>
                      <button className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-700">
                <div className="px-8 py-6 border-b border-gray-200/50">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                      <Settings size={24} className="text-white" />
                    </div>
                    Preferences
                  </h3>
                </div>

                <div className="p-8 space-y-8">
                  {/* Notification Preferences */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Bell size={20} />
                      Notification Preferences
                    </h4>
                    <div className="space-y-6">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates about your courses and students' },
                        { key: 'pushNotifications', label: 'Push Notifications', description: 'Get instant alerts for important updates' },
                        { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly summary of your teaching activities' }
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl transform hover:scale-105 transition-all duration-300">
                          <div>
                            <p className="font-medium text-gray-900">{label}</p>
                            <p className="text-sm text-gray-600 mt-1">{description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={userData.preferences[key]}
                              onChange={(e) => handleInputChange('preferences', key, e.target.checked)}
                            />
                            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 transition-all duration-300"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Appearance */}
                  <div className="border-t border-gray-200/50 pt-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Palette size={20} />
                      Appearance
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Theme</label>
                        <select 
                          value={userData.preferences.theme}
                          onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform hover:scale-105 appearance-none"
                        >
                          <option value="light">🌞 Light</option>
                          <option value="dark">🌙 Dark</option>
                          <option value="system">💻 System</option>
                        </select>
                      </div>
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Language</label>
                        <select 
                          value={userData.preferences.language}
                          onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 transform hover:scale-105 appearance-none"
                        >
                          <option value="english">🇺🇸 English</option>
                          <option value="spanish">🇪🇸 Spanish</option>
                          <option value="french">🇫🇷 French</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

export default Profile;