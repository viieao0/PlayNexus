import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompanyDashboard from "./pages/CompanyDashboard";
import YoutuberDashboard from "./pages/YoutuberDashboard";
import GameDetails from "./pages/GameDetails"; // ✅ NEW

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function NotFound() {
  return (
    <div className="page">
      <h2 className="page-title">404 - Page Not Found</h2>
      <p className="page-sub">This page does not exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ✅ Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Protected routes with Navbar */}
          <Route
            path="/company"
            element={
              <ProtectedRoute role="company">
                <AppLayout>
                  <CompanyDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/youtuber"
            element={
              <ProtectedRoute role="youtuber">
                <AppLayout>
                  <YoutuberDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* ✅ NEW: Game Details route */}
          <Route
            path="/games/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <GameDetails />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* ✅ fallback */}
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
