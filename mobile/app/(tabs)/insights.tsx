import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePonds, useSchedules } from '../../hooks/useFirestore';

const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  Constants.expoConfig?.extra?.backendUrl ||
  'http://10.0.2.2:8000';

const C = {
  primary:            '#005bbf',
  primaryLight:       '#dce8ff',
  secondary:          '#006874',
  secondaryLight:     '#d0f4f8',
  tertiary:           '#006b1b',
  tertiaryLight:      '#d4f0d6',
  error:              '#ba1a1a',
  errorLight:         '#ffdad6',
  surface:            '#f8f9fa',
  card:               '#ffffff',
  border:             '#e4e6ea',
  textPrimary:        '#191c1d',
  textSecondary:      '#5c6370',
  textMuted:          '#8f96a3',
};

// ─── Bottom Nav ──────────────────────────────────────────────────────────────
type NavItemProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  active?: boolean;
  badge?: boolean;
  onPress?: () => void;
};

function NavItem({ icon, label, active, badge, onPress }: NavItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.navItem, pressed && { opacity: 0.8 }]}
    >
      <View style={s.navIconWrap}>
        <MaterialIcons
          name={icon}
          size={24}
          color={active ? '#005bbf' : '#414754'}
        />
        {badge && <View style={s.badge} />}
      </View>
      <Text style={[s.navLabel, active && s.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  sub,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <View style={s.statCard}>
      <View style={[s.statIcon, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statSub}>{sub}</Text>
    </View>
  );
}

// ─── Tip Row ─────────────────────────────────────────────────────────────────
function TipRow({
  icon,
  iconColor,
  iconBg,
  title,
  desc,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  desc: string;
}) {
  return (
    <View style={s.tipRow}>
      <View style={[s.tipIcon, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <View style={s.tipText}>
        <Text style={s.tipTitle}>{title}</Text>
        <Text style={s.tipDesc}>{desc}</Text>
      </View>
    </View>
  );
}

import { WeatherCard } from '../../components/WeatherCard';

// ─── AI Advisory Card ────────────────────────────────────────────────────────
function AIAdvisoryCard() {
  const [loadingAI, setLoadingAI] = useState(false);
  const [advisory, setAdvisory] = useState<string | null>(null);
  const [feedG, setFeedG] = useState<number | null>(null);
  const [dailyG, setDailyG] = useState<number | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [species, setSpecies] = useState<'tilapia' | 'catfish'>('tilapia');
  const [temp, setTemp] = useState('28');
  const [ph, setPh] = useState('7.2');
  const [fishCount, setFishCount] = useState('500');
  const [ageMonths, setAgeMonths] = useState('3');

  const fetchAdvisory = async () => {
    setLoadingAI(true);
    setAiError(null);
    setAdvisory(null);
    try {
      const res = await fetch(`${BACKEND_URL}/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fish_species: species,
          water_temperature_c: parseFloat(temp) || 28,
          ph_level: parseFloat(ph) || 7.2,
          fish_age_months: parseFloat(ageMonths) || 3,
          fish_count: parseInt(fishCount) || 500,
          sessions_per_day: 3,
        }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setAdvisory(data.ai_advisory ?? 'No advisory generated.');
      setFeedG(data.final_recommended_feed_g_per_session);
      setDailyG(data.final_recommended_feed_g_per_day);
    } catch (e: any) {
      setAiError(
        e.message === 'Network request failed' || e.message === 'NetworkError when attempting to fetch resource.'
          ? 'Cannot reach the backend. Set EXPO_PUBLIC_BACKEND_URL to your computer IP if you are using a physical phone.'
          : e.message || 'Failed to connect to backend.'
      );
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <View style={s.aiCard}>
      <LinearGradient
        colors={['#2563eb', '#7c3aed']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={s.aiCardHeader}
      >
        <MaterialIcons name="auto-awesome" size={22} color="#fff" />
        <View style={{ marginLeft: 10 }}>
          <Text style={s.aiCardTitle}>Live AI Advisory</Text>
          <Text style={s.aiCardSubtitle}>Groq · Llama 3.3 70B</Text>
        </View>
      </LinearGradient>

      <View style={s.aiForm}>
        {/* Species Toggle */}
        <View style={s.speciesRow}>
          {(['tilapia', 'catfish'] as const).map((sp) => (
            <TouchableOpacity
              key={sp}
              style={[s.speciesBtn, species === sp && s.speciesBtnActive]}
              onPress={() => setSpecies(sp)}
            >
              <Text style={[s.speciesBtnText, species === sp && s.speciesBtnTextActive]}>
                {sp.charAt(0).toUpperCase() + sp.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.aiFormRow}>
          <View style={s.aiFormField}>
            <Text style={s.aiFieldLabel}>Temp (°C)</Text>
            <TextInput style={s.aiInput} keyboardType="numeric" value={temp} onChangeText={setTemp} />
          </View>
          <View style={s.aiFormField}>
            <Text style={s.aiFieldLabel}>pH Level</Text>
            <TextInput style={s.aiInput} keyboardType="numeric" value={ph} onChangeText={setPh} />
          </View>
        </View>
        <View style={s.aiFormRow}>
          <View style={s.aiFormField}>
            <Text style={s.aiFieldLabel}>Fish Count</Text>
            <TextInput style={s.aiInput} keyboardType="numeric" value={fishCount} onChangeText={setFishCount} />
          </View>
          <View style={s.aiFormField}>
            <Text style={s.aiFieldLabel}>Age (months)</Text>
            <TextInput style={s.aiInput} keyboardType="numeric" value={ageMonths} onChangeText={setAgeMonths} />
          </View>
        </View>

        <TouchableOpacity style={s.aiGenerateBtn} onPress={fetchAdvisory} disabled={loadingAI}>
          {loadingAI ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <MaterialIcons name="auto-awesome" size={16} color="#fff" />
              <Text style={s.aiGenerateBtnText}>  Generate AI Advisory</Text>
            </>
          )}
        </TouchableOpacity>

        {aiError && (
          <View style={s.aiError}>
            <MaterialIcons name="warning" size={16} color="#b45309" />
            <Text style={s.aiErrorText}> {aiError}</Text>
          </View>
        )}

        {advisory && (
          <View style={s.aiResult}>
            <View style={s.aiMetricsRow}>
              <View style={s.aiMetric}>
                <Text style={s.aiMetricLabel}>Per Session</Text>
                <Text style={s.aiMetricValue}>{feedG}g</Text>
              </View>
              <View style={s.aiMetric}>
                <Text style={s.aiMetricLabel}>Per Day</Text>
                <Text style={s.aiMetricValue}>{dailyG}g</Text>
              </View>
            </View>
            <View style={s.aiAdvisoryBox}>
              <View style={s.aiAdvisoryLabel}>
                <MaterialIcons name="smart-toy" size={14} color="#4f46e5" />
                <Text style={s.aiAdvisoryLabelText}>  AI FEEDING ADVISORY</Text>
              </View>
              <Text style={s.aiAdvisoryText}>{advisory}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function InsightsScreen() {
  const router = useRouter();
  const { ponds, loading: lp } = usePonds();
  const { schedules, loading: ls } = useSchedules();

  if (lp || ls) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  // ── Computed values ────────────────────────────────────────────────────────
  const totalDailyKg = schedules.reduce(
    (sum, s) => sum + (Number(s.amountKg) || 0),
    0
  );
  const weekly = totalDailyKg * 7;
  const pondCount = ponds.length;
  const scheduleCount = schedules.length;

  // Efficiency: base 88% + 2% per pond, capped at 99%
  const efficiency = Math.min(99, 88 + pondCount * 2);

  // Waste estimate
  const wasteKg = weekly > 0 ? +(weekly * (1 - efficiency / 100)).toFixed(2) : 0;
  const wasteDisplay = wasteKg > 0 ? `${wasteKg} kg` : '—';

  // Cost saving (₱15/kg saved vs manual overfeeding)
  const savedKg = weekly > 0 ? +(weekly * 0.12).toFixed(2) : 0;
  const savedPeso = savedKg > 0
    ? `₱${(savedKg * 15).toLocaleString('en-PH', { maximumFractionDigits: 0 })}`
    : '—';

  // Dynamic tips based on real data
  const pond1 = ponds[0]?.name ?? null;
  const fish1 = ponds[0]?.fishType ?? 'your fish';
  const pond2 = ponds[1]?.name ?? ponds[0]?.name ?? null;

  const noData = pondCount === 0 && scheduleCount === 0;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={{ flex: 1 }}>

        {/* Header - Gradient brand bar matching all screens */}
        <LinearGradient
          colors={['#1a73e8', '#006874']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.topBar}
        >
          <View style={s.topBarRow}>
            <View style={s.brandRow}>
              <View style={s.logoBlock}>
                <MaterialIcons name="eco" size={16} color="#ffffff" />
              </View>
              <Text style={s.brandText}>FIZFEED</Text>
            </View>
            <Pressable style={s.menuButton} onPress={() => router.push('/profile')}>
              <MaterialIcons name="menu" size={22} color="#ffffff" />
            </Pressable>
          </View>
          <View style={s.topBarBottomRow}>
            <View>
              <Text style={s.bannerTitle}>Farm Insights</Text>
              <Text style={s.bannerSubtitle}>Based on your ponds & schedules</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Live Farm Weather Card */}
          <WeatherCard />

          {/* ── Live AI Advisory ────────────────────────────────────────────── */}
          <AIAdvisoryCard />

          {/* ── Overview banner ────────────────────────────────────────────── */}
          <LinearGradient
            colors={['#005bbf', '#006874']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.banner}
          >

            <View style={s.bannerLeft}>
              <Text style={s.bannerLabel}>Overall Efficiency</Text>
              <Text style={s.bannerValue}>{noData ? '—' : `${efficiency}%`}</Text>
              <Text style={s.bannerSub}>
                {noData
                  ? 'Add ponds and schedules to see insights'
                  : `${pondCount} pond${pondCount !== 1 ? 's' : ''} · ${scheduleCount} schedule${scheduleCount !== 1 ? 's' : ''}`}
              </Text>
            </View>
            <MaterialIcons name="eco" size={52} color="rgba(255,255,255,0.15)" />
          </LinearGradient>

          {/* ── Stats row ──────────────────────────────────────────────────── */}
          <View style={s.statsRow}>
            <StatCard
              icon="scale"
              iconBg={C.errorLight}
              iconColor={C.error}
              label="Est. Weekly Waste"
              value={wasteDisplay}
              sub="at current efficiency"
            />
            <StatCard
              icon="savings"
              iconBg={C.tertiaryLight}
              iconColor={C.tertiary}
              label="Est. Weekly Saving"
              value={savedPeso}
              sub="vs manual feeding"
            />
            <StatCard
              icon="set-meal"
              iconBg={C.primaryLight}
              iconColor={C.primary}
              label="Daily Feed"
              value={totalDailyKg > 0 ? `${totalDailyKg.toFixed(1)} kg` : '—'}
              sub="across all ponds"
            />
          </View>

          {/* ── Tips section ───────────────────────────────────────────────── */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Feeding & Weather Insights</Text>

            <TipRow
              icon="wb-sunny"
              iconColor="#d97706"
              iconBg="#fef3c7"
              title="Live Weather & Ambient Conditions"
              desc="Current farm weather is 28°C (Clear/Sunny). Warm sunlight promotes natural phytoplankton photosynthesis, supporting optimal natural dissolved oxygen."
            />

            {noData ? (
              <View style={s.emptyWrap}>
                <MaterialIcons name="info-outline" size={32} color={C.textMuted} />
                <Text style={s.emptyText}>
                  Add a pond and feeding schedule to receive personalized tips.
                </Text>
              </View>
            ) : (
              <>
                {pond1 && (
                  <TipRow
                    icon="schedule"
                    iconColor={C.primary}
                    iconBg={C.primaryLight}
                    title={`Check feeding time for ${pond1}`}
                    desc={`Feeding ${fish1} at consistent times improves nutrient uptake and reduces leftover feed.`}
                  />
                )}

                {totalDailyKg > 0 && (
                  <TipRow
                    icon="monitor-weight"
                    iconColor={C.secondary}
                    iconBg={C.secondaryLight}
                    title="Review daily feed amount"
                    desc={`You're dispensing ${totalDailyKg.toFixed(1)} kg/day. Adjust if fish age or water temperature has changed recently.`}
                  />
                )}

                {pond2 && (
                  <TipRow
                    icon="water"
                    iconColor={C.tertiary}
                    iconBg={C.tertiaryLight}
                    title={`Aerate ${pond2} on Rain/Cloudy Days`}
                    desc="Since rain reduces atmospheric oxygen solubility, the 3-Layer engine automatically optimizes feed to prevent uneaten waste."
                  />
                )}
              </>
            )}
          </View>

          {/* ── Pond summary ───────────────────────────────────────────────── */}
          {pondCount > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Pond Summary</Text>
              {ponds.map((pond) => {
                const pondSchedules = schedules.filter(
                  (s) => s.pondId === pond.id || s.pondName === pond.name
                );
                const pondFeed = pondSchedules.reduce(
                  (sum, s) => sum + (Number(s.amountKg) || 0),
                  0
                );
                return (
                  <View key={pond.id} style={s.pondRow}>
                    <View style={s.pondDot} />
                    <View style={{ flex: 1 }}>
                      <Text style={s.pondName}>{pond.name}</Text>
                      <Text style={s.pondMeta}>
                        {pond.fishType ?? 'Fish'} ·{' '}
                        {pondFeed > 0
                          ? `${pondFeed.toFixed(1)} kg/day`
                          : 'No schedule set'}
                      </Text>
                    </View>
                    <View
                      style={[
                        s.pondStatus,
                        {
                          backgroundColor:
                            pond.isConnected !== false
                              ? C.tertiaryLight
                              : C.errorLight,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          s.pondStatusText,
                          {
                            color:
                              pond.isConnected !== false ? C.tertiary : C.error,
                          },
                        ]}
                      >
                        {pond.isConnected !== false ? 'Online' : 'Offline'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Bottom Nav */}
        <View style={s.bottomNav}>
          <NavItem icon="home" label="Home" onPress={() => router.replace('/(tabs)')} />
          <NavItem icon="calendar-month" label="Schedule" onPress={() => router.replace('/schedule')} />
          <NavItem icon="bar-chart" label="Analytics" onPress={() => router.replace('/analytics')} />
          <NavItem icon="auto-awesome" label="Insights" active />
          <NavItem icon="notifications" label="Alerts" onPress={() => router.replace('/alerts')} />
          <NavItem icon="person" label="Profile" onPress={() => router.replace('/profile')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surface },

  // Top bar (gradient brand header)
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBlock: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },

  scroll: { paddingBottom: 110, gap: 0 },

  // Banner
  banner: {
    margin: 16,
    borderRadius: 14,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerLeft: { flex: 1 },
  bannerLabel: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  bannerValue: { fontSize: 40, fontWeight: '800', color: '#fff', lineHeight: 48, marginTop: 2 },
  bannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: { fontSize: 10, color: C.textMuted, fontWeight: '600', marginBottom: 2 },
  statValue: { fontSize: 18, fontWeight: '700', color: C.textPrimary },
  statSub: { fontSize: 9, color: C.textMuted, marginTop: 2 },

  // Section
  section: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 12,
  },

  // Tips
  tipRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    alignItems: 'flex-start',
  },
  tipIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipText: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: '600', color: C.textPrimary, marginBottom: 2 },
  tipDesc: { fontSize: 13, color: C.textSecondary, lineHeight: 18 },

  // Empty
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: C.textMuted,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },

  // Pond summary
  pondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  pondDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.primary,
    flexShrink: 0,
  },
  pondName: { fontSize: 14, fontWeight: '600', color: C.textPrimary },
  pondMeta: { fontSize: 12, color: C.textMuted, marginTop: 1 },
  pondStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pondStatusText: { fontSize: 11, fontWeight: '700' },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: '#e7e8e9',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    position: 'relative',
    minWidth: 54,
  },
  navIconWrap: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.error,
  },
  navLabel: { fontSize: 11, color: '#414754', fontWeight: '500', marginTop: 3 },
  navLabelActive: { color: '#005bbf', fontWeight: '700' },

  // ── AI Advisory Card ────────────────────────────────────────────────────────
  aiCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  aiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  aiCardTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  aiCardSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 1,
  },
  aiForm: {
    padding: 16,
  },
  speciesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  speciesBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  speciesBtnActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  speciesBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  speciesBtnTextActive: {
    color: '#2563eb',
  },
  aiFormRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  aiFormField: {
    flex: 1,
  },
  aiFieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  aiInput: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#111',
    backgroundColor: '#f9fafb',
  },
  aiGenerateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 10,
    padding: 13,
    marginTop: 4,
  },
  aiGenerateBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  aiError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  aiErrorText: {
    color: '#b45309',
    fontSize: 13,
    flex: 1,
  },
  aiResult: {
    marginTop: 16,
  },
  aiMetricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  aiMetric: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  aiMetricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  aiMetricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2563eb',
  },
  aiAdvisoryBox: {
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#c4b5fd',
    borderRadius: 12,
    padding: 14,
  },
  aiAdvisoryLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiAdvisoryLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4f46e5',
    letterSpacing: 0.5,
  },
  aiAdvisoryText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#1f2937',
  },
});

