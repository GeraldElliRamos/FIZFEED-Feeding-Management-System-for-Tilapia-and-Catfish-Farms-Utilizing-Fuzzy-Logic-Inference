import "./Dashboard.css";
import Sidebar from "./Sidebar";

const faqs = [
  {
    q: "How do I add a feeding schedule?",
    a: "Open Schedule, add the time and pond, then save the schedule.",
  },
  {
    q: "Where can I edit my profile?",
    a: "Use the Profile page to update your farm name, phone number, and location.",
  },
  {
    q: "Why is a device offline?",
    a: "The device may be disconnected, powered off, or out of network range.",
  },
  {
    q: "How do I get help?",
    a: "Use the Help button in the sidebar or contact support@fizfeed.com.",
  },
];

export default function FAQ() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <header className="top-header">
          <div>
            <h1>FAQ</h1>
            <p>Quick answers to common questions.</p>
          </div>
        </header>

        <section className="profile-card">
          {faqs.map((item) => (
            <div key={item.q} style={{ padding: "1rem 0", borderBottom: "1px solid #e5e7eb" }}>
              <h3 style={{ marginBottom: "0.5rem" }}>{item.q}</h3>
              <p style={{ color: "#475569" }}>{item.a}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
