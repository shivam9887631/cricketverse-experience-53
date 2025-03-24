
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import MatchDetails from "./pages/MatchDetails";
import Tournament from "./pages/Tournament";
import PlayerProfile from "./pages/PlayerProfile";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";

const queryClient = new QueryClient();

// AnimationLayout component to handle page transitions
const AnimationLayout = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/match" element={<MatchDetails />} />
        <Route path="/match/:id" element={<MatchDetails />} />
        <Route path="/tournament" element={<Tournament />} />
        <Route path="/players/:id" element={<PlayerProfile />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {showSplash ? (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        ) : (
          <BrowserRouter>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AnimationLayout />
            </TooltipProvider>
          </BrowserRouter>
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
