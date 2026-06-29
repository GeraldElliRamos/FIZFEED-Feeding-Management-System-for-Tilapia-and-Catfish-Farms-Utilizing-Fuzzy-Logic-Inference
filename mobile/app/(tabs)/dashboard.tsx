import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const colors = {
  primaryContainer: '#1a73e8',
  primary: '#005bbf',
  onPrimary: '#ffffff',
  secondary: '#006874',
  tertiary: '#006b1b',
  background: '#f8f9fa',
  surface: '#f8f9fa',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f3f4f5',
  surfaceContainerHigh: '#e7e8e9',
  surfaceContainerHighest: '#e1e3e4',
  onSurface: '#191c1d',
  onSurfaceVariant: '#414754',
  outline: '#727785',
  outlineVariant: '#c1c6d6',
  error: '#ba1a1a',
};

type MetricCardProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  value: string;
  label: string;
  iconColor: string;
  bgColor: string;
};

type NavButtonProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  active?: boolean;
  hasNotification?: boolean;
  onPress?: () => void;
};

type PondRecord = {
  id: string;
  name: string;
  type: string;
};

type PondSensor = {
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
};

type ScheduleRecord = {
  id: string;
  time: string;
  ponds: string;
  feedWeight: string;
  active?: boolean;
};

function MetricCard({ icon, value, label, iconColor, bgColor }: MetricCardProps) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIconContainer, { backgroundColor: bgColor }]}>
        <MaterialIcons name={icon} size={24} color={iconColor} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function NavButton({ icon, label, active, hasNotification, onPress }: NavButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.navButton, pressed && styles.navButtonPressed]}
    >
      <MaterialIcons name={icon} size={24} color={active ? colors.primary : colors.onSurfaceVariant} />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
      {hasNotification ? <View style={styles.notificationBadge} /> : null}
    </Pressable>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [pondName, setPondName] = useState('');
  const [pondType, setPondType] = useState('');
  const [ponds, setPonds] = useState<PondRecord[]>([]);
  const [fishMenuOpen, setFishMenuOpen] = useState(false);
  const [scheduleTimeMenuOpen, setScheduleTimeMenuOpen] = useState(false);
  const [expandedPondId, setExpandedPondId] = useState<string | null>(null);
  const [showPondForm, setShowPondForm] = useState(true);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleHour, setScheduleHour] = useState('');
  const [scheduleMinute, setScheduleMinute] = useState('');
  const [schedulePeriod, setSchedulePeriod] = useState<'AM' | 'PM' | ''>('');
  const [schedulePonds, setSchedulePonds] = useState('');
  const [scheduleFishType, setScheduleFishType] = useState('');
  const [scheduleFishMenuOpen, setScheduleFishMenuOpen] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([]);
  const hourOptions = Array.from({ length: 12 }, (_, hour) => String(hour + 1).padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, '0'));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSavePond = () => {
    const trimmedName = pondName.trim();
    const trimmedType = pondType.trim();

    if (!trimmedName || !trimmedType) {
      return;
    }

    setPonds((currentPonds) => [
      ...currentPonds,
      { id: `${Date.now()}-${currentPonds.length}`, name: trimmedName, type: trimmedType },
    ]);
    setExpandedPondId(`${Date.now()}-${ponds.length}`);
    setPondName('');
    setPondType('');
    setFishMenuOpen(false);
    setShowPondForm(false);
  };

  const getPondSensors = (pond: PondRecord): PondSensor[] => [
    { label: 'Temperature', value: '--', icon: 'thermostat', color: colors.error },
    { label: 'pH Level', value: '--', icon: 'opacity', color: colors.secondary },
    { label: 'Feed Weight', value: '--', icon: 'inventory-2', color: colors.primary },
    { label: 'Last Feeding Time', value: '--', icon: 'schedule', color: colors.outline },
  ];

  const handleSaveSchedule = () => {
    const trimmedPonds = schedulePonds.trim();
    const trimmedFishType = scheduleFishType.trim();
    if (!scheduleHour || !scheduleMinute || !schedulePeriod) {
      return;
    }

    const trimmedTime = `${scheduleHour}:${scheduleMinute} ${schedulePeriod}`;

    if (!trimmedPonds || !trimmedFishType) {
      return;
    }

    setSchedules((currentSchedules) => [
      ...currentSchedules,
      {
        id: `${Date.now()}-${currentSchedules.length}`,
        time: trimmedTime,
        ponds: trimmedPonds,
        feedWeight: trimmedFishType,
        active: true,
      },
    ]);
    setSchedulePonds('');
    setScheduleFishType('');
    setShowScheduleForm(false);
    setScheduleTimeMenuOpen(false);
    setScheduleFishMenuOpen(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <LinearGradient colors={['#1a73e8', '#006874']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
            <View style={styles.headerTopRow}>
              <View style={styles.brandRow}>
                <View style={styles.logoBlock}>
                  <MaterialIcons name="eco" size={16} color={colors.onPrimary} />
                </View>
                <Text style={styles.brandText}>FIZFEED</Text>
              </View>
              <Pressable style={styles.menuButton}>
                <MaterialIcons name="menu" size={22} color={colors.onPrimary} />
              </Pressable>
            </View>

            <View style={styles.headerBottomRow}>
              <View>
                <Text style={styles.pageBannerTitle}>Dashboard</Text>
                <Text style={styles.pageBannerSubtitle}>Track pond conditions and activity</Text>
              </View>
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Today</Text>
                <Text style={styles.dateText}>
                  {currentDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
                <Text style={styles.timeText}>
                  {currentDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.mainContent}>
            <View style={styles.metricsGrid}>
              <MetricCard icon="thermostat" value="--" label="Temperature" iconColor={colors.primary} bgColor="#e8f0fe" />
              <MetricCard icon="opacity" value="--" label="pH Level" iconColor={colors.secondary} bgColor="#e6f4f1" />
              <MetricCard icon="inventory-2" value="--" label="Feed Weight" iconColor={colors.tertiary} bgColor="#eaf5ea" />
              <MetricCard icon="wb-sunny" value="--" label="Ambient Light" iconColor={colors.primaryContainer} bgColor="#e8f0fe" />
            </View>

            <View style={styles.section}>
              <View style={styles.setupCard}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitleNormal}>Pond Setup</Text>
                  {ponds.length > 0 ? <Text style={styles.sectionAction}>View All</Text> : <Text style={styles.sectionAction}>Input Details</Text>}
                </View>

                {ponds.length > 0 ? (
                  <View style={styles.savedPondsList}>
                    {ponds.map((pond) => (
                      <View key={pond.id} style={styles.savedPondGroup}>
                        <Pressable
                          style={styles.savedPondRow}
                          onPress={() =>
                            setExpandedPondId((current) => (current === pond.id ? null : pond.id))
                          }
                        >
                          <View style={styles.savedPondTitleContainer}>
                            <View style={styles.savedPondDot} />
                            <View>
                              <Text style={styles.savedPondName}>{pond.name}</Text>
                              <Text style={styles.savedPondType}>{pond.type}</Text>
                            </View>
                          </View>
                          <View style={styles.savedPondRightSide}>
                            <View style={styles.savedPondStatusPill}>
                              <MaterialIcons name="wifi" size={12} color={colors.onSurfaceVariant} />
                              <Text style={styles.savedPondStatusText}>Online</Text>
                            </View>
                            <MaterialIcons
                              name={expandedPondId === pond.id ? 'expand-less' : 'expand-more'}
                              size={20}
                              color={colors.onSurfaceVariant}
                            />
                          </View>
                        </Pressable>

                        {expandedPondId === pond.id ? (
                          <View style={styles.savedPondSensors}>
                            {getPondSensors(pond).map((sensor) => (
                              <View key={sensor.label} style={styles.savedPondSensorItem}>
                                <MaterialIcons name={sensor.icon} size={18} color={sensor.color} />
                                <Text style={styles.savedPondSensorValue}>{sensor.value}</Text>
                                <Text style={styles.savedPondSensorLabel}>{sensor.label}</Text>
                              </View>
                            ))}
                          </View>
                        ) : null}
                      </View>
                    ))}
                  </View>
                ) : null}

                {ponds.length === 0 && showPondForm ? (
                  <View style={styles.setupEmptyState}>
                    <MaterialIcons name="water-drop" size={28} color={colors.primary} />
                    <Text style={styles.setupEmptyTitle}>No ponds added yet</Text>
                    <Text style={styles.setupEmptyText}>
                      Enter pond details below when you&apos;re ready to register them.
                    </Text>
                  </View>
                ) : null}

                {showPondForm ? (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Pond Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. Pond A"
                        placeholderTextColor={colors.onSurfaceVariant}
                        value={pondName}
                        onChangeText={setPondName}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Fish Type</Text>
                      <Pressable style={styles.dropdownButton} onPress={() => setFishMenuOpen(true)}>
                        <Text style={[styles.dropdownButtonText, !pondType && styles.dropdownPlaceholder]}>
                          {pondType || 'Select fish type'}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" size={22} color={colors.onSurfaceVariant} />
                      </Pressable>
                    </View>

                    <Pressable
                      style={styles.saveButton}
                      onPress={handleSavePond}
                      disabled={!pondName.trim() || !pondType.trim()}
                    >
                      <Text style={styles.saveButtonText}>{ponds.length > 0 ? 'Add Another' : 'Save Pond'}</Text>
                    </Pressable>
                  </>
                ) : (
                  <Pressable style={styles.addPondButton} onPress={() => setShowPondForm(true)}>
                    <Text style={styles.addPondButtonText}>Add Another Pond</Text>
                  </Pressable>
                )}

                <Modal transparent visible={fishMenuOpen} animationType="fade" onRequestClose={() => setFishMenuOpen(false)}>
                  <Pressable style={styles.dropdownOverlay} onPress={() => setFishMenuOpen(false)}>
                    <View style={styles.dropdownSheet}>
                      {['Tilapia', 'Catfish (Hito)'].map((fish) => (
                        <Pressable
                          key={fish}
                          style={styles.dropdownOption}
                          onPress={() => {
                            setPondType(fish);
                            setFishMenuOpen(false);
                          }}
                        >
                          <Text style={styles.dropdownOptionText}>{fish}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </Pressable>
                </Modal>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.scheduleCard}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitleNormal}>Today&apos;s Schedule</Text>
                  <Pressable onPress={() => setShowScheduleForm((current) => !current)}>
                    <Text style={styles.sectionAction}>{showScheduleForm ? 'Hide' : 'Add'}</Text>
                  </Pressable>
                </View>
                {schedules.length > 0 ? (
                  <View style={styles.savedScheduleList}>
                    {schedules.map((schedule) => (
                      <View key={schedule.id} style={styles.savedScheduleRow}>
                        <View style={styles.savedScheduleLeft}>
                          <View style={styles.savedScheduleDot} />
                            <View>
                              <Text style={styles.savedScheduleTime}>{schedule.time}</Text>
                              <Text style={styles.savedScheduleMeta}>Ponds: {schedule.ponds}</Text>
                            </View>
                          </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.scheduleEmptyState}>
                    <MaterialIcons name="event-note" size={28} color={colors.primary} />
                    <Text style={styles.setupEmptyTitle}>No schedule added yet</Text>
                    <Text style={styles.setupEmptyText}>
                      Schedule entries will appear here once they&apos;re configured.
                    </Text>
                  </View>
                )}

                {showScheduleForm ? (
                  <View style={styles.scheduleForm}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Time</Text>
                      <Pressable style={styles.dropdownButton} onPress={() => setScheduleTimeMenuOpen(true)}>
                        <Text style={[styles.dropdownButtonText, !scheduleHour && styles.dropdownPlaceholder]}>
                          {scheduleHour ? `${scheduleHour}:${scheduleMinute} ${schedulePeriod}` : 'Select time'}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" size={22} color={colors.onSurfaceVariant} />
                      </Pressable>
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Ponds</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. Pond A, Pond B"
                        placeholderTextColor={colors.onSurfaceVariant}
                        value={schedulePonds}
                        onChangeText={setSchedulePonds}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Fish Type</Text>
                      <Pressable style={styles.dropdownButton} onPress={() => setScheduleFishMenuOpen(true)}>
                        <Text style={[styles.dropdownButtonText, !scheduleFishType && styles.dropdownPlaceholder]}>
                          {scheduleFishType || 'Select fish type'}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" size={22} color={colors.onSurfaceVariant} />
                      </Pressable>
                    </View>
                    <Pressable style={styles.saveButton} onPress={handleSaveSchedule}>
                      <Text style={styles.saveButtonText}>Save Schedule</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable style={styles.addPondButton} onPress={() => setShowScheduleForm(true)}>
                    <Text style={styles.addPondButtonText}>Add Schedule</Text>
                  </Pressable>
                )}

                <Modal
                  transparent
                  visible={scheduleTimeMenuOpen}
                  animationType="fade"
                  onRequestClose={() => setScheduleTimeMenuOpen(false)}
                >
                  <Pressable style={styles.dropdownOverlay} onPress={() => setScheduleTimeMenuOpen(false)}>
                    <Pressable style={styles.timePickerSheet} onPress={() => {}}>
                      <Text style={styles.timePickerTitle}>Select feeding time</Text>
                      <View style={styles.timePickerColumns}>
                        <View style={styles.timePickerColumn}>
                          <Text style={styles.timePickerColumnLabel}>Hour</Text>
                          <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator>
                            {hourOptions.map((option) => (
                              <Pressable
                                key={option}
                                style={[
                                  styles.dropdownOption,
                                  scheduleHour === option && styles.dropdownOptionSelected,
                                ]}
                                onPress={() => setScheduleHour(option)}
                              >
                                <Text style={styles.dropdownOptionText}>{option}</Text>
                              </Pressable>
                            ))}
                          </ScrollView>
                        </View>
                        <View style={styles.timePickerColumn}>
                          <Text style={styles.timePickerColumnLabel}>Minutes</Text>
                          <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator>
                            {minuteOptions.map((option) => (
                              <Pressable
                                key={option}
                                style={[
                                  styles.dropdownOption,
                                  scheduleMinute === option && styles.dropdownOptionSelected,
                                ]}
                                onPress={() => setScheduleMinute(option)}
                              >
                                <Text style={styles.dropdownOptionText}>{option}</Text>
                              </Pressable>
                            ))}
                          </ScrollView>
                        </View>
                        <View style={styles.timePickerColumn}>
                          <Text style={styles.timePickerColumnLabel}>AM / PM</Text>
                          <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator>
                            {(['AM', 'PM'] as const).map((option) => (
                              <Pressable
                                key={option}
                                style={[
                                  styles.dropdownOption,
                                  schedulePeriod === option && styles.dropdownOptionSelected,
                                ]}
                                onPress={() => setSchedulePeriod(option)}
                              >
                                <Text style={styles.dropdownOptionText}>{option}</Text>
                              </Pressable>
                            ))}
                          </ScrollView>
                        </View>
                      </View>
                      <Pressable style={styles.saveButton} onPress={() => setScheduleTimeMenuOpen(false)}>
                        <Text style={styles.saveButtonText}>Done</Text>
                      </Pressable>
                    </Pressable>
                  </Pressable>
                </Modal>

                <Modal
                  transparent
                  visible={scheduleFishMenuOpen}
                  animationType="fade"
                  onRequestClose={() => setScheduleFishMenuOpen(false)}
                >
                  <Pressable style={styles.dropdownOverlay} onPress={() => setScheduleFishMenuOpen(false)}>
                    <Pressable style={styles.timePickerSheet} onPress={() => {}}>
                      <Text style={styles.timePickerTitle}>Select fish type</Text>
                      <View style={styles.timePickerColumn}>
                        {['Tilapia', 'Catfish (Hito)'].map((option) => (
                          <Pressable
                            key={option}
                            style={[
                              styles.dropdownOption,
                              scheduleFishType === option && styles.dropdownOptionSelected,
                            ]}
                            onPress={() => setScheduleFishType(option)}
                          >
                            <Text style={styles.dropdownOptionText}>{option}</Text>
                          </Pressable>
                        ))}
                      </View>
                      <Pressable style={styles.saveButton} onPress={() => setScheduleFishMenuOpen(false)}>
                        <Text style={styles.saveButtonText}>Done</Text>
                      </Pressable>
                    </Pressable>
                  </Pressable>
                </Modal>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <NavButton icon="home" label="Home" active />
          <NavButton icon="calendar-month" label="Schedule" onPress={() => router.push('/schedule')} />
          <NavButton icon="bar-chart" label="Analytics" />
          <NavButton icon="notifications" label="Alerts" onPress={() => router.push('/alerts')} />
          <NavButton icon="person" label="Profile" onPress={() => router.push('/profile')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 124,
  },
  header: {
    minHeight: 128,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBlock: {
    width: 20,
    height: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  pageBannerTitle: {
    color: colors.onPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  pageBannerSubtitle: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.86)',
    fontSize: 13,
    fontWeight: '500',
  },
  dateInfo: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 10,
    fontWeight: '500',
  },
  dateText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  timeText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  mainContent: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 18,
  },
  metricCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    flexBasis: '48%',
    minWidth: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  metricIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  metricValue: {
    color: colors.onSurface,
    fontSize: 18,
    fontWeight: '700',
  },
  metricLabel: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.onSurface,
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitleNormal: {
    color: colors.onSurface,
    fontSize: 18,
    fontWeight: '600',
  },
  sectionAction: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  setupCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  setupEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  setupEmptyTitle: {
    color: colors.onSurface,
    fontSize: 16,
    fontWeight: '700',
  },
  setupEmptyText: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  inputGroup: {
    gap: 6,
    marginTop: 10,
  },
  inputLabel: {
    color: colors.onSurface,
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.onSurface,
    fontSize: 14,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    color: colors.onSurface,
    fontSize: 14,
  },
  dropdownPlaceholder: {
    color: colors.onSurfaceVariant,
  },
  saveButton: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  addPondButton: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addPondButtonText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    padding: 24,
  },
  dropdownSheet: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
  },
  timePickerSheet: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 16,
    maxHeight: 520,
    width: '90%',
    maxWidth: 380,
    alignSelf: 'center',
    elevation: 8,
  },
  timePickerTitle: {
    color: colors.onSurface,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  timePickerColumns: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  timePickerColumn: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  timePickerColumnLabel: {
    color: colors.onSurfaceVariant,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  timePickerScroll: {
    maxHeight: 320,
  },
  dropdownOption: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 2,
  },
  dropdownOptionSelected: {
    backgroundColor: '#dbeafe',
  },
  dropdownOptionText: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: '600',
  },
  savedPondDot: {
    width: 10,
    height: 10,
    borderRadius: 9999,
    backgroundColor: colors.tertiary,
  },
  savedPondTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  savedPondName: {
    color: colors.onSurface,
    fontSize: 16,
    fontWeight: '700',
  },
  savedPondType: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    marginTop: 2,
  },
  savedPondStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: colors.surfaceContainerHigh,
  },
  savedPondStatusText: {
    color: colors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '500',
  },
  savedPondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLow,
    borderLeftWidth: 4,
    borderLeftColor: colors.tertiary,
  },
  savedPondGroup: {
    gap: 8,
  },
  savedPondRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savedPondsList: {
    marginTop: 16,
    gap: 10,
  },
  savedPondSensors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 4,
    paddingBottom: 2,
  },
  savedPondSensorItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexBasis: '18%',
    minWidth: '18%',
    gap: 2,
  },
  savedPondSensorValue: {
    color: colors.onSurfaceVariant,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  savedPondSensorLabel: {
    color: colors.onSurfaceVariant,
    fontSize: 10,
  },
  scheduleCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  scheduleForm: {
    gap: 12,
  },
  savedScheduleList: {
    gap: 10,
    marginBottom: 14,
  },
  savedScheduleRow: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  scheduleBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(216, 226, 255, 0.5)',
    marginBottom: 14,
  },
  scheduleBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleBannerTextWrap: {
    flex: 1,
  },
  scheduleBannerTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  scheduleBannerText: {
    marginTop: 3,
    color: colors.onSurfaceVariant,
    fontSize: 13,
    lineHeight: 19,
  },
  savedScheduleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  savedScheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  savedScheduleDot: {
    width: 10,
    height: 10,
    borderRadius: 9999,
    backgroundColor: colors.tertiary,
  },
  savedScheduleDotInactive: {
    backgroundColor: colors.outlineVariant,
  },
  savedScheduleTime: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: '700',
  },
  savedScheduleMeta: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    marginTop: 2,
  },
  savedScheduleStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: colors.surfaceContainerHigh,
  },
  savedScheduleStatusPillInactive: {
    backgroundColor: '#f0f1f2',
  },
  savedScheduleStatusText: {
    color: colors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '600',
  },
  savedScheduleRowInactive: {
    opacity: 0.65,
  },
  scheduleEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 6,
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
    borderTopColor: colors.surfaceContainerHigh,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    position: 'relative',
    minWidth: 54,
  },
  navButtonPressed: {
    opacity: 0.8,
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
  notificationBadge: {
    position: 'absolute',
    top: 3,
    right: 18,
    width: 7,
    height: 7,
    backgroundColor: colors.error,
    borderRadius: 9999,
  },
});

