
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/landing/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProjectDetails from './pages/dashboard/ProjectDetails';
import Messaging from './pages/dashboard/Messaging';
import VideoCall from './pages/dashboard/VideoCall';
import CreateProject from './pages/dashboard/CreateProject';
import ProjectsList from './pages/dashboard/ProjectsList';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // Redirect to the landing page if not authenticated
    return <Navigate to="/" />; 
  }
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    if (user) {
        return <Navigate to="/dashboard/home" replace />;
    }
    return <>{children}</>;
};

const RoleProtectedRoute: React.FC<{ children: React.ReactNode, allowedRoles: UserRole[] }> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to a safe page if user role is not allowed
    return <Navigate to="/dashboard/home" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<DashboardHome />} />
        <Route path="projects" element={<ProjectsList />} />
        <Route path="project/:id" element={<ProjectDetails />} />
        <Route path="messaging" element={<Messaging />} />
        <Route path="video-call" element={<VideoCall />} />
        <Route 
          path="create-project" 
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Client]}>
              <CreateProject />
            </RoleProtectedRoute>
          } 
        />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="bg-slate-100 min-h-screen text-slate-900 antialiased">
          <AppRoutes />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;