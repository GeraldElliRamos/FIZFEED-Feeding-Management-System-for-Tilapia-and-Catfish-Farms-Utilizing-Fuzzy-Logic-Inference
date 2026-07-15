import "./Profile.css";
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
  MdAdd,
  MdChevronRight,
  MdSettings,
  MdLock,
  MdLocationOn,
  MdEmail,
  MdPhone,
  MdBusiness,
  MdVerified,

} from "react-icons/md";

function Profile() {
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
            <h1>Profile</h1>
            <p>Manage your account settings</p>
          </div>

             <button className="add-btn">
                      <MdAdd /> Edit Profile
                    </button>
        </header>

         {/* Hero */}

        <section className="profile-hero">

          <div className="avatar">

            <MdPerson className="avatar-person" />

            <div className="verify">
              <MdVerified />
            </div>

          </div>

          <div>
            <h2>Juan Dela Cruz</h2>
            <p>Fish Farmer</p>
          </div>

        </section>

        {/* Grid */}

        <section className="profile-grid">

          {/* Personal */}

          <div className="profile-card">

            <h3>Personal Information</h3>

            <div className="info-item">
              <div className="icon blue">
                <MdBusiness />
              </div>

              <div>
                <span>Farm Name</span>
                <h4>San Miguel Fish Farm</h4>
              </div>
            </div>

            <div className="info-item">
              <div className="icon green">
                <MdEmail />
              </div>

              <div>
                <span>Email</span>
                <h4>juan.delacruz@email.com</h4>
              </div>
            </div>

            <div className="info-item">
              <div className="icon purple">
                <MdPhone />
              </div>

              <div>
                <span>Phone</span>
                <h4>+63 917 123 4567</h4>
              </div>
            </div>

            <div className="info-item">
              <div className="icon orange">
                <MdLocationOn />
              </div>

              <div>
                <span>Location</span>
                <h4>Bulacan, Philippines</h4>
              </div>
            </div>

          </div>

          {/* Statistics */}

          <div className="profile-card">

            <h3>Farm Statistics</h3>

            <div className="stats-grid">

              <div className="stat-box">
                <h2>3</h2>
                <p>Active Ponds</p>
              </div>

              <div className="stat-box">
                <h2>3</h2>
                <p>Devices</p>
              </div>

              <div className="stat-box">
                <h2>94</h2>
                <p>Days Active</p>
              </div>

            </div>

          </div>

        </section>

        {/* Settings */}

        <section className="profile-card settings">

          <h3>Settings</h3>

          <div className="setting">

            <div className="setting-left">

              <div className="setting-icon">
                <MdLock />
              </div>

              <div>
                <h4>Security & Privacy</h4>
                <p>Password, 2FA, and access</p>
              </div>

            </div>

            <MdChevronRight />

          </div>

          <div className="setting">

            <div className="setting-left">

              <div className="setting-icon">
                <MdSettings />
              </div>

              <div>
                <h4>Notification Preferences</h4>
                <p>Configure app alerts</p>
              </div>

            </div>

            <MdChevronRight />

          </div>

        </section>
      </main>
    </div>
  );
}

export default Profile;