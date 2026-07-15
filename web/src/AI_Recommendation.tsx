import "./AI_Recommendation.css";
import "./Notifications.css";
import "./Sidebar.css";
import { NavLink, Link } from "react-router-dom";
import {
  MdDashboard,
  MdSchedule,
  MdAnalytics,
  MdNotifications,
  MdDevices,
  MdInventory,
  MdHelpOutline,
  MdPerson,
  MdLogout,
  MdWarning,
  MdSmartToy,
} from "react-icons/md";

function AI_Recommendation() {
  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
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

      {/* MAIN */}
      <main className="dashboard-main">
        <header className="top-header">
          <div>
            <h1>AI Recommendations</h1>
            <p>Smart feeding insights</p>
          </div>
        </header>

        {/* OPTIMIZATION SCORE */}
        <section className="notification-card score-card">
          <div className="icon-box info">
            <MdSmartToy />
          </div>
          <div className="notif-content">
            <h3>AI Optimization Score</h3>
            <p>Based on 30-day analysis</p>
            <div className="score-row">
              <strong className="score">94.3</strong>
              <span className="out-of">/100</span>
            </div>
            <span className="score-positive">+5.2% improvement this week</span>
          </div>
        </section>

        {/* ACTIVE RECOMMENDATIONS */}
        <div className="section-label">ACTIVE RECOMMENDATIONS</div>

        {/* HIGH PRIORITY */}
        <section className="notification-card">
          <div className="icon-box warning">
            <MdWarning />
          </div>

          <div className="notif-content">
            <div className="rec-header">
              <h3>Reduce Feed Amount</h3>
              <span className="priority high">HIGH PRIORITY</span>
            </div>

            <p className="sub">
              Pond A – Tilapia · Next feeding at 6:00 PM
            </p>

            <div className="rec-box">
              <strong>RECOMMENDATION:</strong>
              <p>
                Reduce feed amount from <strong>2.7 kg to 2.4 kg (0.3 kg)</strong>
              </p>
              <span>
                Reason: Water temperature increased to 29.2°C and recent
                consumption patterns show 12% wastage in afternoon feedings.
              </span>
            </div>

            <button className="apply-btn">Apply</button>
            <button className="dismiss-btn">Dismiss</button>
          </div>
        </section>

        {/* MEDIUM PRIORITY */}
        <section className="notification-card">
          <div className="icon-box info">
            <MdSmartToy />
          </div>

          <div className="notif-content">
            <div className="rec-header">
              <h3>Adjust Morning Schedule</h3>
              <span className="priority medium">MEDIUM PRIORITY</span>
            </div>

            <p className="sub">
              Pond B – Catfish · Morning feeding at 6:00 AM
            </p>

            <div className="rec-box">
              <strong>RECOMMENDATION:</strong>
              <p>Delay morning feeding from 6:00 AM to 7:00 AM</p>
              <span>
                Reason: Catfish show 15% higher feeding activity after 7:00 AM
                when water temperature reaches optimal 27°C range.
              </span>
            </div>

            <button className="apply-btn">Apply</button>
            <button className="dismiss-btn">Dismiss</button>
          </div>
        </section>

        {/* INSIGHT / EXCELLENT PERFORMANCE */}
<section className="notification-card read">
  <div className="icon-box success">
    <MdSmartToy />
  </div>

  <div className="notif-content">
    <div className="rec-header">
      <h3>Excellent Performance</h3>
      <span className="priority success">INSIGHT</span>
    </div>

    <p className="sub">
      Pond C – Milkfish · Feeding efficiency stable
    </p>

    <div className="rec-box success">
      <strong>INSIGHT:</strong>
      <p>
        Feed conversion efficiency reached{" "}
        <strong>97.2%</strong>. Current feeding schedule is optimal.
      </p>
      <span>
        Reason: Minimal feed waste and stable water temperature observed over
        the last 7 days.
      </span>
    </div>
    <button className="apply-btn">Apply</button>
            <button className="dismiss-btn">Dismiss</button>
  </div>
</section>
      </main>
    </div>
  );
}

export default AI_Recommendation;