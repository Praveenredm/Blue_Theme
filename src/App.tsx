import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import HealthAssistant from "./pages/patient/HealthAssistant";

// PCP Pages
import PCPDashboard from "./pages/pcp/PCPDashboard";
import PatientDataEntry from "./pages/pcp/PatientDataEntry";

// Specialist Pages
import SpecialistDashboard from "./pages/specialist/SpecialistDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return <>{children}</>;
}

// App Routes Component
function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          isAuthenticated && user 
            ? <Navigate to={`/${user.role}`} replace /> 
            : <LandingPage />
        } 
      />
      <Route 
        path="/auth" 
        element={
          isAuthenticated && user 
            ? <Navigate to={`/${user.role}`} replace /> 
            : <AuthPage />
        } 
      />

      {/* Patient Routes */}
      <Route path="/patient" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/patient/referrals" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/patient/appointments" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/patient/chat" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <HealthAssistant />
        </ProtectedRoute>
      } />
      <Route path="/patient/recommendations" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/patient/feedback" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />

      {/* PCP Routes */}
      <Route path="/pcp" element={
        <ProtectedRoute allowedRoles={['pcp']}>
          <PCPDashboard />
        </ProtectedRoute>
      } />
      <Route path="/pcp/patient-entry" element={
        <ProtectedRoute allowedRoles={['pcp']}>
          <PatientDataEntry />
        </ProtectedRoute>
      } />
      <Route path="/pcp/evaluation" element={
        <ProtectedRoute allowedRoles={['pcp']}>
          <PCPDashboard />
        </ProtectedRoute>
      } />
      <Route path="/pcp/matching" element={
        <ProtectedRoute allowedRoles={['pcp']}>
          <PCPDashboard />
        </ProtectedRoute>
      } />
      <Route path="/pcp/alternative" element={
        <ProtectedRoute allowedRoles={['pcp']}>
          <PCPDashboard />
        </ProtectedRoute>
      } />
      <Route path="/pcp/progress" element={
        <ProtectedRoute allowedRoles={['pcp']}>
          <PCPDashboard />
        </ProtectedRoute>
      } />

      {/* Specialist Routes */}
      <Route path="/specialist" element={
        <ProtectedRoute allowedRoles={['specialist']}>
          <SpecialistDashboard />
        </ProtectedRoute>
      } />
      <Route path="/specialist/requests" element={
        <ProtectedRoute allowedRoles={['specialist']}>
          <SpecialistDashboard />
        </ProtectedRoute>
      } />
      <Route path="/specialist/availability" element={
        <ProtectedRoute allowedRoles={['specialist']}>
          <SpecialistDashboard />
        </ProtectedRoute>
      } />
      <Route path="/specialist/treatment" element={
        <ProtectedRoute allowedRoles={['specialist']}>
          <SpecialistDashboard />
        </ProtectedRoute>
      } />
      <Route path="/specialist/outcomes" element={
        <ProtectedRoute allowedRoles={['specialist']}>
          <SpecialistDashboard />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/performance" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/guidelines" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/logs" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
