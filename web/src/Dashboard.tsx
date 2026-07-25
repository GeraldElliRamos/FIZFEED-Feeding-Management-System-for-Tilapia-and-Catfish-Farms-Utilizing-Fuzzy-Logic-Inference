import Sidebar from "./Sidebar";
import "./Dashboard.css";
import "./Sidebar.css";
import {
  MdDevices,
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
import { useDevices, usePonds, useSchedules, useUserProfile } from "./hooks/useFirestore";

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
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: { display: false },
    y: { display: false },
  },
};

function Dashboard() {
  const { profile } = useUserProfile();
  const { ponds } = usePonds();
  const { schedules } = useSchedules();
  const { devices } = useDevices();
  const totalFeed = ponds.reduce((sum, pond) => sum + (Number(pond.currentStock) || 0), 0);
  const onlineDevices = devices.filter((device) => device.status === "online").length;
  const totalScheduledFeed = schedules.reduce((sum, schedule) => sum + (Number(schedule.amountKg) || 0), 0);
  const completedFeed = schedules
    .filter((schedule) => schedule.status?.toLowerCase() === "completed")
    .reduce((sum, schedule) => sum + (Number(schedule.amountKg) || 0), 0);
  const efficiency = totalScheduledFeed > 0 ? Math.round((completedFeed / totalScheduledFeed) * 100) : null;

  const realTimeConsumption = {
    labels: schedules.length ? schedules.map((schedule) => schedule.time || "Unscheduled") : ["No data"],
    datasets: [
      {
        data: schedules.length ? schedules.map((schedule) => Number(schedule.amountKg) || 0) : [0],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const averageDailyFeeding = {
    labels: schedules.length ? schedules.map((schedule) => schedule.pondName || "Unknown") : ["No data"],
    datasets: [
      {
        data: schedules.length ? schedules.map((schedule) => Number(schedule.amountKg) || 0) : [0],
        backgroundColor: "#8b5cf6",
        borderRadius: 6,
      },
    ],
  };

  const waterTemperature = {
    labels: devices.length ? devices.map((device) => device.name || device.id) : ["No data"],
    datasets: [
      {
        data: devices.length ? devices.map((device) => Number(device.temperature) || 0) : [0],
        borderColor: "#f97316",
        tension: 0.3,
      },
    ],
  };

  const feedDistribution = {
    labels: ponds.length ? ponds.map((pond) => pond.name || "Unnamed pond") : ["No data"],
    datasets: [
      {
        data: ponds.length ? ponds.map((pond) => Number(pond.currentStock) || 0) : [100],
        backgroundColor: ponds.length ? ["#2563eb", "#10b981", "#8b5cf6", "#f97316", "#ef4444"] : ["#e5e7eb"],
        cutout: "70%",
      },
    ],
  };

  return (
    <div className="dashboard-layout">
      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN ================= */}
      <main className="dashboard-main">
        <header className="top-header">
          <div>
            <h1>Live Dashboard</h1>
            <p>Welcome back{profile?.displayName ? `, ${profile.displayName}` : ""}</p>
          </div>
    
        </header>

        {/* ================= STATS ================= */}
        {/* SMALL STATS */}
      <section className="stats-grid">
  <div className="stat-card blue">
    <MdBolt size={26} className="color-icon" />
    <p className="label">Feed Efficiency</p>
    <h3>--</h3>
  </div>

  <div className="stat-card green">
    <MdDevices size={26} className="color-icon"  />
    <p className="label">Devices Online</p>
    <h3>--</h3>
  </div>

  <div className="stat-card purple">
    <MdWaterDrop size={26} className="color-icon"  />
    <p className="label">Total Feed</p>
    <h3>--</h3>
  </div>

  <div className="stat-card orange">
    <MdTrendingDown size={26} className="color-icon"  />
    <p className="label">Feed Waste</p>
    <h3>--</h3>
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
