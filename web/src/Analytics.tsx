import Sidebar from "./Sidebar";
import "./Analytics.css";
import "./Sidebar.css";
import { useEffect, useRef } from "react";
import {
  MdBolt, MdDeleteOutline,
  MdTrendingUp, 
} from "react-icons/md";
import { usePonds } from "./hooks/useFirestore";

function Analytics() {
  const { ponds } = usePonds();
  const weeklyRef = useRef<HTMLCanvasElement>(null);
  const tempRef = useRef<HTMLCanvasElement>(null);
  const wasteBars = ponds.length
    ? ponds.map((pond) => {
        const capacity = Number(pond.capacity) || 0;
        const currentStock = Number(pond.currentStock) || 0;
        return capacity > 0 ? Math.max(0, Math.min(100, 100 - (currentStock / capacity) * 100)) : 0;
      })
    : [0];

  /* ================= WEEKLY FEEDING TREND ================= */
  useEffect(() => {
    const canvas = weeklyRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const parent = canvas.parentElement!;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = parent.clientWidth * dpr;
      canvas.height = 200 * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const w = parent.clientWidth;
      const h = 200;

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(0,0,0,0.05)";
      for (let i = 0; i <= 4; i++) {
        const y = (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, "rgba(37,99,235,0.25)");
      gradient.addColorStop(1, "rgba(37,99,235,0)");

      ctx.beginPath();
      ctx.moveTo(0, h * 0.6);
      ctx.bezierCurveTo(w * 0.25, h * 0.45, w * 0.5, h * 0.55, w, h * 0.4);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, h * 0.6);
      ctx.bezierCurveTo(w * 0.25, h * 0.45, w * 0.5, h * 0.55, w, h * 0.4);
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  /* ================= WATER TEMPERATURE ================= */
  useEffect(() => {
    const canvas = tempRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const parent = canvas.parentElement!;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = parent.clientWidth * dpr;
      canvas.height = 180 * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const w = parent.clientWidth;
      const h = 180;

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(0,0,0,0.05)";
      for (let i = 0; i <= 2; i++) {
        const y = (h / 2) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(0, h * 0.65);
      ctx.bezierCurveTo(w * 0.3, h * 0.55, w * 0.6, h * 0.6, w, h * 0.5);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);


  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
         <header className="top-header">
                  <div>
                    <h1>Data Analytics </h1>
                    <p>Performance insights and metrics</p>
                  </div>
                </header>

        <div className="time-tabs">
          <button>Day</button>
          <button className="active-tab">Week</button>
          <button>Month</button>
        </div>

        <section className="stats-grid">
  <div className="stat-card blue">
    <MdBolt size={26} className="color-icon"/>
    <p className="label">Total Fed</p>
    <h3>--</h3>
  </div>

  <div className="stat-card green">
    <MdTrendingUp size={26} className="color-icon" />
    <p className="label">Efficiency</p>
    <h3>--</h3>
  </div>

  <div className="stat-card red">
    <MdDeleteOutline size={26} className="color-icon" />
    <p className="label">Waste</p>
    <h3>--</h3>
  </div>
</section>

   <section className="chart-card">
          <h2>Weekly Feeding Trend</h2>
          <canvas ref={weeklyRef} className="canvas-chart" />
        </section>

        <div className="secondary-grid">
          {/* WATER TEMPERATURE */}
          <section className="chart-card">
            <h2>Water Temperature</h2>
            <canvas ref={tempRef} className="canvas-chart" />
          </section>

          {/* FEED WASTE */}
          <section className="chart-card">
            <h2>Feed Waste</h2>
            <div className="waste-bars">
              {wasteBars.map((v, i) => (
                <div key={i} className="waste-bar" style={{ height: `${v}%` }} />
              ))}
            </div>
          </section>
           </div>
      
      </main>
    </div>
  );
}

export default Analytics;

