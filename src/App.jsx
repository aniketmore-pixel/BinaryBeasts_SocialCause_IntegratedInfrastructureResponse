import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficialDashboard from './pages/OfficialDashboard';
import { AnimatePresence } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/citizen-portal" element={<CitizenDashboard />} />
        <Route path="/analytics" element={<OfficialDashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <main className="app-main">
          <AnimatedRoutes />
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;
