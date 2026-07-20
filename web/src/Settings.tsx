import "./Dashboard.css";
import Sidebar from "./Sidebar";

export default function Settings() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <header className="top-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your account and application preferences.</p>
          </div>
        </header>

        <section className="settings-container" style={{ padding: '2rem', background: '#112240', borderRadius: '12px', marginTop: '2rem' }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>General Settings</h2>
          <p style={{ color: '#8892b0' }}>Settings options will be available here soon.</p>
        </section>
      </main>
    </div>
  );
}
