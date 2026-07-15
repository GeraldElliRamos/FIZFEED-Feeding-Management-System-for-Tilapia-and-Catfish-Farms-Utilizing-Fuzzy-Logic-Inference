import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Schedule from "./Schedule";
import Analytics from "./Analytics";
import Notifications from "./Notifications";
import AI_Recommendation from "./AI_Recommendation";
import Devices from "./Devices";
import Inventory from "./Inventory";
import Profile from "./Profile";

/* ================= LOGIN ================= */
function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    navigate("/dashboard");
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
              <input type="email" placeholder="you@example.com" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
            </div>

            {/* OPTIONS */}
            <div className="options">
              <div className="remember">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>

              <a href="#" className="forgot">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-primary">
              Sign In
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/AI_Recommendation" element={<AI_Recommendation />} />
        <Route path="/Devices" element={<Devices />} />
        <Route path="/Inventory" element={<Inventory />} />
            <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;