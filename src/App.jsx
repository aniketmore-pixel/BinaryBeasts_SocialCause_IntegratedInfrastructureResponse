import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import CitizenDashboard from "./pages/CitizenDashboard";
import OfficialDashboard from "./pages/OfficialDashboard";
import ReportIssue from "./pages/ReportIssue";
import InfrastructureMap from "./pages/Admin/InfrastructureMap";
import Analytics from "./pages/Analytics";
import InfraDetails from "./pages/Admin/InfraDetails";
import ReportsPage from "./pages/Admin/ReportsPage";
import AssessmentReport from "./pages/Admin/AssessmentReport";
import ContractDashboard from "./pages/Admin/ContractDashboard";
import CreateContract from "./pages/Admin/CreateContract";
import EscrowDashboard from "./pages/Admin/EscrowDashboard";
import WaterManagement from "./pages/Admin/WaterManagement";
import GeminiChatbot from "./components/GeminiChatbot";

import GoogleTranslateIcon from "./components/GoogleTranslateIcon";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Public */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* Citizen */}
        <Route path="/citizen-portal" element={<ProtectedRoute allowedRoles={["USER"]}><CitizenDashboard /></ProtectedRoute>} />
        <Route path="/report-issue" element={<ProtectedRoute allowedRoles={["USER"]}><ReportIssue /></ProtectedRoute>} />

        <Route path="/infrastructure-map" element={<ProtectedRoute allowedRoles={["ADMIN"]}><InfrastructureMap /></ProtectedRoute>} />
        <Route path="/infra/:id" element={<InfraDetails />} />

        {/* Officials */}
        <Route path="/analytics" element={<ProtectedRoute allowedRoles={["OFFICIAL","ADMIN"]}><Analytics /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute allowedRoles={["OFFICIAL","ADMIN"]}><ReportsPage /></ProtectedRoute>} />
        <Route path="/assessment-report" element={<ProtectedRoute allowedRoles={["OFFICIAL","ADMIN"]}><AssessmentReport /></ProtectedRoute>} />
        <Route path="/contract-dashboard" element={<ContractDashboard />} />
        <Route path="/create-contract" element={<CreateContract />} />
        <Route path="/view-escrows" element={<EscrowDashboard />} />
        <Route path="/water-grid" element={<ProtectedRoute allowedRoles={["OFFICIAL", "ADMIN"]}><WaterManagement /></ProtectedRoute>} />


      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <GoogleTranslateIcon />
        <AnimatedRoutes />
        <GeminiChatbot />
      </Router>
    </AuthProvider>
  );
}

export default App;
