import "./Notifications.css";
import "./Sidebar.css";
import { NavLink, Link } from "react-router-dom";
import {
  MdDashboard,
  MdSchedule,
  MdAnalytics,
  MdNotifications,
  MdPsychology,
  MdDevices,
  MdInventory,
  MdHelpOutline,
  MdPerson,
  MdLogout,
  MdWarning,
  MdError,
  MdCheckCircle,
  MdSmartToy,
  MdErrorOutline,
    MdCheck,
    MdClose,
} from "react-icons/md";

function Notifications() {
  return (
    <div className="dashboard-layout">
      {/* ================= SIDEBAR ================= */}
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
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            <MdDashboard /> Dashboard
          </NavLink>

          <NavLink to="/schedule" className={({ isActive }) => (isActive ? "active" : "")}>
            <MdSchedule /> Schedule
          </NavLink>

          <NavLink to="/analytics" className={({ isActive }) => (isActive ? "active" : "")}>
            <MdAnalytics /> Analytics
          </NavLink>

          <NavLink to="/notifications" className={({ isActive }) => (isActive ? "active" : "")}>
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

      {/* ================= MAIN ================= */}
      <main className="dashboard-main">
        <header className="top-header">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with system alerts and activity</p>
          </div>

          <button className="add-btn">
                   Mark all read
                    </button>

        </header>

       {/* ================= AI RECOMMENDATION LIST ================= */}
        <section className="notifications-container">
          <div className="section-label">AI INSIGHTS</div>

          {/* HIGH PRIORITY */}
          <div className="notification-card">
            <div className="icon-box warning">
              <MdWarning />
            </div>
            <div className="notif-content">
              <h3>Reduce Feed Amount</h3>
              <p>
                Pond A – Tilapia. Reduce feed from <strong>2.7kg → 2.4kg</strong>
                due to high water temperature and 12% feed waste detected.
              </p>
              <span>Recommended for next feeding</span>
            </div>
          </div>

          {/* MEDIUM PRIORITY */}
          <div className="notification-card">
            <div className="icon-box info">
              <MdSmartToy />
            </div>
            <div className="notif-content">
              <h3>Adjust Morning Feeding Time</h3>
              <p>
                Pond B – Catfish. Delay feeding to <strong>7:00 AM</strong> for
                improved feeding activity and efficiency.
              </p>
              <span>AI suggestion</span>
            </div>
          </div>

          {/* INSIGHT */}
          <div className="notification-card read">
            <div className="icon-box success">
              <MdCheckCircle />
            </div>
            <div className="notif-content">
              <h3>Excellent Feeding Performance</h3>
              <p>
                Pond C – Milkfish achieved <strong>97.2%</strong> feed conversion
                efficiency. Current schedule is optimal.
              </p>
              <span>Performance insight</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Notifications;