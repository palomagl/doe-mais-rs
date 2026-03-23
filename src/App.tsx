import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Onboarding from "./pages/Onboarding";
import NewDonor from "./pages/NewDonor";
import EligibilityQuiz from "./pages/EligibilityQuiz";
import DonorRegister from "./pages/DonorRegister";
import Dashboard from "./pages/Dashboard";
import BloodCenters from "./pages/BloodCenters";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/new-donor" element={<NewDonor />} />
          <Route path="/eligibility-quiz" element={<EligibilityQuiz />} />
          <Route path="/donor-register" element={<DonorRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/centers" element={<BloodCenters />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
