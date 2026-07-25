import Sidebar from "./Sidebar";
import "./Devices.css";
import "./Sidebar.css";
import {
  MdWifi,
  MdWifiOff,
  MdDevicesOther,
  MdThermostat,
  MdSetMeal,
  MdBatteryFull,
  MdBatteryAlert,
  MdDeleteOutline,
} from "react-icons/md";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { useDevices } from "./hooks/useFirestore";
import { useAuth } from "./hooks/useAuth";

function Devices() {
  const { devices, loading } = useDevices();
  const { user } = useAuth();

  const handleDeleteDevice = async (deviceId: string, deviceName: string) => {
    if (!user) {
      window.alert("Please sign in first.");
      return;
    }

    const confirmed = window.confirm(`Delete ${deviceName || "this device"}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    await deleteDoc(doc(db, "users", user.uid, "devices", deviceId));
  };

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0a192f", color: "#fff" }}>Loading devices...</div>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <header className="top-header">
          <div>
            <h1>My Devices</h1>
            <p>Manage and monitor your connected devices</p>
          </div>
        </header>

        <section className="device-summary-grid">
          <div className="summary-card online">
            <MdWifi className="summary-icon" />
            <h2>--</h2>
            <p>Online</p>
          </div>

          <div className="summary-card offline">
            <MdWifiOff className="summary-icon" />
            <h2>--</h2>
            <p>Offline</p>
          </div>

          <div className="summary-card total">
            <MdDevicesOther className="summary-icon" />
            <h2>--</h2>
            <p>Total</p>
          </div>
        </section>

        <section className="device-cards">
          {devices.length > 0 ? (
            devices.map((device) => (
              <div className="device-card-full" key={device.id}>
                <div className="device-header">
                  <div>
                    <h3>{device.name || "Unnamed Device"}</h3>
                    <p>{[device.pondName, device.fishType].filter(Boolean).join(" • ") || "No device details"}</p>
                  </div>
                  <span className={`status-pill ${device.status || "offline"}`}>
                    {(device.status || "offline").toUpperCase()}
                  </span>
                </div>

                <div className="device-metrics">
                  <div className={device.status === "offline" ? "metric danger" : "metric"}>
                    <MdThermostat />
                    <strong>--</strong>
                  </div>
                  <div className={device.status === "offline" ? "metric danger" : "metric"}>
                    <MdSetMeal />
                    <strong>--</strong>
                  </div>
                  <div className={(device.batteryLevel ?? 100) <= 20 ? "metric danger" : "metric"}>
                    {(device.batteryLevel ?? 100) <= 20 ? <MdBatteryAlert /> : <MdBatteryFull />}
                    <strong>--</strong>
                  </div>
                </div>

                <div className="device-footer">
                  <span>LAST ACTIVE: Hidden</span>
                  <div className="device-actions">
                    <a className="details-link">Details</a>
                    <button
                      type="button"
                      className="device-delete-button"
                      onClick={() => handleDeleteDevice(String(device.id), device.name || "this device")}
                    >
                      <MdDeleteOutline />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#64748b" }}>No devices found.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Devices;
