import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import Navbar from "./Navbar";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully!");
      navigate("/chat");
    } catch (error: any) {
      // Provide user-friendly error messages
      let errorMessage = "An error occurred. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
              Create an Account
            </h1>
            <p className="text-slate-300">
              Join GimmyAI to get help with your homework
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="auth-input-field text-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
                className="auth-input-field text-white"
                placeholder="Create a password (min. 6 characters)"
              />
              {password && password.length < 6 && (
                <p className="text-sm text-yellow-400 mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="auth-input-field text-white"
                placeholder="Confirm your password"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-400 mt-1">
                  Passwords do not match
                </p>
              )}
              {confirmPassword && password === confirmPassword && password.length >= 6 && (
                <p className="text-sm text-green-400 mt-1">
                  Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="text-center text-slate-400">
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-400 hover:text-blue-300">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
