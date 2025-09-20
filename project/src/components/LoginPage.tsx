import React, { useState } from "react";
<<<<<<< HEAD
import { X, Car, Mail, Lock, User, Phone, Loader2, ChevronDown } from "lucide-react";
=======
import { X, Car, Mail, Lock, Loader2 } from "lucide-react";
>>>>>>> 286d2779cbcd9224bc3c4a387af14aac7de1f27f
import { useAuth } from "../hooks/useAuth.tsx";

interface LoginPageProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "login" | "signup";
}

const LoginPage: React.FC<LoginPageProps> = ({
  isOpen,
  onClose,
  initialMode,
}) => {
  // login-only flow
  const [who, setWho] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
=======
>>>>>>> 286d2779cbcd9224bc3c4a387af14aac7de1f27f
  const [error, setError] = useState("");

  const { login, adminLogin, signup, isLoading } = useAuth();

  // keep backward compatibility with prop but ignore signup
  React.useEffect(() => {
    // no-op: always show login
  }, [initialMode]); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const success = who === 'admin' ? await adminLogin(email, password) : await login(email, password);

      if (success) {
        onClose();
        setEmail("");
        setPassword("");
<<<<<<< HEAD
        setName("");
        setPhone("");
        setRole("user");
      } else {
        setError(
          "Invalid credentials."
        );
=======
      } else {
        setError("Invalid email or password.");
>>>>>>> 286d2779cbcd9224bc3c4a387af14aac7de1f27f
      }
    } catch (err) {
      const message = (err as any)?.response?.data?.error || 'An error occurred. Please try again.';
      setError(message);
    }
  };

  const roles = [
    { value: "user", label: "User" },
    { value: "manager", label: "Manager" },
    { value: "admin", label: "Administrator" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-6 w-6 text-white" />
              <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close login modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {
            <div className="flex justify-center gap-2">
              <button
                type="button"
                className={`px-3 py-1 rounded-lg text-sm ${who === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setWho('user')}
              >
                User
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded-lg text-sm ${who === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setWho('admin')}
              >
                Admin
              </button>
            </div>
          }
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

<<<<<<< HEAD
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                  Phone Number
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between pl-3 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  >
                    <span>{roles.find(r => r.value === role)?.label}</span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>
                  
                  {showRoleDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      {roles.map((roleOption) => (
                        <button
                          key={roleOption.value}
                          type="button"
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            setRole(roleOption.value);
                            setShowRoleDropdown(false);
                          }}
                        >
                          {roleOption.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
=======
>>>>>>> 286d2779cbcd9224bc3c4a387af14aac7de1f27f

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
              <span>Sign In</span>
            )}
          </button>
<<<<<<< HEAD

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setRole("user");
              }}
              className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
=======
>>>>>>> 286d2779cbcd9224bc3c4a387af14aac7de1f27f
        </form>
      </div>
    </div>
  );
};

export default LoginPage;