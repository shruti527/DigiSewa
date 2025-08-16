import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Services from "./pages/Services";
import Dashboard from "./pages/Dashboard";
import TrackApplication from "./pages/TrackApplication";
import ApplicationForm from "./pages/ApplicationForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/profile";
import Notifications from "./pages/notification";

import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* ✅ Global Header (renders once) */}
          <Header />

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceId" element={<Services />} />

            {/* Protected routes */}
            <Route
              path="/apply/:serviceId"
              element={
                <PrivateRoute>
                  <ApplicationForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/track"
              element={
                <PrivateRoute>
                  <TrackApplication />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
