import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePonds, useSchedules } from '../../hooks/useFirestore';

const colors = {
  primary: '#005bbf',
  primaryContainer: '#1a73e8',
  secondary: '#006874',
  tertiary: '#006b1b',
  surface: '#f8f9fa',
  surfaceAlt: '#ffffff',
  surfaceLow: '#f3f4f5',
  surfaceHigh: '#e7e8e9',
  onSurface: '#191c1d',
  onSurfaceVariant: '#414754',
  outline: '#727785',
  outlineVariant: '#c1c6d6',
  error: '#ba1a1a',
  onPrimary: '#ffffff',
  background: '#f8f9fa',
};

type BottomNavItemProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  active?: boolean;
  notification?: boolean;
  onPress?: () => void;
};

function BottomNavItem({ icon, label, active, notification, onPress }: BottomNavItemProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.navItem, pressed && styles.navItemPressed]}>
      <View style={styles.navIconWrap}>
        <MaterialIcons name={icon} size={24} color={active ? colors.primary : colors.onSurfaceVariant} />
        {notification ? <View style={styles.notificationDot} /> : null}
      </View>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

export default function AnalyticsScreen() {
  const router = useRouter();
  const { ponds, loading: pondsLoading } = usePonds();
  const { schedules, loading: schedulesLoading } = useSchedules();

  if (pondsLoading || schedulesLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const totalDailyFeed = schedules.reduce((sum, s) => sum + (Number(s.amountKg) || 0), 0);
  const totalFed7Days = (totalDailyFeed * 7).toFixed(1);
  const efficiency = Math.min(100, 90 + (ponds.length * 1.5)).toFixed(1);
  const totalWaste = (Number(totalFed7Days) * (1 - Number(efficiency) / 100)).toFixed(1);
  const costSaved = (Number(totalFed7Days) * 15).toLocaleString();

  const chartData = Array.from({ length: 7 }, (_, i) => {
    if (totalDailyFeed === 0) return 0;
    const base = totalDailyFeed;
    const fluctuation = base * 0.2;
    const value = base - fluctuation + (Math.sin(i) + 1) * fluctuation;
    const max = base * 1.5;
    return Math.min(100, Math.max(0, (value / max) * 100));
  });

  const isAllOnline = ponds.length > 0 && ponds.every(p => p.isConnected !== false);
  const healthText = isAllOnline ? 'All Sensors Online' : ponds.length === 0 ? 'No Sensors Found' : 'Some Sensors Offline';
  const aiRecPond = schedules.length > 0 ? schedules[0].pondName : ponds.length > 0 ? ponds[0].name : 'your ponds';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <LinearGradient
          colors={['#1a73e8', '#006874']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <View style={styles.brandRow}>
              <View style={styles.logoBlock}>
                <MaterialIcons name="eco" size={16} color={colors.onPrimary} />
              </View>
              <View>
                <Text style={styles.brandText}>FIZFEED</Text>
                <Text style={styles.brandSubText}>Intelligent Aquaculture</Text>
              </View>
            </View>
            <Pressable style={styles.menuButton}>
              <MaterialIcons name="menu" size={22} color={colors.onPrimary} />
            </Pressable>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Screen Title & Back Navigation */}
          <View style={styles.titleSection}>
            <Pressable style={styles.backButton} onPress={() => router.replace('/')}>
              <MaterialIcons name="arrow-back" size={24} color={colors.onSurfaceVariant} />
            </Pressable>
            <View>
              <Text style={styles.pageTitle}>Analytics</Text>
              <Text style={styles.pageSubtitle}>Performance insights & trends</Text>
            </View>
          </View>

          {/* Date Range Selector */}
          <View style={styles.dateSelectorCard}>
            <View style={styles.dateSelectorLeft}>
              <MaterialIcons name="calendar-month" size={20} color={colors.primary} />
              <Text style={styles.dateSelectorText}>Last 7 Days</Text>
            </View>
            <Pressable>
              <Text style={styles.changePeriodText}>Change Period</Text>
            </Pressable>
          </View>

          {/* Summary Grid */}
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, { borderLeftColor: colors.primary }]}>
              <Text style={styles.summaryLabel}>Total Fed</Text>
              <View style={styles.summaryValueRow}>
                <Text style={styles.summaryValue}>{totalFed7Days}</Text>
                <Text style={styles.summaryUnit}>kg</Text>
              </View>
            </View>

            <View style={[styles.summaryCard, { borderLeftColor: colors.secondary }]}>
              <Text style={styles.summaryLabel}>Efficiency</Text>
              <View style={styles.summaryValueRow}>
                <Text style={styles.summaryValue}>{efficiency}</Text>
                <Text style={styles.summaryUnit}>%</Text>
              </View>
            </View>

            <View style={[styles.summaryCard, { borderLeftColor: colors.error }]}>
              <Text style={styles.summaryLabel}>Total Waste</Text>
              <View style={styles.summaryValueRow}>
                <Text style={styles.summaryValue}>{totalWaste}</Text>
                <Text style={styles.summaryUnit}>kg</Text>
              </View>
            </View>

            <View style={[styles.summaryCard, { borderLeftColor: colors.tertiary }]}>
              <Text style={styles.summaryLabel}>Cost Saved</Text>
              <View style={styles.summaryValueRow}>
                <Text style={styles.summaryValue}>₱{costSaved}</Text>
              </View>
            </View>
          </View>

          {/* Daily Feeding Trend Chart (Mock) */}
          <View style={styles.chartSection}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Daily Feeding Trend</Text>
              <View style={styles.chartLegend}>
                <View style={styles.legendDot} />
                <Text style={styles.legendText}>Target Feed (kg)</Text>
              </View>
            </View>
            
            <View style={styles.mockChartContainer}>
               <View style={styles.mockBars}>
                 {/* Y Axis Labels */}
                 <View style={styles.yAxis}>
                   <Text style={styles.axisLabel}>12</Text>
                   <Text style={styles.axisLabel}>9</Text>
                   <Text style={styles.axisLabel}>6</Text>
                   <Text style={styles.axisLabel}>3</Text>
                   <Text style={styles.axisLabel}>0</Text>
                 </View>
                 
                 {/* Chart Body */}
                 <View style={styles.chartBody}>
                    {chartData.map((height, i) => (
                      <View key={i} style={styles.barColumn}>
                        <View style={[styles.bar, { height: `${height}%` }]} />
                      </View>
                    ))}
                 </View>
               </View>

               {/* X Axis Labels */}
               <View style={styles.xAxis}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <Text key={day} style={styles.axisLabelX}>{day}</Text>
                  ))}
               </View>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.detailsRow}>
            {/* AI Recommendation removed for now */}

            <View style={styles.healthCard}>
              <View style={styles.healthContent}>
                <Text style={styles.healthLabel}>System Health</Text>
                <View style={styles.healthStatusRow}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.healthStatusText}>{healthText}</Text>
                </View>
              </View>
              <Pressable style={styles.refreshButton}>
                <MaterialIcons name="refresh" size={24} color={colors.primary} />
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <BottomNavItem icon="home" label="Home" onPress={() => router.replace('/')} />
          <BottomNavItem icon="calendar-month" label="Schedule" onPress={() => router.replace('/schedule')} />
          <BottomNavItem icon="bar-chart" label="Analytics" active />
          <BottomNavItem icon="auto-awesome" label="Insights" onPress={() => router.push('/insights')} />
          <BottomNavItem icon="notifications" label="Alerts" onPress={() => router.replace('/alerts')} />
          <BottomNavItem icon="person" label="Profile" onPress={() => router.replace('/profile')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 120,
    gap: 24,
  },
  header: {
    minHeight: 110,
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBlock: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: colors.onPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandSubText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '500',
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceHigh,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.onSurface,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  dateSelectorCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  dateSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
  },
  changePeriodText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    width: '47.5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    marginBottom: 6,
  },
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.onSurface,
  },
  summaryUnit: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  chartSection: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  legendText: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  mockChartContainer: {
    height: 240,
    width: '100%',
  },
  mockBars: {
    flex: 1,
    flexDirection: 'row',
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingRight: 12,
    paddingBottom: 8,
  },
  axisLabel: {
    fontSize: 10,
    color: colors.outline,
    textAlign: 'right',
    width: 16,
  },
  chartBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceHigh,
    paddingBottom: 0,
  },
  barColumn: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '60%',
    backgroundColor: colors.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    opacity: 0.8,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 28,
    marginTop: 12,
  },
  axisLabelX: {
    fontSize: 10,
    color: colors.outline,
    flex: 1,
    textAlign: 'center',
  },
  detailsRow: {
    flexDirection: 'column',
    gap: 16,
  },
  aiCard: {
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 4,
  },
  aiIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTextWrap: {
    flex: 1,
  },
  aiTitle: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  aiDesc: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    lineHeight: 20,
  },
  healthCard: {
    backgroundColor: colors.surfaceAlt,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.surfaceHigh,
  },
  healthContent: {},
  healthLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  healthStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.tertiary,
  },
  healthStatusText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  refreshButton: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceHigh,
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
  navItemPressed: {
    opacity: 0.8,
  },
  navIconWrap: {
    position: 'relative',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  navLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  notificationDot: {
    position: 'absolute',
    top: -4,
    right: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
});
