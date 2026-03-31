import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import NewDonor from "./pages/NewDonor";
import EligibilityQuiz from "./pages/EligibilityQuiz";
import DonorRegister from "./pages/DonorRegister";
import Dashboard from "./pages/Dashboard";
import BloodCenters from "./pages/BloodCenters";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary font-bold text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/new-donor" element={<ProtectedRoute><NewDonor /></ProtectedRoute>} />
          <Route path="/eligibility-quiz" element={<ProtectedRoute><EligibilityQuiz /></ProtectedRoute>} />
          <Route path="/donor-register" element={<ProtectedRoute><DonorRegister /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/centers" element={<ProtectedRoute><BloodCenters /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
