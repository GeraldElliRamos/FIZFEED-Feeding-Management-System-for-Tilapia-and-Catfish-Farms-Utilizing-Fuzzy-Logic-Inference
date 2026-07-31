import Sidebar from "./Sidebar";
import "./Help.css";
import "./Sidebar.css";
import {
  MdSensors,
  MdFunctions,
  MdEmail,
  MdBuild,
  MdPhone,
  MdQuestionAnswer,
} from "react-icons/md";

export default function Help() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main help-main">
        <header className="top-header">
          <div>
            <h1>Help & Support Center</h1>
            <p>Guides, sensor calibration, fuzzy tuning, and technical assistance</p>
          </div>
        </header>

        <section className="help-grid">
          {/* SENSOR SETUP GUIDES */}
          <div className="help-card">
            <div className="help-card-header blue">
              <MdSensors className="help-icon" />
              <h3>Sensor Setup Guides</h3>
            </div>
            <div className="help-card-body">
              <p>Step-by-step documentation for installing and calibrating farm sensors:</p>
              <ul>
                <li><strong>DS18B20 Water Temp:</strong> Submerge probe 15-30cm below surface. Ensure waterproof heat-shrink seal.</li>
                <li><strong>pH-4502C Sensor:</strong> Calibrate using pH 4.01 and pH 6.86 buffer solutions before deployment.</li>
                <li><strong>HX711 Load Cell:</strong> Tare container weight daily to ensure accurate feed dosing.</li>
              </ul>
            </div>
          </div>

          {/* FUZZY LOGIC & ANFIS TUNING */}
          <div className="help-card">
            <div className="help-card-header green">
              <MdFunctions className="help-icon" />
              <h3>Fuzzy Logic & ANFIS Tuning</h3>
            </div>
            <div className="help-card-body">
              <p>Learn how the 3-Layer Decision Engine computes feeding rates:</p>
              <ul>
                <li><strong>RBES Layer:</strong> Establishes baseline feed rates based on fish species, age, and biomass.</li>
                <li><strong>FLIA (Mamdani):</strong> Adjusts feed multiplier based on current water temp and pH levels.</li>
                <li><strong>ANFIS Module:</strong> Refines recommendations using historical consumption trends.</li>
              </ul>
            </div>
          </div>

          {/* HARDWARE MAINTENANCE */}
          <div className="help-card">
            <div className="help-card-header purple">
              <MdBuild className="help-icon" />
              <h3>Hardware Maintenance</h3>
            </div>
            <div className="help-card-body">
              <p>Best practices for long-term automated feeder reliability:</p>
              <ul>
                <li>Clean feeder hopper weekly to prevent damp feed blockage.</li>
                <li>Check Wi-Fi / ESP32 microcontroller connectivity status in the <em>Devices</em> tab.</li>
                <li>Inspect solar battery supply voltage during rainy periods.</li>
              </ul>
            </div>
          </div>

          {/* CONTACT SUPPORT */}
          <div className="help-card">
            <div className="help-card-header orange">
              <MdEmail className="help-icon" />
              <h3>Contact Technical Support</h3>
            </div>
            <div className="help-card-body">
              <p>Need extra help or experiencing system issues?</p>
              <div className="contact-info-list">
                <div className="contact-item">
                  <MdEmail size={18} />
                  <span>Email: <strong>support@fizfeed.com</strong></span>
                </div>
                <div className="contact-item">
                  <MdPhone size={18} />
                  <span>Hotline: <strong>+63 (02) 8911-0964</strong></span>
                </div>
                <div className="contact-item">
                  <MdQuestionAnswer size={18} />
                  <span>Hours: <strong>Mon - Sat (8:00 AM - 5:00 PM)</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
