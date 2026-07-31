import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

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

const WMO_DESC: Record<number, string> = {
  0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Fog', 51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
  61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
  80: 'Rain Showers', 81: 'Moderate Showers', 82: 'Violent Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm + Hail', 99: 'Severe Thunderstorm',
};

function getWeatherMeta(code: number, temp: number) {
  if ([65, 82, 95, 96, 99].includes(code)) {
    return {
      risk_level: 'HIGH', weather_feed_factor: 0.6,
      aquaculture_advisory: 'Heavy Rain Warning: Dissolved Oxygen drops rapidly. Reduce feed by 30–50%.',
    };
  } else if ([61, 63, 80, 81, 53, 55].includes(code)) {
    return {
      risk_level: 'MODERATE', weather_feed_factor: 0.85,
      aquaculture_advisory: 'Rainy Weather: Monitor surface feeding behavior actively.',
    };
  } else if (temp > 34) {
    return {
      risk_level: 'MODERATE', weather_feed_factor: 0.9,
      aquaculture_advisory: 'High Temp Alert: Feed during cooler morning or evening hours.',
    };
  } else if (temp < 22) {
    return {
      risk_level: 'MODERATE', weather_feed_factor: 0.9,
      aquaculture_advisory: 'Low Temp Alert: Fish metabolism slows. Feed smaller portions.',
    };
  }
  return {
    risk_level: 'LOW', weather_feed_factor: 1.0,
    aquaculture_advisory: 'Optimal weather: Normal feeding schedule recommended.',
  };
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const places = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
    if (places.length > 0) {
      const p = places[0];
      const city = p.city || p.subregion || p.region || 'Unknown City';
      const country = p.country || 'Philippines';
      return `${city}, ${country}`;
    }
  } catch {}
  return 'Quezon City, Philippines';
}

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState('Detecting location…');

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);

      // 1. Request GPS permission
      let lat = 14.5995;
      let lon = 120.9842;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setStatusText('Getting your location…');
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
        }
      } catch {}

      // 2. Reverse geocode to city name
      setStatusText('Loading weather…');
      const locationName = await reverseGeocode(lat, lon);

      // 3. Fetch weather from Open-Meteo
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`
        );
        const data = await res.json();
        const cur = data.current || {};
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

      setLoading(false);
    }

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <View style={s.card}>
        <ActivityIndicator size="small" color="#005bbf" />
        <Text style={s.loadingText}>{statusText}</Text>
      </View>
    );
  }

  if (!weather) return null;

  const isDanger = weather.risk_level === 'HIGH';
  const isWarning = weather.risk_level === 'MODERATE';

  return (
    <View style={[s.card, isDanger && s.cardDanger, isWarning && s.cardWarning]}>
      <View style={s.header}>
        <View style={s.headerTitle}>
          <MaterialIcons name="location-on" size={18} color="#005bbf" />
          <View>
            <Text style={s.locationLabel}>FARM LOCATION</Text>
            <Text style={s.title}>{weather.location_name}</Text>
          </View>
        </View>
        <View style={[s.badge, isDanger ? s.badgeDanger : isWarning ? s.badgeWarning : s.badgeSuccess]}>
          <Text style={[s.badgeText, isDanger ? s.textDanger : isWarning ? s.textWarning : s.textSuccess]}>
            {weather.risk_level} RISK
          </Text>
        </View>
      </View>

      <View style={s.body}>
        <View style={s.tempWrap}>
          <Text style={s.temp}>{Math.round(weather.temperature_c)}°C</Text>
          <View>
            <Text style={s.condition}>{weather.condition}</Text>
            <Text style={s.feels}>Feels like {Math.round(weather.feels_like_c)}°C</Text>
          </View>
        </View>

        <View style={s.grid}>
          <View style={s.gridItem}>
            <Text style={s.gridLabel}>HUMIDITY</Text>
            <Text style={s.gridVal}>{weather.humidity_percent}%</Text>
          </View>
          <View style={s.gridItem}>
            <Text style={s.gridLabel}>WIND</Text>
            <Text style={s.gridVal}>{weather.wind_speed_kmh}km/h</Text>
          </View>
          <View style={s.gridItem}>
            <Text style={s.gridLabel}>RAIN</Text>
            <Text style={s.gridVal}>{weather.precipitation_mm}mm</Text>
          </View>
          <View style={s.gridItem}>
            <Text style={s.gridLabel}>FEED MULT</Text>
            <Text style={s.gridValHighlight}>{weather.weather_feed_factor}x</Text>
          </View>
        </View>
      </View>

      <View style={s.advisoryBox}>
        <MaterialIcons name="info-outline" size={16} color="#005bbf" />
        <Text style={s.advisoryText}>{weather.aquaculture_advisory}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e4e6ea',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  cardWarning: { borderColor: '#ffeeba' },
  cardDanger: { borderColor: '#f5c6cb' },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: '#5c6370',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    width: '100%',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    flex: 1,
  },
  locationLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8f96a3',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#191c1d',
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeSuccess: { backgroundColor: '#d4f0d6' },
  badgeWarning: { backgroundColor: '#fff3cd' },
  badgeDanger: { backgroundColor: '#ffdad6' },
  badgeText: { fontSize: 10, fontWeight: '700' },
  textSuccess: { color: '#006b1b' },
  textWarning: { color: '#856404' },
  textDanger: { color: '#ba1a1a' },
  body: { gap: 12, width: '100%' },
  tempWrap: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  temp: { fontSize: 36, fontWeight: '800', color: '#005bbf' },
  condition: { fontSize: 14, fontWeight: '600', color: '#191c1d' },
  feels: { fontSize: 12, color: '#5c6370' },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 10,
    width: '100%',
  },
  gridItem: { alignItems: 'center' },
  gridLabel: { fontSize: 9, fontWeight: '700', color: '#8f96a3', marginBottom: 2 },
  gridVal: { fontSize: 13, fontWeight: '600', color: '#191c1d' },
  gridValHighlight: { fontSize: 13, fontWeight: '700', color: '#005bbf' },
  advisoryBox: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e4e6ea',
    alignItems: 'flex-start',
    width: '100%',
  },
  advisoryText: { flex: 1, fontSize: 12, color: '#414754', lineHeight: 16 },
});
