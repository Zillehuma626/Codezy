import { useState } from 'react';

export default function CodezyLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;
    if (!username || !password) {
      alert("Please fill both username and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        alert("Invalid server response");
        return;
      }

      if (!response.ok) {
        alert(data.message);
        if (response.status === 404) {
          window.location.href = "/register";
        }
        return;
      }

      // Save JWT token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);

      // Redirect based on role
      switch (data.role) {
        case "student":
          window.location.href = "/student";
          break;
        case "teacher":
          window.location.href = "/dashboard";
          break;
        case "admin":
          window.location.href = "/admin";
          break;
        case "individual":
          window.location.href = "/individual";
          break;
        default:
          window.location.href = "/";
      }

    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
        <div className="absolute w-64 h-64 bg-purple-400/10 rounded-full blur-2xl top-1/3 left-1/3 animate-float-slow"></div>
        <div className="absolute w-80 h-80 bg-pink-400/10 rounded-full blur-2xl bottom-1/4 right-1/4 animate-float-slower"></div>
        <div className="absolute top-20 left-20 w-2 h-2 bg-white/40 rounded-full animate-particle-1"></div>
        <div className="absolute top-40 right-40 w-1 h-1 bg-white/30 rounded-full animate-particle-2"></div>
        <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-white/35 rounded-full animate-particle-3"></div>
        <div className="absolute bottom-20 right-60 w-2 h-2 bg-white/40 rounded-full animate-particle-4"></div>
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2 text-white z-20 animate-fade-in">
        <div className="relative">
          <div className="text-3xl font-bold">&lt;<span className="text-pink-300">/</span>&gt;</div>
          <div className="absolute inset-0 blur-lg bg-white/20 animate-pulse"></div>
        </div>
        <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200 animate-shimmer">codezy</span>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-5xl animate-slide-up">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-purple-500/20 hover:shadow-3xl transition-shadow duration-500">
          <div className="flex flex-col md:flex-row">
            {/* Left side image */}
            <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 p-12 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
              <div className="absolute top-10 left-10 text-white/10 text-6xl font-bold animate-float">&lt;/&gt;</div>
              <div className="absolute bottom-10 right-10 text-white/10 text-6xl font-bold animate-float-slow">&lt;/&gt;</div>
              <div className="relative z-10 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl animate-pulse"></div>
                  <img 
                    src="/src/assets/login.gif" 
                    alt="Welcome" 
                    className="w-full max-w-md mx-auto rounded-2xl shadow-2xl animate-float relative z-10 hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h2 className="text-white text-3xl font-bold mt-8 animate-fade-in-delay drop-shadow-lg">Welcome To Your Digital</h2>
                <h2 className="text-white text-3xl font-bold animate-fade-in-delay-2 drop-shadow-lg">Classroom</h2>
                <div className="mt-6 flex justify-center gap-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>

            {/* Right side form */}
            <div className="md:w-1/2 p-12 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
              <div className="max-w-md mx-auto relative z-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-fade-in-delay bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Welcome Back</h1>
                <p className="text-gray-600 mb-8 animate-fade-in-delay-2">Please enter your credentials to access your account</p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Username */}
                  <div className="animate-fade-in-delay-3 group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 outline-none hover:border-indigo-400 hover:shadow-md"
                      placeholder="Enter your username"
                    />
                  </div>

                  {/* Password */}
                  <div className="animate-fade-in-delay-4 group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 outline-none hover:border-indigo-400 hover:shadow-md"
                      placeholder="Enter your password"
                    />
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between animate-fade-in-delay-5">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors">Forgot Password?</button>
                  </div>

                  {/* Single Login Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-indigo-500/50 animate-fade-in-delay-6 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Login</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>

                  {/* Sign Up */}
                  <p className="text-center text-sm text-gray-600 animate-fade-in-delay-7">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => window.location.href='/register'} className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">Sign Up</button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations and styles */}
      <style>{`
        @keyframes fade-in { from {opacity:0; transform:translateY(-10px);} to {opacity:1; transform:translateY(0);} }
        @keyframes slide-up { from {opacity:0; transform:translateY(30px);} to {opacity:1; transform:translateY(0);} }
        @keyframes float {0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);} }
        @keyframes float-slow {0%,100%{transform:translate(0,0);}33%{transform:translate(30px,-30px);}66%{transform:translate(-20px,20px);} }
        @keyframes float-slower {0%,100%{transform:translate(0,0);}50%{transform:translate(-40px,-40px);} }
        @keyframes particle-1 {0%,100%{transform:translate(0,0);opacity:0.4;}50%{transform:translate(100px,-100px);opacity:0;} }
        @keyframes particle-2 {0%,100%{transform:translate(0,0);opacity:0.3;}50%{transform:translate(-80px,80px);opacity:0;} }
        @keyframes particle-3 {0%,100%{transform:translate(0,0);opacity:0.35;}50%{transform:translate(90px,90px);opacity:0;} }
        @keyframes particle-4 {0%,100%{transform:translate(0,0);opacity:0.4;}50%{transform:translate(-70px,-70px);opacity:0;} }
        @keyframes shimmer {0%{background-position:-100% 0;}100%{background-position:200% 0;} }
        .animate-fade-in{animation:fade-in 0.6s ease-out;}
        .animate-fade-in-delay{animation:fade-in 0.6s ease-out 0.1s both;}
        .animate-fade-in-delay-2{animation:fade-in 0.6s ease-out 0.2s both;}
        .animate-fade-in-delay-3{animation:fade-in 0.6s ease-out 0.3s both;}
        .animate-fade-in-delay-4{animation:fade-in 0.6s ease-out 0.4s both;}
        .animate-fade-in-delay-5{animation:fade-in 0.6s ease-out 0.5s both;}
        .animate-fade-in-delay-6{animation:fade-in 0.6s ease-out 0.6s both;}
        .animate-fade-in-delay-7{animation:fade-in 0.6s ease-out 0.7s both;}
        .animate-slide-up{animation:slide-up 0.8s ease-out;}
        .animate-float{animation:float 3s ease-in-out infinite;}
        .animate-float-slow{animation:float-slow 8s ease-in-out infinite;}
        .animate-float-slower{animation:float-slower 10s ease-in-out infinite;}
        .animate-particle-1{animation:particle-1 8s ease-in-out infinite;}
        .animate-particle-2{animation:particle-2 10s ease-in-out infinite;}
        .animate-particle-3{animation:particle-3 9s ease-in-out infinite;}
        .animate-particle-4{animation:particle-4 11s ease-in-out infinite;}
        .animate-shimmer{background-size:200% auto;animation:shimmer 3s linear infinite;}
        .bg-grid-pattern {background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px;}
      `}</style>
    </div>
  );
}
