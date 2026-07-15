import "./Dashboard.css";
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
  MdTrendingDown,
  MdBolt,
  MdWaterDrop,
} from "react-icons/md";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

/* ================= CHART OPTIONS ================= */
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

function Dashboard() {
  const realTimeConsumption = {
    labels: ["6AM", "9AM", "12PM", "3PM", "6PM"],
    datasets: [
      {
        data: [2.5, 3.2, 4.5, 4.2, 3],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const averageDailyFeeding = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [7.2, 8.1, 7.5, 7.8, 7.1, 7.6, 8.2],
        backgroundColor: "#8b5cf6",
        borderRadius: 6,
      },
    ],
  };

  const waterTemperature = {
    labels: ["1PM", "2PM", "3PM", "4PM", "5PM", "6PM"],
    datasets: [
      {
        data: [26, 26.5, 27, 27.2, 27.1, 26.8],
        borderColor: "#f97316",
        tension: 0.3,
      },
    ],
  };

  const feedDistribution = {
    labels: ["Pond A", "Pond B", "Pond C"],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: ["#2563eb", "#10b981", "#8b5cf6"],
        cutout: "70%",
      },
    ],
  };

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
            <h1>Live Dashboard</h1>
            <p>Welcome back to FIZFEED</p>
          </div>
    
        </header>

        {/* ================= STATS ================= */}
        {/* SMALL STATS */}
      <section className="stats-grid">
  <div className="stat-card blue">
    <MdBolt size={26} className="color-icon" />
    <p className="label">Feed Efficiency</p>
    <h3>94.3%</h3>
  </div>

  <div className="stat-card green">
    <MdDevices size={26} className="color-icon"  />
    <p className="label">Devices Online</p>
    <h3>2 / 3</h3>
  </div>

  <div className="stat-card purple">
    <MdWaterDrop size={26} className="color-icon"  />
    <p className="label">Total Feed</p>
    <h3>16.7 kg</h3>
  </div>

  <div className="stat-card orange">
    <MdTrendingDown size={26} className="color-icon"  />
    <p className="label">Feed Waste</p>
    <h3>0.8 kg</h3>
  </div>
</section>


        {/* ================= CHARTS ================= */}
        <section className="charts">
          <div className="chart-card">
            <h3>Real-Time Consumption</h3>
            <div className="chart-wrapper large">
              <Line data={realTimeConsumption} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card">
            <h3>Average Daily Feeding</h3>
            <div className="chart-wrapper large">
              <Bar data={averageDailyFeeding} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card small">
            <h3>Water Temperature</h3>
            <div className="chart-wrapper small">
              <Line data={waterTemperature} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card small">
            <h3>Feed Distribution</h3>
            <div className="chart-wrapper small doughnut">
              <Doughnut data={feedDistribution} options={chartOptions} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;