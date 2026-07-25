import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { AuthError } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./hooks/useAuth";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Schedule from "./Schedule";
import Analytics from "./Analytics";
import Notifications from "./Notifications";
import AI_Recommendation from "./AI_Recommendation";
import Devices from "./Devices";
import Inventory from "./Inventory";
import Profile from "./Profile";
import Settings from "./Settings";
import FAQ from "./FAQ";
import { useUserProfile } from "./hooks/useFirestore";

type Role = "admin" | "farm_owner" | "farm_staff" | "viewer";

const routeAccess: Record<string, Role[]> = {
  "/dashboard": ["admin", "farm_owner", "farm_staff", "viewer"],
  "/schedule": ["admin", "farm_owner", "farm_staff"],
  "/analytics": ["admin", "farm_owner", "farm_staff", "viewer"],
  "/notifications": ["admin", "farm_owner", "farm_staff", "viewer"],
  "/ai_recommendation": ["admin", "farm_owner", "farm_staff", "viewer"],
  "/devices": ["admin", "farm_owner"],
  "/inventory": ["admin", "farm_owner"],
  "/profile": ["admin", "farm_owner", "farm_staff", "viewer"],
  "/settings": ["admin", "farm_owner"],
  "/faq": ["admin", "farm_owner", "farm_staff", "viewer"],
};

/* ================= PROTECTED ROUTE ================= */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const location = useLocation();
  const role = profile?.role as Role | undefined;
  const currentPath = location.pathname;
  const allowedRoles = routeAccess[currentPath];

  if (loading || profileLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0a192f",
          color: "#fff",
          fontSize: "1rem",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            border: "3px solid rgba(255,255,255,0.2)",
            borderTop: "3px solid #005BBF",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        Loading...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

/* ================= LOGIN ================= */
function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const getFriendlyError = (code: string): string => {
    switch (code) {
      case "auth/user-not-found":
      case "auth/invalid-credential":
        return "No account found with these credentials. Please check your email and password.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      default:
        return "Sign in failed. Please check your credentials and try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      const authError = err as AuthError;
      setError(getFriendlyError(authError.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      {/* ================= TOP NAVBAR ================= */}
      <header className="top-navbar">
        <div className="nav-left">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBZwXJ1Dj8t1Dl9_kNMyeYMnufW5igHVX-kUgbaUFiDjf6zcesivFSHfBtWk3K6xa_DvSY6lx_28wX3tmwnUhqpgS-sWI6ghllOxodNwqg-ab4L4asPXVd7AISlPq7OS953j3ecXAVh6Lhwyx4YRdhspIfsbIJNilPdMRENv4vmbH3yWc9G20Al4Gufe8rR4vTPNFfeyceXQpu6rjB434K6pSwajZlxsRk47LRRTQeLZ75BnX_wTZ0F6EFNcGIoDkVyJCEUpHkGEc"
            alt="FIZFEED"
            className="nav-logo"
          />
          <span className="nav-title">FIZFEED</span>
        </div>

        <div className="nav-right">
          <span className="nav-tagline">Aquatic Intelligence</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Header */}
        <header className="header">
          <div className="logo-container">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBZwXJ1Dj8t1Dl9_kNMyeYMnufW5igHVX-kUgbaUFiDjf6zcesivFSHfBtWk3K6xa_DvSY6lx_28wX3tmwnUhqpgS-sWI6ghllOxodNwqg-ab4L4asPXVd7AISlPq7OS953j3ecXAVh6Lhwyx4YRdhspIfsbIJNilPdMRENv4vmbH3yWc9G20Al4Gufe8rR4vTPNFfeyceXQpu6rjB434K6pSwajZlxsRk47LRRTQeLZ75BnX_wTZ0F6EFNcGIoDkVyJCEUpHkGEc"
              alt="FIZFEED Logo"
            />
          </div>

          <h1>Welcome Back</h1>
          <p>Monitor and optimize your feed efficiency</p>
        </header>

        {/* Login Card */}
        <section className="login-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  background: "rgba(220,38,38,0.1)",
                  border: "1px solid rgba(220,38,38,0.3)",
                  color: "#dc2626",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  fontSize: "0.85rem",
                  marginBottom: "8px",
                }}
              >
                {error}
              </div>
            )}

            {/* OPTIONS */}
            <div className="options">
              <div className="remember">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>

              <button
                type="button"
                className="forgot"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                onClick={async () => {
                  if (!email.trim()) {
                    setError("Please enter your email address above first to reset your password.");
                    return;
                  }
                  try {
                    const { sendPasswordResetEmail } = await import("firebase/auth");
                    await sendPasswordResetEmail(auth, email.trim());
                    alert(`Password reset link sent to ${email.trim()}! Check your inbox.`);
                  } catch (err: any) {
                    setError(err?.message || "Failed to send password reset email.");
                  }
                }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

            <p className="signup">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </section>

        {/* FOOTER KEPT */}
        <footer className="footer">
          <p>Smart Feeding Optimization System</p>
          <p>© 2025 FIZFEED - TIP Quezon City</p>
        </footer>
      </main>
    </div>
  );
}

/* ================= APP ROUTER ================= */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai_recommendation"
          element={
            <ProtectedRoute>
              <AI_Recommendation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/devices"
          element={
            <ProtectedRoute>
              <Devices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faq"
          element={
            <ProtectedRoute>
              <FAQ />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export { signOut, auth };
export default App;

