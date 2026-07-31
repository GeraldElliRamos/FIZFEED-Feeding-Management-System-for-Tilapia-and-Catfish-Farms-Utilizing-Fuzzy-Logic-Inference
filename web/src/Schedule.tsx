import Sidebar from "./Sidebar";
import "./Schedule.css";
import "./Sidebar.css";
import {
  MdAdd,
  MdAccessTime,
  MdWarning
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

  const enabledSchedules = schedules.filter((s) => s.enabled !== false);
  const disabledSchedules = schedules.filter((s) => s.enabled === false);

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

        {/* ⚠️ Feed Drum Limit Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
            background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
            border: '1px solid #f59e0b',
            borderLeft: '4px solid #f59e0b',
            borderRadius: 12,
            padding: '14px 18px',
            marginBottom: 24,
            fontSize: '0.9rem',
            color: '#78350f',
          }}
        >
          <MdWarning size={20} style={{ color: '#d97706', flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>
              Feed Dispensing Limit: 10 kg per Session
            </strong>
            <p style={{ margin: 0, lineHeight: 1.5, color: '#92400e' }}>
              The feeder drum capacity is <strong>20 kg</strong>, but each scheduled feeding session is limited to a maximum of{' '}
              <strong>10 kg</strong> to protect motor longevity, prevent overfeeding, and maintain water quality.
            </p>
          </div>
        </div>

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
