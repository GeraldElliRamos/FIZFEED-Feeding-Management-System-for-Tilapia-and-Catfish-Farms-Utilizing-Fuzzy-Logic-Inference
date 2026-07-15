import "./Schedule.css";
import "./Sidebar.css";
import { NavLink, Link } from "react-router-dom";
import {
  MdDashboard, MdSchedule, MdAnalytics, MdNotifications,
  MdPsychology, MdDevices, MdInventory, MdHelpOutline,
  MdPerson, MdLogout, MdAdd, MdAccessTime
} from "react-icons/md";

function Schedule() {
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

      {/* ================= MAIN ================= */}
      <main className="dashboard-main">
        <header className="top-header">
          <div>
            <h1>Feeding Schedule</h1>
            <p>Automated feeding management</p>
          </div>

          {/* FIXED RIGHT POSITION */}
          <button className="add-btn">
            <MdAdd /> New Schedule
          </button>
        </header>

        <div className="time-tabs">
          <button className="active-tab">Today</button>
          <button>Tomorrow</button>
          <button>Week</button>
        </div>

        <div className="ai-banner">
          <div className="icon-box"><MdPsychology /></div>
          <div>
            <h3>
              AI Optimization <span className="efficiency">94% Efficient</span>
            </h3>
            <p>
              Your schedule is performing excellently. Consider enabling Pond B
              schedule for optimal results.
            </p>
          </div>
        </div>

        <div className="schedule-grid">
          {[
            { time: "06", period: "AM", kg: "2.5 kg", status: "Completed", type: "completed" },
            { time: "12", period: "PM", kg: "3.0 kg", status: "Completed", type: "completed" },
            { time: "06", period: "PM", kg: "2.7 kg", status: "Scheduled", type: "scheduled" }
          ].map((item, index) => (
            <div key={index} className="schedule-card">
              <div className="time-box">
                <strong>{item.time}</strong>
                <span>{item.period}</span>
              </div>

              <div>
                <h4>{item.kg}</h4>
                <p>Pond A • Tilapia</p>
                <span className={`status ${item.type}`}>{item.status}</span>
              </div>

              <div className="toggle active"></div>
            </div>
          ))}
        </div>

        <div className="divider"><span>DISABLED</span></div>

        <div className="schedule-card disabled">
          <MdAccessTime size={24} />
          <div>
            <strong>07:00 AM</strong>
            <p>Pond B • 1.8 kg</p>
          </div>
          <div className="toggle"></div>
        </div>
      </main>
    </div>
  );
}

export default Schedule;