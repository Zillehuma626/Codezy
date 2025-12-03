import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CodezyRegister() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "individual_learner", // default role
  });

  const navigate = useNavigate(); // navigation hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, username, email, password, confirmPassword, role } = formData;

    if (!fullName || !username || !email || !password) {
      alert("Please fill all required fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // REGISTER
      const registerRes = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, email, password, role }),
      });

      const registerData = await registerRes.json();
      if (!registerRes.ok) {
        alert(registerData.message || "Registration failed");
        return;
      }

      // LOGIN
      const loginRes = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        alert(loginData.message || "Login failed after registration");
        return;
      }

      // SAVE AUTH DATA
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("userId", loginData.userId);
      localStorage.setItem("role", loginData.role);
      localStorage.setItem("email", loginData.email || ""); // optional, for checkout

      // REDIRECT LOGIC
      const redirectAfterLogin = sessionStorage.getItem("redirectAfterLogin");
      if (redirectAfterLogin) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectAfterLogin, { replace: true });
        return;
      }

      // ROLE ROUTES (fallback if no redirect)
      const roleRoutes = {
        individual_learner: "/learner",
        organization: "/admin",
      };
      const redirectRoute = roleRoutes[loginData.role] || "/";
      navigate(redirectRoute, { replace: true });

    } catch (err) {
      console.error("REGISTRATION/LOGIN ERROR:", err);
      alert("Error during registration or login.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animations */}
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

      {/* Main Register Form */}
      <div className="relative z-10 w-full max-w-5xl animate-slide-up">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-purple-500/20 transition-shadow duration-500">
          <div className="flex flex-col md:flex-row">
            {/* Left Image */}
            <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 p-12 flex items-center justify-center relative overflow-hidden">
              <img src="/src/assets/login.gif" alt="Register" className="w-full max-w-md mx-auto rounded-2xl shadow-2xl" />
            </div>

            {/* Right Form */}
            <div className="md:w-1/2 p-12 relative">
              <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                <p className="text-gray-600 mb-8">Fill in your details to get started!</p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-300"
                  />
                  <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-300"
                  />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-300"
                  />
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-300"
                  />
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-300"
                  />

                  {/* Role Selection */}
                  <div className="flex flex-col space-y-2">
                    {["individual_learner", "organization"].map((r) => (
                      <label key={r} className="flex items-center gap-2">
                        <input type="radio" name="role" value={r} checked={formData.role === r} onChange={handleChange} className="w-4 h-4 text-indigo-600 border-gray-300"/>
                        {r.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                    ))}
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg">
                    Register
                  </button>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button onClick={() => navigate("/login")} className="text-indigo-600 hover:text-indigo-800 font-semibold">
                      Login
                    </button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
