import Sidebar from "./Sidebar";
import "./AI_Recommendation.css";
import "./Notifications.css";
import { MdAutoAwesome, MdRefresh, MdSmartToy, MdWarning } from "react-icons/md";
import { useNotifications } from "./hooks/useFirestore";
import { useState } from "react";

const BACKEND_URL = "http://localhost:8000";
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

interface AIAdvisoryResult {
  ai_advisory: string;
  ai_engine_on?: boolean;
  final_recommended_feed_g_per_session: number;
  final_recommended_feed_g_per_day: number;
  rbes: { growth_stage: string; feeding_rate_percent: number };
  weather: { condition: string; aquaculture_advisory: string } | null;
  inputs?: {
    fish_species: string;
    water_temperature_c: number;
    ph_level: number;
    fish_age_months: number;
    fish_count: number;
    sessions_per_day: number;
  };
}

const DEMO_AI_RESULT: AIAdvisoryResult = {
  ai_advisory:
    "Conditions look steady today. Feed about 2.6g per session and keep the schedule regular. The weather is calm, so normal feeding is fine as long as the fish stay active.",
  ai_engine_on: false,
  final_recommended_feed_g_per_session: 2.6,
  final_recommended_feed_g_per_day: 7.8,
  rbes: { growth_stage: "juvenile", feeding_rate_percent: 3.5 },
  weather: {
    condition: "Clear Sky",
    aquaculture_advisory: "Optimal weather: Normal feeding schedule recommended.",
  },
  inputs: {
    fish_species: "tilapia",
    water_temperature_c: 28.4,
    ph_level: 7.1,
    fish_age_months: 3,
    fish_count: 500,
    sessions_per_day: 3,
  },
};

function LiveAIAdvisoryCard({
  onEngineStatusChange,
}: {
  onEngineStatusChange: (isOn: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAdvisoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fish_species: "tilapia",
    water_temperature_c: 28,
    ph_level: 7.2,
    fish_age_months: 3,
    fish_count: 500,
    sessions_per_day: 3,
  });

  const fetchAdvisory = async () => {
    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        setResult(DEMO_AI_RESULT);
        onEngineStatusChange(false);
        if (DEMO_AI_RESULT.inputs) {
          setForm((current) => ({
            ...current,
            fish_species: DEMO_AI_RESULT.inputs!.fish_species,
            water_temperature_c: DEMO_AI_RESULT.inputs!.water_temperature_c,
            ph_level: DEMO_AI_RESULT.inputs!.ph_level,
            fish_age_months: DEMO_AI_RESULT.inputs!.fish_age_months,
            fish_count: DEMO_AI_RESULT.inputs!.fish_count,
            sessions_per_day: DEMO_AI_RESULT.inputs!.sessions_per_day,
          }));
        }
        return;
      }

      const res = await fetch(`${BACKEND_URL}/recommendation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: AIAdvisoryResult = await res.json();
      setResult(data);
      onEngineStatusChange(data.ai_engine_on !== false);
      if (data.inputs) {
        setForm((current) => ({
          ...current,
          fish_species: data.inputs?.fish_species ?? current.fish_species,
          water_temperature_c: data.inputs?.water_temperature_c ?? current.water_temperature_c,
          ph_level: data.inputs?.ph_level ?? current.ph_level,
          fish_age_months: data.inputs?.fish_age_months ?? current.fish_age_months,
          fish_count: data.inputs?.fish_count ?? current.fish_count,
          sessions_per_day: data.inputs?.sessions_per_day ?? current.sessions_per_day,
        }));
      }
    } catch (e: any) {
      onEngineStatusChange(false);
      setError(e.message || "Failed to fetch AI advisory.");
    } finally {
      setLoading(false);
    }
  };

  const applyRecommendationInputs = () => {
    if (!result?.inputs) return;

    setForm((current) => ({
      ...current,
      fish_species: result.inputs?.fish_species ?? current.fish_species,
      water_temperature_c: result.inputs?.water_temperature_c ?? current.water_temperature_c,
      ph_level: result.inputs?.ph_level ?? current.ph_level,
      fish_age_months: result.inputs?.fish_age_months ?? current.fish_age_months,
      fish_count: result.inputs?.fish_count ?? current.fish_count,
      sessions_per_day: result.inputs?.sessions_per_day ?? current.sessions_per_day,
    }));
  };

  return (
    <section className="ai-live-card">
      <div className="ai-live-header">
        <div className="ai-live-icon">
          <MdAutoAwesome />
        </div>
        <div>
          <h2>{DEMO_MODE ? "Demo AI Advisory" : "Live AI Advisory"}</h2>
          <p>{DEMO_MODE ? "Simulated farm recommendation" : "Powered by Groq · Llama 3.3 70B"}</p>
        </div>
      </div>

      <div className="ai-form-grid">
        <label className="ai-form-group">
          <span>Species</span>
          <select
            value={form.fish_species}
            onChange={(e) => setForm({ ...form, fish_species: e.target.value })}
          >
            <option value="tilapia">Tilapia</option>
            <option value="catfish">Catfish</option>
          </select>
        </label>
        <label className="ai-form-group">
          <span>Water Temp (°C)</span>
          <input
            type="number"
            value={form.water_temperature_c}
            onChange={(e) => setForm({ ...form, water_temperature_c: +e.target.value })}
          />
        </label>
        <label className="ai-form-group">
          <span>pH Level</span>
          <input
            type="number"
            step="0.1"
            value={form.ph_level}
            onChange={(e) => setForm({ ...form, ph_level: +e.target.value })}
          />
        </label>
        <label className="ai-form-group">
          <span>Fish Age (months)</span>
          <input
            type="number"
            value={form.fish_age_months}
            onChange={(e) => setForm({ ...form, fish_age_months: +e.target.value })}
          />
        </label>
        <label className="ai-form-group">
          <span>Fish Count</span>
          <input
            type="number"
            value={form.fish_count}
            onChange={(e) => setForm({ ...form, fish_count: +e.target.value })}
          />
        </label>
        <label className="ai-form-group">
          <span>Sessions / Day</span>
          <input
            type="number"
            min={1}
            max={6}
            value={form.sessions_per_day}
            onChange={(e) => setForm({ ...form, sessions_per_day: +e.target.value })}
          />
        </label>
      </div>

      <button className="ai-generate-btn" onClick={fetchAdvisory} disabled={loading}>
        {loading ? (
          <span className="ai-spinner" />
        ) : (
          <>
            <MdAutoAwesome /> {DEMO_MODE ? "Generate Demo Advisory" : "Generate AI Advisory"}
          </>
        )}
      </button>

      {error && <div className="ai-error"><MdWarning /> {error}</div>}

      {result && (
        <div className="ai-result">
          <div className="ai-result-metrics">
            <div className="ai-metric">
              <span className="ai-metric-label">Per Session</span>
              <span className="ai-metric-value">{result.final_recommended_feed_g_per_session}g</span>
            </div>
            <div className="ai-metric">
              <span className="ai-metric-label">Per Day</span>
              <span className="ai-metric-value">{result.final_recommended_feed_g_per_day}g</span>
            </div>
            <div className="ai-metric">
              <span className="ai-metric-label">Growth Stage</span>
              <span className="ai-metric-value capitalize">{result.rbes?.growth_stage}</span>
            </div>
          </div>

          <div className="ai-advisory-box">
            <div className="ai-advisory-label">
              <MdSmartToy /> AI Feeding Advisory
            </div>
            <p>{result.ai_advisory}</p>
          </div>

          {result.weather && (
            <div className="ai-weather-note">
              <strong>{result.weather.condition}</strong> — {result.weather.aquaculture_advisory}
            </div>
          )}

          <button className="ai-refresh-btn" onClick={fetchAdvisory}>
            <MdRefresh /> Regenerate
          </button>
          <button className="ai-refresh-btn" onClick={applyRecommendationInputs} disabled={!result?.inputs}>
            <MdAutoAwesome /> Use Recommendation Inputs
          </button>
        </div>
      )}
    </section>
  );
}

function AI_Recommendation() {
  const { notifications, loading } = useNotifications();
  const recommendations = notifications.filter(
    (item) => item.type === "recommendation" || item.category === "recommendation"
  );
  const [aiEngineOn, setAiEngineOn] = useState<boolean>(true);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f4f6fb", color: "#333" }}>
        Loading recommendations...
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <header className="top-header ai-hero">
          <div>
            <span className="eyebrow">Decision Support</span>
            <h1>AI Recommendations</h1>
            <p>Feeding guidance shaped by water conditions, fish growth stage, and weather.</p>
          </div>
          <div
            className={`hero-badge ${aiEngineOn ? "badge-on" : "badge-off"}`}
            role="status"
            aria-label={aiEngineOn ? "AI recommendation system is on" : "AI recommendation system is off"}
          >
            <span className={aiEngineOn ? "live-on" : "live-off"}>Live</span>
            <strong>{aiEngineOn ? "AI Recommendation System" : "AI Recommendation System"}</strong>
          </div>
        </header>

        {/* Live AI Advisory Section */}
        <div className="section-label">LIVE AI ADVISORY</div>
        <div id="live-ai-advisory">
          <LiveAIAdvisoryCard onEngineStatusChange={setAiEngineOn} />
        </div>

        {/* Stored Recommendations */}
        {recommendations.length > 0 && (
          <>
            <div className="section-label" style={{ marginTop: 30 }}>SAVED RECOMMENDATIONS</div>
            {recommendations.map((recommendation) => (
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

                  <button
                    className="apply-btn"
                    onClick={() => document.getElementById("live-ai-advisory")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  >
                    Review live input form
                  </button>
                  <button className="dismiss-btn">Dismiss</button>
                </div>
              </section>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

export default AI_Recommendation;
