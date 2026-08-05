import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { initNative } from "@/lib/native";
import { useGuest } from "@/lib/guest";
import ErrorBoundary from "@/components/ErrorBoundary";
import OfflineBanner from "@/components/OfflineBanner";

const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const NewDonor = lazy(() => import("./pages/NewDonor"));
const EligibilityQuiz = lazy(() => import("./pages/EligibilityQuiz"));
const DonorRegister = lazy(() => import("./pages/DonorRegister"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BloodCenters = lazy(() => import("./pages/BloodCenters"));
const Rewards = lazy(() => import("./pages/Rewards"));
const Profile = lazy(() => import("./pages/Profile"));
const Benefits = lazy(() => import("./pages/Benefits"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const FullScreenLoader = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-soft-pulse">
      <div className="w-6 h-6 rounded-full bg-primary animate-soft-pulse" />
    </div>
    <p className="text-sm text-muted-foreground font-medium">Carregando Doe+ RS...</p>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const guest = useGuest();
  if (guest) return <>{children}</>;
  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => {
  useEffect(() => { initNative(); }, []);
  return (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OfflineBanner />
        <BrowserRouter>
          <Suspense fallback={<FullScreenLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/new-donor" element={<ProtectedRoute><NewDonor /></ProtectedRoute>} />
              <Route path="/eligibility-quiz" element={<ProtectedRoute><EligibilityQuiz /></ProtectedRoute>} />
              <Route path="/donor-register" element={<ProtectedRoute><DonorRegister /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/centers" element={<ProtectedRoute><BloodCenters /></ProtectedRoute>} />
              <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/benefits" element={<ProtectedRoute><Benefits /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
  );
};

export default App;
