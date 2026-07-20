import Sidebar from "./Sidebar";
import "./Notifications.css";
import "./Sidebar.css";
import {
  MdWarning,
  MdCheckCircle,
  MdSmartToy,
} from "react-icons/md";

import { useNotifications } from "./hooks/useFirestore";
import { doc, writeBatch, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./hooks/useAuth";

function Notifications() {
  const { notifications, loading } = useNotifications();
  const { user } = useAuth();

  const markAllRead = async () => {
    if (!user || notifications.length === 0) return;
    try {
      const batch = writeBatch(db);
      const notifsRef = collection(db, "users", user.uid, "notifications");
      const unreadQuery = await getDocs(notifsRef);
      unreadQuery.forEach((document) => {
        if (!document.data().read) {
          batch.update(doc(db, "users", user.uid, "notifications", document.id), { read: true });
        }
      });
      await batch.commit();
    } catch (error) {
      console.error("Error marking as read: ", error);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a192f', color: '#fff' }}>Loading notifications...</div>;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <MdWarning />;
      case 'success': return <MdCheckCircle />;
      default: return <MdSmartToy />;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN ================= */}
      <main className="dashboard-main">
        <header className="top-header">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with system alerts and activity</p>
          </div>

          <button className="add-btn" onClick={markAllRead}>
                   Mark all read
                    </button>

        </header>

       {/* ================= AI RECOMMENDATION LIST ================= */}
        <section className="notifications-container">
          <div className="section-label">SYSTEM ALERTS</div>

          {notifications.length > 0 ? notifications.map((notif, index) => (
            <div key={notif.id || index} className={`notification-card ${notif.read ? 'read' : ''}`}>
              <div className={`icon-box ${notif.type || 'info'}`}>
                {getIcon(notif.type)}
              </div>
              <div className="notif-content">
                <h3>{notif.title}</h3>
                <p>
                  {notif.message}
                </p>
                <span>{notif.createdAt?.toDate?.()?.toLocaleString() || "Just now"}</span>
              </div>
            </div>
          )) : <p style={{ color: '#fff' }}>No notifications found.</p>}
        </section>

      </main>
    </div>
  );
}

export default Notifications;

