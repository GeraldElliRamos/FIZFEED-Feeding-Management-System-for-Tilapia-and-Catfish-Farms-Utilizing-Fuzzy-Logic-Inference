import React, { useEffect, useState } from 'react';
import './WeatherWidget.css';

interface WeatherData {
  location_name: string;
  temperature_c: number;
  feels_like_c: number;
  humidity_percent: number;
  wind_speed_kmh: number;
  precipitation_mm: number;
  condition: string;
  weather_feed_factor: number;
  risk_level: string;
  aquaculture_advisory: string;
}

// Resolve city/country from lat+lon using Nominatim
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'User-Agent': 'FIZFEED-Web/1.0' } }
    );
    const data = await res.json();
    const address = data.address || {};
    const city =
      address.city ||
      address.town ||
      address.municipality ||
      address.city_district ||
      address.county ||
      'Unknown City';
    const country = address.country || 'Philippines';
    return `${city}, ${country}`;
  } catch {
    return 'Quezon City, Philippines';
  }
}

// Map WMO weather codes to advisory + feed factor
function getWeatherMeta(code: number, temp: number) {
  if ([65, 82, 95, 96, 99].includes(code)) {
    return {
      risk_level: 'HIGH',
      weather_feed_factor: 0.6,
      aquaculture_advisory:
        'Heavy Rain/Storm Alert: Dissolved Oxygen drops rapidly. Reduce feed by 30–50% to prevent water fouling.',
    };
  } else if ([61, 63, 80, 81, 53, 55].includes(code)) {
    return {
      risk_level: 'MODERATE',
      weather_feed_factor: 0.85,
      aquaculture_advisory:
        'Rainy Conditions: Monitor surface behavior. Moderate feed reduction advised.',
    };
  } else if (temp > 34) {
    return {
      risk_level: 'MODERATE',
      weather_feed_factor: 0.9,
      aquaculture_advisory:
        'High Temperature Alert: Water warm, oxygen solubility drops in afternoon. Feed during cooler hours.',
    };
  } else if (temp < 22) {
    return {
      risk_level: 'MODERATE',
      weather_feed_factor: 0.9,
      aquaculture_advisory:
        'Low Temperature Alert: Fish metabolism slows down. Feed smaller portions.',
    };
  } else {
    return {
      risk_level: 'LOW',
      weather_feed_factor: 1.0,
      aquaculture_advisory: 'Optimal Weather: Normal feeding schedule recommended.',
    };
  }
}

const WMO_DESC: Record<number, string> = {
  0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Rime Fog', 51: 'Light Drizzle', 53: 'Moderate Drizzle',
  55: 'Dense Drizzle', 61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
  80: 'Rain Showers', 81: 'Moderate Showers', 82: 'Violent Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm + Hail', 99: 'Severe Thunderstorm',
};

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [locationLabel, setLocationLabel] = useState<string>('Detecting location...');

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      // 1. Try browser GPS
      let lat = 14.5995;
      let lon = 120.9842;

      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 60000,
          })
        );
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      } catch {
        // GPS denied or unavailable – use defaults (Manila/QC)
      }

      // 2. Reverse geocode to get city name
      const locationName = await reverseGeocode(lat, lon);
      setLocationLabel(locationName);

      // 3. Fetch weather
      try {
        // Try backend first
        const backRes = await fetch(
          `http://localhost:8000/weather?lat=${lat}&lon=${lon}`
        );
        if (!backRes.ok) throw new Error('backend unavailable');
        const data = await backRes.json();
        setWeather({ ...data, location_name: locationName });
      } catch {
        // Fall back to Open-Meteo directly
        try {
          const omRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
              `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`
          );
          const omData = await omRes.json();
          const cur = omData.current || {};
          const code = cur.weather_code ?? 0;
          const temp = cur.temperature_2m ?? 28.5;
          const meta = getWeatherMeta(code, temp);

          setWeather({
            location_name: locationName,
            temperature_c: temp,
            feels_like_c: cur.apparent_temperature ?? temp,
            humidity_percent: cur.relative_humidity_2m ?? 75,
            wind_speed_kmh: cur.wind_speed_10m ?? 5,
            precipitation_mm: cur.precipitation ?? 0,
            condition: WMO_DESC[code] ?? 'Partly Cloudy',
            ...meta,
          });
        } catch {
          setWeather({
            location_name: locationName,
            temperature_c: 28.0,
            feels_like_c: 29.5,
            humidity_percent: 75,
            wind_speed_kmh: 5.0,
            precipitation_mm: 0,
            condition: 'Partly Cloudy',
            risk_level: 'LOW',
            weather_feed_factor: 1.0,
            aquaculture_advisory: 'Weather service offline. Using baseline conditions.',
          });
        }
      }

      setLoading(false);
    };

    run();
  }, []);

  const getRiskClass = (risk: string) => {
    if (risk === 'HIGH') return 'badge-danger';
    if (risk === 'MODERATE') return 'badge-warning';
    return 'badge-success';
  };

  if (loading) {
    return (
      <div className="weather-widget-card loading">
        <div className="spinner"></div>
        <p>{locationLabel === 'Detecting location...' ? 'Detecting your location…' : `Loading weather for ${locationLabel}…`}</p>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="weather-widget-card">
      <div className="weather-widget-header">
        <div className="location-info">
          <span className="location-icon">📍</span>
          <div className="location-text-wrap">
            <span className="location-label">Farm Location</span>
            <h3>{weather.location_name}</h3>
          </div>
        </div>
        <span className={`risk-badge ${getRiskClass(weather.risk_level)}`}>
          {weather.risk_level} RISK
        </span>
      </div>

      <div className="weather-widget-body">
        <div className="main-temp">
          <span className="temp-value">{Math.round(weather.temperature_c)}°C</span>
          <div className="condition-wrap">
            <span className="condition-text">{weather.condition}</span>
            <span className="feels-like">Feels like {Math.round(weather.feels_like_c)}°C</span>
          </div>
        </div>

        <div className="weather-stats-grid">
          <div className="weather-stat-item">
            <span className="stat-label">Humidity</span>
            <span className="stat-val">{weather.humidity_percent}%</span>
          </div>
          <div className="weather-stat-item">
            <span className="stat-label">Wind Speed</span>
            <span className="stat-val">{weather.wind_speed_kmh} km/h</span>
          </div>
          <div className="weather-stat-item">
            <span className="stat-label">Precipitation</span>
            <span className="stat-val">{weather.precipitation_mm} mm</span>
          </div>
          <div className="weather-stat-item">
            <span className="stat-label">Feed Multiplier</span>
            <span className="stat-val highlight">{weather.weather_feed_factor}x</span>
          </div>
        </div>
      </div>

      <div className="weather-advisory-footer">
        <span className="advisory-icon">💡</span>
        <p className="advisory-text">
          <strong>Aquaculture Advisory:</strong> {weather.aquaculture_advisory}
        </p>
      </div>
    </div>
  );
};

export default WeatherWidget;
