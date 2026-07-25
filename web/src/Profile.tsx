import Sidebar from "./Sidebar";
import "./Profile.css";
import "./Sidebar.css";
import {
  MdPerson,
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

import { useDevices, usePonds, useUserProfile } from "./hooks/useFirestore";

function Profile() {
  const { profile, loading } = useUserProfile();
  const { ponds } = usePonds();
  const { devices } = useDevices();
  const createdAt = profile?.createdAt?.toDate?.();
  const daysActive = createdAt ? Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / 86400000)) : null;

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a192f', color: '#fff' }}>Loading profile...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <Sidebar />

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
            <h2>{profile?.displayName}</h2>
            <p>{profile?.role ? String(profile.role).replace(/_/g, " ") : "Fish Farmer"}</p>
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
                <h4>{profile?.farmName || "Not set"}</h4>
              </div>
            </div>

            <div className="info-item">
              <div className="icon green">
                <MdEmail />
              </div>

              <div>
                <span>Email</span>
                <h4>{profile?.email}</h4>
              </div>
            </div>

            <div className="info-item">
              <div className="icon purple">
                <MdVerified />
              </div>

              <div>
                <span>Role</span>
                <h4>{profile?.role ? String(profile.role).replace(/_/g, " ") : "Not set"}</h4>
              </div>
            </div>

            <div className="info-item">
              <div className="icon purple">
                <MdPhone />
              </div>

              <div>
                <span>Phone</span>
                <h4>{profile?.phone || "Not set"}</h4>
              </div>
            </div>

            <div className="info-item">
              <div className="icon orange">
                <MdLocationOn />
              </div>

              <div>
                <span>Location</span>
                <h4>{profile?.location || "Not set"}</h4>
              </div>
            </div>

          </div>

          {/* Statistics */}

          <div className="profile-card">

            <h3>Farm Statistics</h3>

            <div className="stats-grid">

              <div className="stat-box">
                <h2>{ponds.length}</h2>
                <p>Active Ponds</p>
              </div>

              <div className="stat-box">
                <h2>{devices.length}</h2>
                <p>Devices</p>
              </div>

              <div className="stat-box">
                <h2>{daysActive ?? "--"}</h2>
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
