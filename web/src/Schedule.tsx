import Sidebar from "./Sidebar";
import "./Schedule.css";
import "./Sidebar.css";
import {
  MdAdd,
  MdAccessTime
} from "react-icons/md";

import { useSchedules } from "./hooks/useFirestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./hooks/useAuth";

function Schedule() {
  const { schedules, loading } = useSchedules();
  const { user } = useAuth();

  const toggleSchedule = async (id: string, currentEnabled: boolean) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid, "schedules", id), {
        enabled: !currentEnabled
      });
    } catch (error) {
      console.error("Error updating schedule: ", error);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f6fb', color: '#64748b' }}>Loading schedules...</div>;
  }

  const enabledSchedules: any[] = []; // forced empty for display
  const disabledSchedules: any[] = [];

  return (
    <div className="dashboard-layout">
     <Sidebar />

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

        <div className="schedule-grid">
          {enabledSchedules.length > 0 ? enabledSchedules.map((item, index) => (
            <div key={item.id || index} className="schedule-card">
              <div className="time-box">
                <strong>Time</strong>
                <span>Set</span>
              </div>

              <div>
                <h4>Feed amount</h4>
                <p>{item.pondName} • {item.fishType}</p>
                <span className={`status ${item.status?.toLowerCase() || 'scheduled'}`}>{item.status || 'Scheduled'}</span>
              </div>

              <div className="toggle active" onClick={() => toggleSchedule(item.id, true)}></div>
            </div>
          )) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <MdAccessTime size={36} color="#94a3b8" />
              </div>
              <h3>No schedules set</h3>
              <p>Automate your feeding by creating a new schedule.</p>
              <button className="add-btn-empty">
                <MdAdd size={20} /> Create New Schedule
              </button>
            </div>
          )}
        </div>

        {disabledSchedules.length > 0 && (
          <>
            <div className="divider"><span>DISABLED</span></div>

            {disabledSchedules.map((item, index) => (
              <div key={item.id || index} className="schedule-card disabled">
                <MdAccessTime size={24} />
                <div>
                  <strong>Scheduled time</strong>
                  <p>{item.pondName}</p>
                </div>
                <div className="toggle" onClick={() => toggleSchedule(item.id, false)}></div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

export default Schedule;
