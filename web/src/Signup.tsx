import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
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

          {/* ✅ BLACK TITLE */}
          <h1>Create Account</h1>

          <p className="subtitle">
            Join the next generation of aquatic data intelligence.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Full Name" required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="name@company.com" required />
            </div>

            <div className="form-group password-group">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="show-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            {/* ✅ WHITE CUSTOM CHECKBOX */}
            <div className="terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </label>
            </div>

            <button type="submit" className="btn-primary">
              Create Account →
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
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Signup;