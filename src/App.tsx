import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useAuth } from "@/hooks/useAuth";
import Access from "./pages/Access";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import ResultsDemo from "./pages/ResultsDemo";
import GamesDemo from "./pages/GamesDemo";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherPortal from "./pages/TeacherPortal";

const queryClient = new QueryClient();

function AuthenticatedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LanguageToggle />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Access />} />
            <Route path="/results-demo" element={<AuthenticatedRoute><ResultsDemo /></AuthenticatedRoute>} />
            <Route path="/games-demo" element={<AuthenticatedRoute><GamesDemo /></AuthenticatedRoute>} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/teacher" element={<TeacherPortal />} />
            <Route path="/teacher-login" element={<Navigate to="/teacher/login" replace />} />
            <Route path="/teacher/login" element={<TeacherLogin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
