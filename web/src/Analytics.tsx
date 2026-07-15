import "./Analytics.css";
import "./Sidebar.css";
import { NavLink, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  MdDashboard, MdSchedule, MdAnalytics, MdNotifications,
  MdPsychology, MdDevices, MdInventory, MdHelpOutline,
  MdPerson, MdLogout, MdBolt, MdDeleteOutline, MdAttachMoney,
  MdTrendingUp, 
} from "react-icons/md";

function Analytics() {
   const weeklyRef = useRef<HTMLCanvasElement>(null);
  const tempRef = useRef<HTMLCanvasElement>(null);

  /* ================= WEEKLY FEEDING TREND ================= */
  useEffect(() => {
    const canvas = weeklyRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const parent = canvas.parentElement!;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = parent.clientWidth * dpr;
      canvas.height = 200 * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const w = parent.clientWidth;
      const h = 200;

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(0,0,0,0.05)";
      for (let i = 0; i <= 4; i++) {
        const y = (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, "rgba(37,99,235,0.25)");
      gradient.addColorStop(1, "rgba(37,99,235,0)");

      ctx.beginPath();
      ctx.moveTo(0, h * 0.6);
      ctx.bezierCurveTo(w * 0.25, h * 0.45, w * 0.5, h * 0.55, w, h * 0.4);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, h * 0.6);
      ctx.bezierCurveTo(w * 0.25, h * 0.45, w * 0.5, h * 0.55, w, h * 0.4);
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  /* ================= WATER TEMPERATURE ================= */
  useEffect(() => {
    const canvas = tempRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const parent = canvas.parentElement!;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = parent.clientWidth * dpr;
      canvas.height = 180 * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const w = parent.clientWidth;
      const h = 180;

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(0,0,0,0.05)";
      for (let i = 0; i <= 2; i++) {
        const y = (h / 2) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(0, h * 0.65);
      ctx.bezierCurveTo(w * 0.3, h * 0.55, w * 0.6, h * 0.6, w, h * 0.5);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);


  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
  <div className="logo">
    <img
      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBZwXJ1Dj8t1Dl9_kNMyeYMnufW5igHVX-kUgbaUFiDjf6zcesivFSHfBtWk3K6xa_DvSY6lx_28wX3tmwnUhqpgS-sWI6ghllOxodNwqg-ab4L4asPXVd7AISlPq7OS953j3ecXAVh6Lhwyx4YRdhspIfsbIJNilPdMRENv4vmbH3yWc9G20Al4Gufe8rR4vTPNFfeyceXQpu6rjB434K6pSwajZlxsRk47LRRTQeLZ75BnX_wTZ0F6EFNcGIoDkVyJCEUpHkGEc"
      alt="logo"
    />
    <div>
      <h3>FIZFEED</h3>
      <p>Smart Aquaculture</p>
    </div>
  </div>

  <nav>
    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
      <MdDashboard /> Dashboard
    </NavLink>
    <NavLink to="/schedule" className={({ isActive }) => isActive ? "active" : ""}>
      <MdSchedule /> Schedule
    </NavLink>
    <NavLink to="/analytics" className={({ isActive }) => isActive ? "active" : ""}>
      <MdAnalytics /> Analytics
    </NavLink>
  <NavLink to="/notifications" className={({ isActive }) => isActive ? "active" : ""}>
      <MdNotifications /> Notifications
    </NavLink>
     <NavLink to="/ai_recommendation" className={({ isActive }) => isActive ? "active" : ""}>
      <MdNotifications /> AI Recommendation
    </NavLink>
     <NavLink to="/devices" className={({ isActive }) => isActive ? "active" : ""}>
      <MdDevices /> Devices
    </NavLink>
    <NavLink to="/inventory" className={({ isActive }) => isActive ? "active" : ""}>
      <MdInventory /> Inventory
    </NavLink>
  </nav>

  <div className="sidebar-footer">
    <a><MdHelpOutline /> Help</a>
  <NavLink
    to="/profile"
    className={({ isActive }) => (isActive ? "active" : "")}
  >
    <MdPerson /> Profile
  </NavLink>
    <Link to="/" className="logout">
      <MdLogout /> Logout
    </Link>
  </div>
</aside>

      <main className="dashboard-main">
         <header className="top-header">
                  <div>
                    <h1>Data Analytics </h1>
                    <p>Performance insights and metrics</p>
                  </div>
                </header>

        <div className="time-tabs">
          <button>Day</button>
          <button className="active-tab">Week</button>
          <button>Month</button>
        </div>

        <section className="stats-grid">
  <div className="stat-card blue">
    <MdBolt size={26} className="color-icon"/>
    <p className="label">Total Fed</p>
    <h3>57.3 kg</h3>
  </div>

  <div className="stat-card green">
    <MdTrendingUp size={26} className="color-icon" />
    <p className="label">Efficiency</p>
    <h3>96.2%</h3>
  </div>

  <div className="stat-card red">
    <MdDeleteOutline size={26} className="color-icon" />
    <p className="label">Waste</p>
    <h3>2.1 kg</h3>
  </div>

  <div className="stat-card purple">
    <MdAttachMoney size={26} className="color-icon" />
    <p className="label">Savings</p>
    <h3>₱5,240</h3>
  </div>
</section>

   <section className="chart-card">
          <h2>Weekly Feeding Trend</h2>
          <canvas ref={weeklyRef} className="canvas-chart" />
        </section>

        <div className="secondary-grid">
          {/* WATER TEMPERATURE */}
          <section className="chart-card">
            <h2>Water Temperature</h2>
            <canvas ref={tempRef} className="canvas-chart" />
          </section>

          {/* FEED WASTE */}
          <section className="chart-card">
            <h2>Feed Waste</h2>
            <div className="waste-bars">
              {[40, 70, 45, 85, 55, 25, 35].map((v, i) => (
                <div key={i} className="waste-bar" style={{ height: `${v}%` }} />
              ))}
            </div>
          </section>
           </div>
      
      </main>
    </div>
  );
}

export default Analytics;