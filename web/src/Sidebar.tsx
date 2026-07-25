import { NavLink, Link } from "react-router-dom";
import {
  MdDashboard,
  MdSchedule,
  MdAnalytics,
  MdNotifications,
  MdSmartToy,
  MdDevices,
  MdInventory,
  MdHelpOutline,
  MdPerson,
  MdSettings,
  MdLogout,
  MdHelpOutline as MdFaq,
} from "react-icons/md";
import "./Sidebar.css";
import { useUserProfile } from "./hooks/useFirestore";

type Role = "admin" | "farm_owner" | "farm_staff" | "viewer";

const navAccess: Record<string, Role[]> = {
  "/dashboard": ["admin", "farm_owner", "farm_staff", "viewer"],
  "/schedule": ["admin", "farm_owner", "farm_staff"],
  "/analytics": ["admin", "farm_owner", "farm_staff", "viewer"],
  "/notifications": ["admin", "farm_owner", "farm_staff", "viewer"],
  "/ai_recommendation": ["admin", "farm_owner", "farm_staff", "viewer"],
  "/devices": ["admin", "farm_owner"],
  "/inventory": ["admin", "farm_owner"],
  "/profile": ["admin", "farm_owner", "farm_staff", "viewer"],
  "/settings": ["admin", "farm_owner"],
};

export default function Sidebar() {
  const { profile } = useUserProfile();
  const role = profile?.role as Role | undefined;

  const canAccess = (path: string) => role ? (navAccess[path]?.includes(role) ?? true) : false;

  return (
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
        {canAccess("/dashboard") && <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}><MdDashboard /> Dashboard</NavLink>}
        {canAccess("/schedule") && <NavLink to="/schedule" className={({ isActive }) => isActive ? "active" : ""}><MdSchedule /> Schedule</NavLink>}
        {canAccess("/analytics") && <NavLink to="/analytics" className={({ isActive }) => isActive ? "active" : ""}><MdAnalytics /> Analytics</NavLink>}
        {canAccess("/notifications") && <NavLink to="/notifications" className={({ isActive }) => isActive ? "active" : ""}><MdNotifications /> Notifications</NavLink>}
        {canAccess("/ai_recommendation") && <NavLink to="/ai_recommendation" className={({ isActive }) => isActive ? "active" : ""}><MdSmartToy /> AI Recommendation</NavLink>}
        {canAccess("/devices") && <NavLink to="/devices" className={({ isActive }) => isActive ? "active" : ""}><MdDevices /> Devices</NavLink>}
        {canAccess("/inventory") && <NavLink to="/inventory" className={({ isActive }) => isActive ? "active" : ""}><MdInventory /> Inventory</NavLink>}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-help"
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", color: "inherit", font: "inherit", padding: 0 }}
          onClick={() => alert("FIZFEED Help & Support:\n- Sensor setup guides\n- Fuzzy logic tuning\n- Contact: support@fizfeed.com")}
        >
          <MdHelpOutline /> Help
        </button>
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <MdPerson /> Profile
        </NavLink>
        {canAccess("/settings") && <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}><MdSettings /> Settings</NavLink>}
        <NavLink
          to="/faq"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <MdFaq /> FAQ
        </NavLink>
        <button
          onClick={async () => {
            try {
              const { signOut } = await import("firebase/auth");
              const { auth } = await import("./firebase");
              await signOut(auth);
            } catch (err) {
              console.error(err);
            }
          }}
          className="logout"
          style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: 0 }}
        >
          <MdLogout /> Logout
        </button>
      </div>
    </aside>
  );
}
