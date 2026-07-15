import "./Devices.css";
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
  MdWifi,
  MdWifiOff,
  MdDevicesOther,
  MdThermostat,
  MdSetMeal,
  MdBatteryFull,
  MdBatteryAlert
} from "react-icons/md";

function Devices() {
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
            <h1>My Devices</h1>
            <p>Manage and monitor your connected devices</p>
          </div>
        </header>

        {/* SUMMARY */}
        <section className="device-summary-grid">
          <div className="summary-card online">
            <MdWifi className="summary-icon" />
            <h2>2</h2>
            <p>Online</p>
          </div>

          <div className="summary-card offline">
            <MdWifiOff className="summary-icon" />
            <h2>1</h2>
            <p>Offline</p>
          </div>

          <div className="summary-card total">
            <MdDevicesOther className="summary-icon" />
            <h2>3</h2>
            <p>Total</p>
          </div>
        </section>

        {/* DEVICE CARDS */}
        <section className="device-cards">
          {/* DEVICE 1 */}
          <div className="device-card-full">
            <div className="device-header">
              <div>
                <h3>FeedSense Device 1</h3>
                <p>FS-001 • Pond A – Tilapia</p>
              </div>
              <span className="status-pill online">ONLINE</span>
            </div>

            <div className="device-metrics">
              <div className="metric">
                <MdThermostat />
                <strong>28.5°C</strong>
              </div>
              <div className="metric">
                <MdSetMeal />
                <strong>75%</strong>
              </div>
              <div className="metric">
                <MdBatteryFull />
                <strong>85%</strong>
              </div>
            </div>

            <div className="device-footer">
              <span>LAST ACTIVE: 2 MINS AGO</span>
              <a className="details-link">Details →</a>
            </div>
          </div>

          {/* DEVICE 2 */}
          <div className="device-card-full">
            <div className="device-header">
              <div>
                <h3>FeedSense Device 2</h3>
                <p>FS-002 • Pond B – Catfish</p>
              </div>
              <span className="status-pill online">ONLINE</span>
            </div>

            <div className="device-metrics">
              <div className="metric">
                <MdThermostat />
                <strong>27.2°C</strong>
              </div>
              <div className="metric">
                <MdSetMeal />
                <strong>45%</strong>
              </div>
              <div className="metric">
                <MdBatteryFull />
                <strong>92%</strong>
              </div>
            </div>

            <div className="device-footer">
              <span>LAST ACTIVE: 5 MINS AGO</span>
              <a className="details-link">Details →</a>
            </div>
          </div>

          {/* DEVICE 3 */}
          <div className="device-card-full">
            <div className="device-header">
              <div>
                <h3>FeedSense Device 3</h3>
                <p>FS-003 • Pond C – Milkfish</p>
              </div>
              <span className="status-pill offline">OFFLINE</span>
            </div>

            <div className="device-metrics">
              <div className="metric danger">
                <MdThermostat />
                <strong>26.8°C</strong>
              </div>
              <div className="metric danger">
                <MdSetMeal />
                <strong>20%</strong>
              </div>
              <div className="metric danger">
                <MdBatteryAlert />
                <strong>15%</strong>
              </div>
            </div>

            <div className="device-footer">
              <span>LAST ACTIVE: 2 HOURS AGO</span>
              <a className="details-link">Details →</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Devices;