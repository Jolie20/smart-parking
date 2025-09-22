import React, { useState } from "react";
import { X, Car, Mail, Lock, Loader2, User as UserIcon, Phone } from "lucide-react";
import { useAuth } from "../hooks/useAuth.tsx";

interface AuthPageProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "login" | "signup";
}

const AuthPage: React.FC<AuthPageProps> = ({ isOpen, onClose, initialMode }) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [who, setWho] = useState<"user" | "admin" | "manager">("user");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, adminLogin, managerLogin, signup, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let success = false;

      if (mode === "signup") {
        success = await signup(email, password, name, phone || undefined);
      } else {
        if (who === "admin") {
          success = await adminLogin(email, password);
        } else if (who === "manager") {
          success = await managerLogin(email, password);
        } else {
          success = await login(email, password);
        }
      }

      if (success) {
        onClose();
        setEmail("");
        setPassword("");
        setName("");
        setPhone("");
      } else {
        setError("Invalid credentials or signup failed.");
      }
    } catch (err) {
      const message =
        (err as any)?.response?.data?.error ||
        "An error occurred. Please try again.";
      setError(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-6 w-6 text-white" />
              <h2 className="text-xl font-semibold text-white">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === "login" && (
            <div className="flex justify-center gap-2">
              {["user", "admin", "manager"].map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`px-3 py-1 rounded-lg text-sm ${
                    who === role
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setWho(role as any)}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {mode === "signup" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === "login" ? "Sign In" : "Sign Up"}</span>
            )}
          </button>
        </form>

        {/* Footer Switch */}
        <div className="px-6 py-4 text-center text-sm text-gray-600">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 hover:underline"
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
