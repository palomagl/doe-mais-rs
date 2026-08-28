import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGuest } from "@/lib/guest";
import FullScreenLoader from "@/components/FullScreenLoader";

const Login = lazy(() => import("@/pages/Login"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const NewDonor = lazy(() => import("@/pages/NewDonor"));
const EligibilityQuiz = lazy(() => import("@/pages/EligibilityQuiz"));
const DonorRegister = lazy(() => import("@/pages/DonorRegister"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const BloodCenters = lazy(() => import("@/pages/BloodCenters"));
const Rewards = lazy(() => import("@/pages/Rewards"));
const Profile = lazy(() => import("@/pages/Profile"));
const Benefits = lazy(() => import("@/pages/Benefits"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const GameLayout = lazy(() => import("@/game/GameLayout"));
const GameHome = lazy(() => import("@/game/screens/Home"));
const GameMapa = lazy(() => import("@/game/screens/Mapa"));
const GameMissoes = lazy(() => import("@/game/screens/Missoes"));
const GameRanking = lazy(() => import("@/game/screens/Ranking"));
const GamePerfil = lazy(() => import("@/game/screens/Perfil"));
const GameConquistas = lazy(() => import("@/game/screens/Conquistas"));
const GameResultado = lazy(() => import("@/game/screens/Resultado"));
const GameJogar = lazy(() => import("@/game/screens/Jogar"));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const guest = useGuest();

  if (guest) return <>{children}</>;
  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
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

    <Route path="/jogo" element={<ProtectedRoute><GameLayout /></ProtectedRoute>}>
      <Route index element={<GameHome />} />
      <Route path="mapa" element={<GameMapa />} />
      <Route path="missoes" element={<GameMissoes />} />
      <Route path="ranking" element={<GameRanking />} />
      <Route path="perfil" element={<GamePerfil />} />
      <Route path="conquistas" element={<GameConquistas />} />
      <Route path="resultado" element={<GameResultado />} />
      <Route path="jogar/:phase" element={<GameJogar />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
