import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import UnifiedMaterialSection from './components/UnifiedMaterialSection';
import UnifiedDiscussionForum from './components/UnifiedDiscussionForum';
import Support from './pages/Support';
// Home Component (Navbar + Hero)
const Home = () => (
  <>
    <Hero />
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">More Content Coming Soon...</h2>
    </div>
  </>
);

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-[#1e1e1e] transition-colors duration-300">

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/materials" element={
            <div className="p-8 min-h-screen bg-gray-50 dark:bg-[#1e1e1e] max-w-7xl mx-auto">
              <UnifiedMaterialSection mode="guest" />
            </div>
          } />
          <Route path="/support" element={<Support />} />
          <Route path="/forum" element={<UnifiedDiscussionForum />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;