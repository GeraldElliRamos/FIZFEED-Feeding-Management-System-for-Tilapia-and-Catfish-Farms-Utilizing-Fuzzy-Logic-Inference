import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  onSurface: '#191c1d',
  onSurfaceVariant: '#414754',
  outline: '#727785',
  outlineVariant: '#c1c6d6',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
};

type ScheduleItem = {
  id: string;
  time: string;
  pond: string;
  crop: string;
  active: boolean;
};

function BottomNavItem({
  icon,
  label,
  active,
  onPress,
  notification,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  active?: boolean;
  onPress?: () => void;
  notification?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.navItem, pressed && styles.navItemPressed]}>
      <View style={styles.navIconWrap}>
        <MaterialIcons name={icon} size={22} color={active ? colors.primary : colors.onSurfaceVariant} />
        {notification ? <View style={styles.notificationDot} /> : null}
      </View>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function ScheduleCard({
  item,
  onToggle,
  onDelete,
}: {
  item: ScheduleItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={[styles.card, !item.active && styles.cardInactive]}>
      <View style={styles.cardTopRow}>
        <View style={styles.cardLeft}>
          <View style={[styles.scheduleIcon, !item.active && styles.scheduleIconInactive]}>
            <MaterialIcons name="schedule" size={22} color={item.active ? colors.primary : colors.outline} />
          </View>
          <View>
            <Text style={styles.cardTime}>{item.time}</Text>
            <Text style={styles.cardMeta}>{item.pond} • {item.crop}</Text>
          </View>
        </View>
        <Pressable onPress={() => onToggle(item.id)} style={styles.switchHitSlop}>
          <View style={[styles.switchTrack, item.active && styles.switchTrackActive]}>
            <View style={[styles.switchThumb, item.active && styles.switchThumbActive]} />
          </View>
        </Pressable>
      </View>

          <View style={styles.cardBottomRow}>
            <View>
              <Text style={styles.amountLabel}>Amount</Text>
              <Text style={styles.amountValue}>Pending</Text>
            </View>
            <Pressable onPress={() => onDelete(item.id)} style={styles.deleteButton}>
              <MaterialIcons name="delete-outline" size={20} color={item.active ? colors.error : colors.outlineVariant} />
        </Pressable>
      </View>
    </View>
  );
}

export default function ScheduleScreen() {
  const router = useRouter();
  const [currentDate] = useState(() => new Date());
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [scheduleTimeMenuOpen, setScheduleTimeMenuOpen] = useState(false);
  const [scheduleHour, setScheduleHour] = useState('');
  const [scheduleMinute, setScheduleMinute] = useState('');
  const [schedulePeriod, setSchedulePeriod] = useState<'AM' | 'PM' | ''>('');
  const [newPond, setNewPond] = useState('');
  const [newFishType, setNewFishType] = useState('');
  const [fishMenuOpen, setFishMenuOpen] = useState(false);
  const hourOptions = Array.from({ length: 12 }, (_, hour) => String(hour + 1).padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, '0'));

  const stats = useMemo(() => {
    return { total: 'Pending', efficiency: schedules.length ? '94%' : '—' };
  }, [schedules]);

  const toggleSchedule = (id: string) => {
    setSchedules((current) =>
      current.map((schedule) => (schedule.id === id ? { ...schedule, active: !schedule.active } : schedule))
    );
  };

  const deleteSchedule = (id: string) => {
    setSchedules((current) => current.filter((schedule) => schedule.id !== id));
  };

  const addSchedule = () => {
    const pond = newPond.trim();
    const crop = newFishType.trim();

    if (!scheduleHour || !scheduleMinute || !schedulePeriod || !pond || !crop) {
      return;
    }

    const time = `${scheduleHour}:${scheduleMinute} ${schedulePeriod}`;

    setSchedules((current) => [
      ...current,
      {
        id: `${Date.now()}-${current.length}`,
        time,
        pond,
        crop,
        active: true,
      },
    ]);
    setScheduleHour('');
    setScheduleMinute('');
    setSchedulePeriod('');
    setNewPond('');
    setNewFishType('');
    setShowAddForm(false);
    setFishMenuOpen(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <LinearGradient
          colors={['#1a73e8', '#006874']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topBar}
        >
          <View style={styles.topBarRow}>
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

          <View style={styles.topBarBottomRow}>
            <View>
              <Text style={styles.bannerTitle}>Feeding Schedule</Text>
              <Text style={styles.bannerSubtitle}>Manage feeding times and pond assignments</Text>
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

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.list}>
            {schedules.length > 0 ? (
              schedules.map((item) => (
                <ScheduleCard key={item.id} item={item} onToggle={toggleSchedule} onDelete={deleteSchedule} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="event-note" size={28} color={colors.primary} />
                <Text style={styles.emptyTitle}>No schedules yet</Text>
                <Text style={styles.emptyText}>Add your first feeding time to keep things organized.</Text>
              </View>
            )}
          </View>

          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>Quick Insights</Text>
            <View style={styles.insightsGrid}>
              <View style={styles.insightBox}>
                <View style={styles.insightHeader}>
                  <MaterialIcons name="water-drop" size={18} color={colors.secondary} />
                  <Text style={styles.insightLabel}>Daily Total</Text>
                </View>
                <Text style={styles.insightValue}>{stats.total}</Text>
              </View>
              <View style={styles.insightBox}>
                <View style={styles.insightHeader}>
                  <MaterialIcons name="trending-up" size={18} color={colors.tertiary} />
                  <Text style={styles.insightLabel}>Efficiency</Text>
                </View>
                <Text style={[styles.insightValue, styles.insightValueAlt]}>{stats.efficiency}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <Pressable style={styles.floatingAddButton} onPress={() => setShowAddForm(true)}>
          <MaterialIcons name="add" size={24} color={colors.onPrimary} />
        </Pressable>

        <View style={styles.bottomNav}>
          <BottomNavItem icon="home" label="Home" onPress={() => router.replace('/')} />
          <BottomNavItem icon="calendar-month" label="Schedule" active />
          <BottomNavItem icon="bar-chart" label="Analytics" />
          <BottomNavItem icon="notifications" label="Alerts" onPress={() => router.push('/alerts')} />
          <BottomNavItem icon="person" label="Profile" onPress={() => router.push('/profile')} />
        </View>

        <Modal visible={showAddForm} transparent animationType="fade" onRequestClose={() => setShowAddForm(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setShowAddForm(false)}>
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <Text style={styles.modalTitle}>Add schedule</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Time</Text>
                <Pressable style={styles.dropdownButton} onPress={() => setScheduleTimeMenuOpen(true)}>
                  <Text style={[styles.dropdownButtonText, !scheduleHour && styles.dropdownPlaceholder]}>
                    {scheduleHour ? `${scheduleHour}:${scheduleMinute} ${schedulePeriod}` : 'Select time'}
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={22} color={colors.onSurfaceVariant} />
                </Pressable>
              </View>
              <TextInput
                style={styles.modalInput}
                placeholder="Pond name"
                placeholderTextColor={colors.onSurfaceVariant}
                value={newPond}
                onChangeText={setNewPond}
              />
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fish Type</Text>
                <Pressable style={styles.dropdownButton} onPress={() => setFishMenuOpen(true)}>
                  <Text style={[styles.dropdownButtonText, !newFishType && styles.dropdownPlaceholder]}>
                    {newFishType || 'Select fish type'}
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={22} color={colors.onSurfaceVariant} />
                </Pressable>
              </View>
              <View style={styles.modalActions}>
                <Pressable style={styles.modalSecondaryButton} onPress={() => setShowAddForm(false)}>
                  <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.modalPrimaryButton} onPress={addSchedule}>
                  <Text style={styles.modalPrimaryButtonText}>Save</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

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
                        style={[styles.dropdownOption, scheduleHour === option && styles.dropdownOptionSelected]}
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
                        style={[styles.dropdownOption, scheduleMinute === option && styles.dropdownOptionSelected]}
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
                        style={[styles.dropdownOption, schedulePeriod === option && styles.dropdownOptionSelected]}
                        onPress={() => setSchedulePeriod(option)}
                      >
                        <Text style={styles.dropdownOptionText}>{option}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </View>
              <Pressable style={styles.pickerDoneButton} onPress={() => setScheduleTimeMenuOpen(false)}>
                <Text style={styles.pickerDoneButtonText}>Done</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>

        <Modal transparent visible={fishMenuOpen} animationType="fade" onRequestClose={() => setFishMenuOpen(false)}>
          <Pressable style={styles.dropdownOverlay} onPress={() => setFishMenuOpen(false)}>
            <Pressable style={styles.fishPickerSheet} onPress={() => {}}>
              <Text style={styles.timePickerTitle}>Select fish type</Text>
              <View style={styles.fishOptionList}>
                {['Tilapia', 'Catfish (Hito)'].map((option) => (
                  <Pressable
                    key={option}
                    style={[styles.fishOption, newFishType === option && styles.dropdownOptionSelected]}
                    onPress={() => setNewFishType(option)}
                  >
                    <Text style={styles.dropdownOptionText}>{option}</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable style={styles.pickerDoneButton} onPress={() => setFishMenuOpen(false)}>
                <Text style={styles.pickerDoneButtonText}>Done</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 124, gap: 16 },
  topBar: {
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
  topBarRow: {
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
  topBarBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
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
  bannerTitle: { color: colors.onPrimary, fontSize: 24, fontWeight: '800', letterSpacing: -0.2 },
  bannerSubtitle: { marginTop: 4, color: 'rgba(255,255,255,0.86)', fontSize: 13, fontWeight: '500' },
  floatingAddButton: {
    position: 'absolute',
    right: 16,
    bottom: 84,
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 18,
    padding: 18,
    gap: 10,
  },
  modalTitle: {
    color: colors.onSurface,
    fontSize: 18,
    fontWeight: '800',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.onSurface,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  modalSecondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerHigh,
  },
  modalSecondaryButtonText: {
    color: colors.onSurface,
    fontWeight: '700',
  },
  modalPrimaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  modalPrimaryButtonText: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    color: colors.onSurface,
    fontSize: 12,
    fontWeight: '600',
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
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    padding: 24,
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
  fishPickerSheet: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 16,
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
  fishOptionList: {
    gap: 8,
    marginBottom: 12,
  },
  fishOption: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.surfaceContainerLow,
  },
  pickerDoneButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerDoneButtonText: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  list: { gap: 12 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 6,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.surfaceContainer,
  },
  emptyTitle: {
    color: colors.onSurface,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.onSurfaceVariant,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  card: { backgroundColor: colors.surfaceContainerLowest, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.surfaceContainer },
  cardInactive: { opacity: 0.72, backgroundColor: 'rgba(243, 244, 245, 0.9)' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  scheduleIcon: { width: 48, height: 48, borderRadius: 999, backgroundColor: 'rgba(216, 226, 255, 0.7)', alignItems: 'center', justifyContent: 'center' },
  scheduleIconInactive: { backgroundColor: 'rgba(193, 198, 214, 0.24)' },
  cardTime: { color: colors.onSurface, fontSize: 24, fontWeight: '800', letterSpacing: -0.2 },
  cardMeta: { marginTop: 2, color: colors.onSurfaceVariant, fontSize: 12, fontWeight: '600' },
  switchHitSlop: { paddingVertical: 6 },
  switchTrack: { width: 46, height: 26, borderRadius: 999, backgroundColor: colors.outlineVariant, padding: 2, justifyContent: 'center' },
  switchTrackActive: { backgroundColor: colors.primary },
  switchThumb: { width: 22, height: 22, borderRadius: 999, backgroundColor: colors.surfaceContainerLowest },
  switchThumbActive: { alignSelf: 'flex-end' },
  cardBottomRow: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  amountLabel: { color: colors.onSurfaceVariant, fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  amountValue: { marginTop: 2, color: colors.onSurface, fontSize: 18, fontWeight: '700' },
  deleteButton: { padding: 6, borderRadius: 10 },
  insightsCard: { marginTop: 8, backgroundColor: colors.surfaceContainerHigh, borderRadius: 22, padding: 18 },
  insightsTitle: { color: colors.onSurface, fontSize: 18, fontWeight: '800', marginBottom: 14 },
  insightsGrid: { flexDirection: 'row', gap: 12 },
  insightBox: { flex: 1, backgroundColor: colors.surfaceContainerLowest, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  insightLabel: { color: colors.onSurfaceVariant, fontSize: 12, fontWeight: '600' },
  insightValue: { color: colors.primary, fontSize: 22, fontWeight: '800' },
  insightValueAlt: { color: colors.tertiary },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
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
    top: -1,
    right: -2,
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.error,
  },
});
