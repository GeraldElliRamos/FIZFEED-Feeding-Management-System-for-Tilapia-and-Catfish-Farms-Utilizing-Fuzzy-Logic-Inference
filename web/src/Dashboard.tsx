import Sidebar from "./Sidebar";
import WeatherWidget from "./WeatherWidget";
import "./Dashboard.css";
import "./Sidebar.css";
import {
  MdDevices,
  MdTrendingDown,
  MdBolt,
  MdWaterDrop,
  MdThermostat,
  MdOpacity,
  MdBatteryFull,
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
import { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:8000";
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

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
    tooltip: { enabled: true },
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
  const [deviceStatus, setDeviceStatus] = useState<any | null>(null);
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

  const chartSummary = {
    realTimeConsumption: schedules.length
      ? schedules.map((schedule) => `${schedule.time || "Unscheduled"}: ${Number(schedule.amountKg) || 0} kg`)
      : ["No data"],
    averageDailyFeeding: schedules.length
      ? schedules.map((schedule) => `${schedule.pondName || "Unknown"}: ${Number(schedule.amountKg) || 0} kg`)
      : ["No data"],
    waterTemperature: devices.length
      ? devices.map((device) => `${device.name || device.id}: ${Number(device.temperature) || 0} C`)
      : ["No data"],
    feedDistribution: ponds.length
      ? ponds.map((pond) => `${pond.name || "Pond"}: ${Number(pond.currentStock) || 0} kg`)
      : ["No data"],
  };

  useEffect(() => {
    const deviceId = devices[0]?.id;
    if (!deviceId) {
      setDeviceStatus(null);
      return;
    }

    let active = true;
    const loadStatus = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/devices/${deviceId}/status`);
        if (!res.ok) return;
        const data = await res.json();
        if (active) setDeviceStatus(data);
      } catch {
        if (active) setDeviceStatus(null);
      }
    };

    loadStatus();
    const timer = window.setInterval(loadStatus, 15000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [devices]);

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
          {DEMO_MODE && <span className="demo-pill">Demo Mode</span>}
        </header>

        {/* WEATHER INTELLIGENCE WIDGET */}
        <WeatherWidget />

        <section className="device-status-strip">
          <div className="device-status-card">
            <div className="status-head">
              <div>
                <p className="status-kicker">IoT Status</p>
                <h2>{deviceStatus?.device_id || devices[0]?.name || "No device linked yet"}</h2>
              </div>
              <span className={`status-pill ${(deviceStatus?.status || "offline").toLowerCase()}`}>
                {(deviceStatus?.status || "offline").toUpperCase()}
              </span>
            </div>

            <div className="status-grid">
              <div className="status-item">
                <MdThermostat />
                <div>
                  <span>Temperature</span>
                  <strong>{deviceStatus?.temperature_c ?? "--"} °C</strong>
                </div>
              </div>
              <div className="status-item">
                <MdOpacity />
                <div>
                  <span>pH Level</span>
                  <strong>{deviceStatus?.ph_level ?? "--"}</strong>
                </div>
              </div>
              <div className="status-item">
                <MdBatteryFull />
                <div>
                  <span>Battery</span>
                  <strong>{deviceStatus?.battery_percent ?? "--"}%</strong>
                </div>
              </div>
            </div>

            <p className="status-note">
              {deviceStatus?.alerts?.length ? deviceStatus.alerts[0] : "Waiting for the IoT device to send live telemetry."}
            </p>
          </div>
        </section>


        {/* ================= STATS ================= */}
        <section className="stats-grid">
          <div className="stat-card blue">
            <MdBolt size={26} className="color-icon" />
            <p className="label">Feed Efficiency</p>
            <h3>{efficiency !== null ? `${efficiency}%` : "88%"}</h3>
          </div>

          <div className="stat-card green">
            <MdDevices size={26} className="color-icon" />
            <p className="label">Devices Online</p>
            <h3>{onlineDevices > 0 ? onlineDevices : "1"}</h3>
          </div>

          <div className="stat-card purple">
            <MdWaterDrop size={26} className="color-icon" />
            <p className="label">Total Feed</p>
            <h3>{totalFeed > 0 ? `${totalFeed} kg` : "120 kg"}</h3>
          </div>

          <div className="stat-card orange">
            <MdTrendingDown size={26} className="color-icon" />
            <p className="label">Feed Waste</p>
            <h3>{totalScheduledFeed > 0 ? `${(totalScheduledFeed - completedFeed).toFixed(1)} kg` : "4.2 kg"}</h3>
          </div>
        </section>



        {/* ================= CHARTS ================= */}
        <section className="charts">
          <div className="chart-card">
            <h3>Real-Time Consumption</h3>
            <div className="chart-wrapper large">
              <Line data={realTimeConsumption} options={chartOptions} />
            </div>
            <div className="chart-values">
              {chartSummary.realTimeConsumption.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>Average Daily Feeding</h3>
            <div className="chart-wrapper large">
              <Bar data={averageDailyFeeding} options={chartOptions} />
            </div>
            <div className="chart-values">
              {chartSummary.averageDailyFeeding.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="chart-card small">
            <h3>Water Temperature</h3>
            <div className="chart-wrapper small">
              <Line data={waterTemperature} options={chartOptions} />
            </div>
            <div className="chart-values">
              {chartSummary.waterTemperature.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="chart-card small">
            <h3>Feed Distribution</h3>
            <div className="chart-wrapper small doughnut">
              <Doughnut data={feedDistribution} options={chartOptions} />
            </div>
            <div className="chart-values">
              {chartSummary.feedDistribution.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
