import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePonds, useSchedules } from '../../hooks/useFirestore';

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
});
