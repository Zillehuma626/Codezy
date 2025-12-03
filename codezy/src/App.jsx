import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import CodezyLogin from "./components/loginpage";
import CreateLabPage from "./components/TeacherDashboard/CreateLabPage";
import MyCoursesPage from "./components/TeacherDashboard/MyCoursesPage";
import Reports from "./components/TeacherDashboard/ReportsPage";
import Profile from "./components/TeacherDashboard/ProfilePage";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import ManageTeachers from "./components/AdminDashboard/ManageTeachers";
import ManageCourses from "./components/AdminDashboard/ManageCourses";
import StudentDashboard from "./components/StudentDashboard/StudentDashboard";
import LandingPage from "./components/landingpage";
import SubscriptionPage from "./components/subscriptionpage.jsx";
import CartPage from "./components/cartpage.jsx";
import CheckoutPage from "./components/checkoutpage.jsx";
import RegisterPage from "./components/registerpage.jsx";
import TeacherDashboard from "./components/TeacherDashboard/TeacherDashboard.jsx";
import CourseStudents from "./components/TeacherDashboard/CourseStudents.jsx";
import PaymentSuccess from "./components/PaymentSuccess.jsx";
import PaymentCancel from "./components/PaymentCancel.jsx";

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const plan = JSON.parse(localStorage.getItem("selectedPlan"));
    if (plan) setSelectedPlan(plan);
  }, []);

  const handleNavigate = (path) => {
    window.history.pushState({}, "", path);
    if (path === "/cart" || path === "/checkout" || path === "/subscription") {
      const plan = JSON.parse(localStorage.getItem("selectedPlan"));
      setSelectedPlan(plan || null);
    }
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<LandingPage onNavigate={handleNavigate} />} />
      <Route path="/subscription" element={<SubscriptionPage onNavigate={handleNavigate} />} />
      <Route path="/login" element={<CodezyLogin />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage selectedPlan={selectedPlan} onNavigate={handleNavigate} />} />
      <Route path="/checkout" element={<CheckoutPage selectedPlan={selectedPlan} onNavigate={handleNavigate} />} />
      <Route path="/learner" element={<StudentDashboard />} />
      <Route path="/organization" element={<StudentDashboard />} />
      <Route path="/createlab" element={<CreateLabPage />} />
      <Route path="/mycourses" element={<MyCoursesPage />} />
      <Route path="/Reports" element={<Reports />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/teacher" element={<TeacherDashboard />} /> 
      <Route path="/courses/:courseId/class/:classId/students" element={<CourseStudents />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/teachers" element={<ManageTeachers />} />
      <Route path="/admin/courses" element={<ManageCourses />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-cancel" element={<PaymentCancel />} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}
