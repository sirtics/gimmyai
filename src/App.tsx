import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ReCaptchaProvider from "./components/ReCaptchaProvider";
import Navbar from "./components/Navbar";
import ChatInterface from "./components/ChatInterface";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import LandingPage from "./components/LandingPage";
import NotFound from "./components/NotFound";
import MaintenancePage from "./components/MaintenancePage";
import { MAINTENANCE_MODE, getMaintenanceConfig } from "./config/maintenance";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "sonner";
import "./utils/maintenanceToggle"; // Enables console helpers

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/signin" />;
  }

  // Check if email is verified
  if (!user.emailVerified) {
    const [isResending, setIsResending] = useState(false);

    const handleResendVerification = async () => {
      setIsResending(true);
      try {
        await sendEmailVerification(user);
        toast.success("Verification email sent! Please check your inbox.");
      } catch (error: any) {
        if (error.code === "auth/too-many-requests") {
          toast.error("Too many requests. Please wait a few minutes before trying again.");
        } else {
          toast.error("Failed to send verification email. Please try again later.");
        }
      } finally {
        setIsResending(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
            <div className="mb-4 text-yellow-400">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Email Verification Required</h2>
            <p className="text-slate-300 mb-6">
              Please verify your email address to access GimmyAI. Check your inbox for a verification link.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                I've verified my email
              </button>
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:bg-slate-800 disabled:cursor-not-allowed"
              >
                {isResending ? "Sending..." : "Resend verification email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  // Check if maintenance mode is enabled
  if (MAINTENANCE_MODE) {
    const config = getMaintenanceConfig("reconstruction"); // Change scenario as needed
    return <MaintenancePage {...config} />;
  }

  return (
    <HelmetProvider>
      <ReCaptchaProvider>
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-slate-900 text-white">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signin" element={<SignInForm />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                <Route
                  path="/chat"
                  element={
                    <PrivateRoute>
                      <ChatInterface />
                    </PrivateRoute>
                  }
                />
                {/* Maintenance route for testing */}
                <Route
                  path="/maintenance"
                  element={
                    <MaintenancePage
                      {...getMaintenanceConfig("reconstruction")}
                    />
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </AuthProvider>
        </Router>
      </ReCaptchaProvider>
    </HelmetProvider>
  );
}

export default App;
