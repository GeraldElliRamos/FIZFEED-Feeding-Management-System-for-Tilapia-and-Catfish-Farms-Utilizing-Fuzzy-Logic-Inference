import Sidebar from "./Sidebar";
import "./AI_Recommendation.css";
import "./Notifications.css";
import {
  MdWarning,
  MdSmartToy,
} from "react-icons/md";
import { useNotifications } from "./hooks/useFirestore";

function AI_Recommendation() {
  const { notifications, loading } = useNotifications();
  const recommendations = notifications.filter((item) => item.type === "recommendation" || item.category === "recommendation");

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0a192f", color: "#fff" }}>Loading recommendations...</div>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <header className="top-header">
          <div>
            <h1>AI Recommendations</h1>
            <p>Smart feeding insights</p>
          </div>
        </header>

        <div className="section-label">ACTIVE RECOMMENDATIONS</div>

        {recommendations.length > 0 ? (
          recommendations.map((recommendation) => (
            <section className="notification-card" key={recommendation.id}>
              <div className={`icon-box ${recommendation.priority === "high" ? "warning" : "info"}`}>
                {recommendation.priority === "high" ? <MdWarning /> : <MdSmartToy />}
              </div>

              <div className="notif-content">
                <div className="rec-header">
                  <h3>{recommendation.title || "Recommendation"}</h3>
                  {recommendation.priority && (
                    <span className={`priority ${recommendation.priority}`}>
                      {String(recommendation.priority).toUpperCase()} PRIORITY
                    </span>
                  )}
                </div>

                {recommendation.subtitle && <p className="sub">{recommendation.subtitle}</p>}

                <div className="rec-box">
                  <strong>RECOMMENDATION:</strong>
                  <p>{recommendation.message}</p>
                  {recommendation.reason && <span>Reason: {recommendation.reason}</span>}
                </div>

                <button className="apply-btn">Apply</button>
                <button className="dismiss-btn">Dismiss</button>
              </div>
            </section>
          ))
        ) : (
          <section className="notification-card read">
            <div className="icon-box info">
              <MdSmartToy />
            </div>
            <div className="notif-content">
              <h3>No recommendations available</h3>
              <p>AI recommendations will appear here once the system has enough farm data.</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AI_Recommendation;
