import "./Signup.css";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useAuth } from "./hooks/useAuth";

function Signup() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farm_owner");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      // Save the user's display name
      await updateProfile(userCredential.user, {
        displayName: fullName.trim(),
      });
      
      const uid = userCredential.user.uid;
      
      // Create user document
      await setDoc(doc(db, "users", uid), {
        displayName: fullName.trim(),
        email: email.trim(),
        role,
        farmName: farmName.trim() || "My Aqua Farm",
        address: address.trim(),
        phone: "",
        location: address.trim(),
        createdAt: serverTimestamp()
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error: ", err);
      setError("Sign up failed. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
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

      {/* Center Wrapper */}
      <div className="signup-wrapper">
        <div className="signup-card">
          <div className="logo-container">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBZwXJ1Dj8t1Dl9_kNMyeYMnufW5igHVX-kUgbaUFiDjf6zcesivFSHfBtWk3K6xa_DvSY6lx_28wX3tmwnUhqpgS-sWI6ghllOxodNwqg-ab4L4asPXVd7AISlPq7OS953j3ecXAVh6Lhwyx4YRdhspIfsbIJNilPdMRENv4vmbH3yWc9G20Al4Gufe8rR4vTPNFfeyceXQpu6rjB434K6pSwajZlxsRk47LRRTQeLZ75BnX_wTZ0F6EFNcGIoDkVyJCEUpHkGEc"
              alt="FIZFEED"
            />
          </div>

          <h1>Create Account</h1>

          <p className="subtitle">
            Join the next generation of aquatic data intelligence.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSubmitting}
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label>Farm Name</label>
              <input
                type="text"
                placeholder="Oceanic Aqua Farm"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>Farm Address</label>
              <textarea
                placeholder="Street, Barangay, City, Province"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  resize: "vertical"
                }}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

            <div className="form-group password-group">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="show-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="admin">Admin</option>
                <option value="farm_owner">Farm Owner</option>
                <option value="farm_staff">Farm Staff</option>
                <option value="viewer">Viewer</option>
              </select>
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

            {/* Terms Checkbox */}
            <div className="terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <button type="button" style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0 }} onClick={() => alert("FIZFEED Terms of Service:\n1. Use system responsibly.\n2. Do not overload feeding schedules.\n3. Ensure IoT hardware security.")}>Terms of Service</button> and{" "}
                <button type="button" style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0 }} onClick={() => alert("FIZFEED Privacy Policy:\nYour farm telemetry, sensor logs, and account credentials are saved securely in Firebase Cloud Firestore and never shared with third parties.")}>Privacy Policy</button>.
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          <p className="signin">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <span className="footer-brand">FIZFEED</span>
          <p>© 2024 FIZFEED Aquatic Intelligence. All rights reserved.</p>

          <div className="footer-links">
            <button type="button" style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0 }} onClick={() => alert("FIZFEED Privacy Policy:\nYour farm telemetry, sensor logs, and account credentials are saved securely in Firebase Cloud Firestore.")}>Privacy Policy</button>
            <button type="button" style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0 }} onClick={() => alert("FIZFEED Terms of Service:\n1. Use system responsibly.\n2. Maintain sensor hardware.")}>Terms</button>
            <button type="button" style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0 }} onClick={() => alert("FIZFEED Support:\nContact us at support@fizfeed.com for assistance with sensors or feeding algorithms.")}>Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Signup;

