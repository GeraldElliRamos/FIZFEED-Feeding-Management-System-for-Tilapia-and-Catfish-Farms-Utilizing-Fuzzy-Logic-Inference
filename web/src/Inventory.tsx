import "./Inventory.css";
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
  MdOutlineToday,
  MdOutlineAccessTime,
  MdOutlineInventory,

} from "react-icons/md";

function Inventory() {
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
            <h1>Feed Inventory</h1>
            <p>Monitor feed levels across all active ponds</p>
          </div>
        </header>
{/* SUMMARY CARDS */}
       <section className="inventory-summary">
  <div className="summary-card">
    <div className="icon-box blue">
      <MdOutlineInventory className="icon" />
    </div>

    <h2>35.2</h2>
    <p>Total (kg)</p>
  </div>

  <div className="summary-card">
    <div className="icon-box blue">
      <MdOutlineToday className="icon" />
    </div>

    <h2>15.5</h2>
    <p>Daily avg (kg)</p>
  </div>

  <div className="summary-card">
    <div className="icon-box warning">
      <MdOutlineAccessTime className="icon" />
    </div>

    <h2>2.3</h2>
    <p>Days left</p>
  </div>
</section>

     {/* ALERT */}
<div className="refill-alert">
  <div className="alert-icon">⚠</div>

  <div className="alert-content">
    <strong>Refill Alert</strong>
    <p>Pond C requires refilling within 24 hours. Pond A needs refilling in 2 days.</p>
  </div>
</div>

{/* POND LIST */}
<section className="pond-section">
  <h3>FEED LEVELS BY POND</h3>

  {/* Pond A */}
  <div className="pond-card">
    <div className="pond-header">
      <div>
        <h4>Pond A</h4>
        <span>Tilapia</span>
      </div>

      <span className="badge green">74%</span>
    </div>

    <div className="stock-row">
      <span>Current Stock</span>
      <strong>
        18.5 kg <span>/ 25 kg</span>
      </strong>
    </div>

    <div className="progress">
      <div className="green-fill" style={{ width: "74%" }} />
    </div>

    <div className="pond-footer">
      <div>
        <label>DAYS REMAINING</label>
        <h5>2</h5>
      </div>

      <div className="right">
        <label>DAILY USAGE</label>
        <h5>8.2 kg</h5>
      </div>
    </div>
  </div>

  {/* Pond B */}
  <div className="pond-card">
    <div className="pond-header">
      <div>
        <h4>Pond B</h4>
        <span>Catfish</span>
      </div>

      <span className="badge orange">45%</span>
    </div>

    <div className="stock-row">
      <span>Current Stock</span>
      <strong>
        11.2 kg <span>/ 25 kg</span>
      </strong>
    </div>

    <div className="progress">
      <div className="orange-fill" style={{ width: "45%" }} />
    </div>

    <div className="pond-footer">
      <div>
        <label>DAYS REMAINING</label>
        <h5>4</h5>
      </div>

      <div className="right">
        <label>DAILY USAGE</label>
        <h5>2.8 kg</h5>
      </div>
    </div>
  </div>

  {/* Pond C */}
  <div className="pond-card">
    <div className="pond-header">
      <div>
        <h4>Pond C</h4>
        <span>Milkfish</span>
      </div>

      <span className="badge red">22%</span>
    </div>

    <div className="stock-row">
      <span>Current Stock</span>
      <strong>
        5.5 kg <span>/ 25 kg</span>
      </strong>
    </div>

    <div className="progress">
      <div className="red-fill" style={{ width: "22%" }} />
    </div>

    <div className="pond-footer">
      <div>
        <label>DAYS REMAINING</label>
        <h5>1</h5>
      </div>

      <div className="right">
        <label>DAILY USAGE</label>
        <h5>4.5 kg</h5>
      </div>
    </div>
  </div>
</section>
      </main>
    </div>
  );
}

export default Inventory;