import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserProfile, usePonds } from '../../hooks/useFirestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const colors = {
  primary: '#005bbf',
  primaryContainer: '#1a73e8',
  secondary: '#006874',
  tertiary: '#006b1b',
  surface: '#f8f9fa',
  surfaceAlt: '#ffffff',
  surfaceLow: '#f3f4f5',
  surfaceHigh: '#e7e8e9',
  surfaceHighest: '#e1e3e4',
  surfaceDim: '#d9dadb',
  onSurface: '#191c1d',
  onSurfaceVariant: '#414754',
  outline: '#727785',
  outlineVariant: '#c1c6d6',
  error: '#ba1a1a',
  onPrimary: '#ffffff',
  onSecondary: '#ffffff',
  onTertiary: '#ffffff',
  textLabel: '#191c1d',
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

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { profile, loading } = useUserProfile();
  const { ponds, loading: pondsLoading } = usePonds();
  const currentDate = new Date();
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);

  // Edit Profile Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editFarmName, setEditFarmName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Edit Single Field Modal
  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [fieldModalLabel, setFieldModalLabel] = useState('');
  const [fieldModalKey, setFieldModalKey] = useState('');
  const [fieldModalValue, setFieldModalValue] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const daysActive = user?.metadata?.creationTime
    ? Math.max(1, Math.floor((currentDate.getTime() - new Date(user.metadata.creationTime).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  const getUserRef = () => {
    if (!user?.uid) {
      throw new Error('Missing authenticated user.');
    }

    return doc(db, 'users', user.uid);
  };

  if (loading || pondsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      await logout();
      router.replace('/login');
    } catch (err) {
      console.error('Sign out error:', err);
      Alert.alert('Sign Out Failed', 'We could not sign you out. Please try again.');
      setIsSigningOut(false);
    }
  };

  const openEditProfile = () => {
    setEditName(profile?.displayName || '');
    setEditFarmName(profile?.farmName || '');
    setEditPhone(profile?.phone || '');
    setEditLocation(profile?.location || '');
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    setIsSaving(true);
    try {
      const userRef = getUserRef();
      await updateDoc(userRef, {
        displayName: editName.trim(),
        farmName: editFarmName.trim(),
        phone: editPhone.trim(),
        location: editLocation.trim(),
      });
      Alert.alert('Success', 'Profile updated successfully!');
      setEditModalVisible(false);
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const openFieldEdit = (label: string, key: string, currentValue: string) => {
    setFieldModalLabel(label);
    setFieldModalKey(key);
    setFieldModalValue(currentValue);
    setFieldModalVisible(true);
  };

  const handleSaveField = async () => {
    if (!user?.uid) return;
    setIsSaving(true);
    try {
      const userRef = getUserRef();
      await updateDoc(userRef, { [fieldModalKey]: fieldModalValue.trim() });
      Alert.alert('Updated', `${fieldModalLabel} has been updated.`);
      setFieldModalVisible(false);
    } catch (err) {
      console.error('Field update error:', err);
      Alert.alert('Error', `Failed to update ${fieldModalLabel}.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCameraPress = () => {
    Alert.alert('Change Profile Photo', 'Choose an option:', [
      { text: 'Take Photo', onPress: () => Alert.alert('Camera', 'Camera integration requires expo-image-picker to be installed.') },
      { text: 'Choose from Gallery', onPress: () => Alert.alert('Gallery', 'Gallery integration requires expo-image-picker to be installed.') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleNotificationToggle = () => {
    const newVal = !pushNotificationsEnabled;
    setPushNotificationsEnabled(newVal);
    Alert.alert(
      newVal ? 'Notifications Enabled' : 'Notifications Disabled',
      newVal
        ? 'You will receive feeding alerts and sensor notifications.'
        : 'You will no longer receive push notifications.'
    );
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
            <Pressable style={styles.menuButton} onPress={() => router.replace('/(tabs)')}>
              <MaterialIcons name="menu" size={22} color={colors.onPrimary} />
            </Pressable>
          </View>
          <View style={styles.topBarBottomRow}>
            <View>
              <Text style={styles.bannerTitle}>Profile</Text>
              <Text style={styles.bannerSubtitle}>Manage your account information</Text>
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
          <View style={styles.section}>
            <View style={styles.profileCard}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarCircle}>
                  <MaterialIcons name="person" size={48} color={colors.primary} />
                </View>
                <Pressable style={styles.cameraButton} onPress={handleCameraPress}>
                  <MaterialIcons name="photo-camera" size={18} color={colors.onSecondary} />
                </Pressable>
              </View>
              <Text style={styles.profileName}>{profile?.displayName || "Juan Dela Cruz"}</Text>
              <Text style={styles.profileSubtitle}>Farm Administrator</Text>
              <Pressable style={styles.editButton} onPress={openEditProfile}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
                <MaterialIcons name="edit" size={16} color={colors.onPrimary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Farm Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: colors.primary }]}>{ponds.length}</Text>
                <Text style={styles.statLabel}>Ponds</Text>
              </View>
              <View style={[styles.statCard, styles.statCardHighlighted]}>
                <Text style={[styles.statValue, { color: colors.secondary }]}>{ponds.length}</Text>
                <Text style={styles.statLabel}>Devices</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: colors.tertiary }]}>{daysActive}</Text>
                <Text style={styles.statLabel}>Days</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <View style={styles.listCard}>
              <Pressable style={styles.listRow} onPress={() => openFieldEdit('Farm Name', 'farmName', profile?.farmName || '')}>
                <View style={[styles.iconBox, { backgroundColor: '#d8e2ff' }]}>
                  <MaterialIcons name="corporate-fare" size={20} color={colors.primary} />
                </View>
                <View style={styles.listTextGroup}>
                  <Text style={styles.listLabel}>Farm Name</Text>
                  <Text style={styles.listValue}>{profile?.farmName || "San Miguel Fish Farm"}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
              </Pressable>
              <View style={styles.divider} />
              <Pressable style={styles.listRow} onPress={() => Alert.alert('Email', `Your email is ${profile?.email || user?.email || 'N/A'}.\n\nEmail changes require re-authentication for security.`)}>
                <View style={[styles.iconBox, { backgroundColor: '#e6f4f1' }]}>
                  <MaterialIcons name="mail" size={20} color={colors.tertiary} />
                </View>
                <View style={styles.listTextGroup}>
                  <Text style={styles.listLabel}>Email</Text>
                  <Text style={styles.listValue}>{profile?.email || "juan.delacruz@email.com"}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
              </Pressable>
              <View style={styles.divider} />
              <Pressable style={styles.listRow} onPress={() => openFieldEdit('Phone', 'phone', profile?.phone || '')}>
                <View style={[styles.iconBox, { backgroundColor: '#adc7ff' }]}>
                  <MaterialIcons name="call" size={20} color={colors.secondary} />
                </View>
                <View style={styles.listTextGroup}>
                  <Text style={styles.listLabel}>Phone</Text>
                  <Text style={styles.listValue}>{profile?.phone || "+63 917 123 4567"}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
              </Pressable>
              <View style={styles.divider} />
              <Pressable style={styles.listRow} onPress={() => openFieldEdit('Location', 'location', profile?.location || '')}>
                <View style={[styles.iconBox, { backgroundColor: '#fff1d6' }]}>
                  <MaterialIcons name="location-on" size={20} color="#b45309" />
                </View>
                <View style={styles.listTextGroup}>
                  <Text style={styles.listLabel}>Location</Text>
                  <Text style={styles.listValue}>{profile?.location || "Bulacan, Philippines"}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            <View style={styles.listCard}>
              <Pressable style={styles.listRow} onPress={handleNotificationToggle}>
                <View style={styles.settingRowLeft}>
                  <MaterialIcons name="notifications" size={20} color={colors.onSurfaceVariant} />
                  <Text style={styles.listValue}>Push Notifications</Text>
                </View>
                <View style={[styles.toggleTrack, pushNotificationsEnabled && styles.toggleTrackActive]}>
                  <View style={[styles.toggleThumb, pushNotificationsEnabled && styles.toggleThumbActive]} />
                </View>
              </Pressable>
              <View style={styles.divider} />
              <Pressable style={styles.listRow} onPress={() => router.push('/settings')}>
                <View style={styles.settingRowLeft}>
                  <MaterialIcons name="settings" size={20} color={colors.onSurfaceVariant} />
                  <Text style={styles.listValue}>Settings</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
              </Pressable>
              <View style={styles.divider} />
              <Pressable style={styles.listRow} onPress={() => router.push('/faq')}>
                <View style={styles.settingRowLeft}>
                  <MaterialIcons name="help-outline" size={20} color={colors.onSurfaceVariant} />
                  <Text style={styles.listValue}>FAQ</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
              </Pressable>
              <View style={styles.divider} />
              <Pressable
                style={({ pressed }) => [styles.listRow, (pressed || isSigningOut) && styles.listRowDisabled]}
                onPress={handleSignOut}
                disabled={isSigningOut}
                accessibilityRole="button"
                accessibilityLabel="Sign out"
              >
                <View style={styles.settingRowLeft}>
                  <MaterialIcons name="logout" size={20} color={colors.error} />
                  <Text style={[styles.listValue, { color: colors.error }]}>
                    {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                  </Text>
                </View>
                {isSigningOut ? <ActivityIndicator size="small" color={colors.error} /> : <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />}
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>FIZFEED Ecosystem v2.4.0</Text>
          </View>
        </ScrollView>

        {/* ── Edit Profile Modal ─────────────────────────────────── */}
        <Modal visible={editModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <Pressable onPress={() => setEditModalVisible(false)} hitSlop={12}>
                  <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Full Name</Text>
                  <TextInput style={styles.modalInput} value={editName} onChangeText={setEditName} placeholder="Full Name" placeholderTextColor="#94a3b8" />
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Farm Name</Text>
                  <TextInput style={styles.modalInput} value={editFarmName} onChangeText={setEditFarmName} placeholder="Farm Name" placeholderTextColor="#94a3b8" />
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Phone</Text>
                  <TextInput style={styles.modalInput} value={editPhone} onChangeText={setEditPhone} placeholder="+63 917 123 4567" keyboardType="phone-pad" placeholderTextColor="#94a3b8" />
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Location / Address</Text>
                  <TextInput style={styles.modalInput} value={editLocation} onChangeText={setEditLocation} placeholder="City, Province" placeholderTextColor="#94a3b8" />
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <Pressable style={styles.modalCancelBtn} onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable style={[styles.modalSaveBtn, isSaving && { opacity: 0.6 }]} onPress={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.modalSaveBtnText}>Save Changes</Text>}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* ── Edit Single Field Modal ────────────────────────────── */}
        <Modal visible={fieldModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit {fieldModalLabel}</Text>
                <Pressable onPress={() => setFieldModalVisible(false)} hitSlop={12}>
                  <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
                </Pressable>
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>{fieldModalLabel}</Text>
                <TextInput style={styles.modalInput} value={fieldModalValue} onChangeText={setFieldModalValue} placeholder={`Enter ${fieldModalLabel.toLowerCase()}`} placeholderTextColor="#94a3b8" autoFocus />
              </View>
              <View style={styles.modalActions}>
                <Pressable style={styles.modalCancelBtn} onPress={() => setFieldModalVisible(false)}>
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable style={[styles.modalSaveBtn, isSaving && { opacity: 0.6 }]} onPress={handleSaveField} disabled={isSaving}>
                  {isSaving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.modalSaveBtnText}>Save</Text>}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.bottomNav}>
          <BottomNavItem icon="home" label="Home" onPress={() => router.replace('/(tabs)')} />
          <BottomNavItem icon="calendar-month" label="Schedule" onPress={() => router.replace('/schedule')} />
          <BottomNavItem icon="bar-chart" label="Analytics" onPress={() => router.replace('/analytics')} />
          <BottomNavItem icon="auto-awesome" label="Insights" onPress={() => router.replace('/insights')} />
          <BottomNavItem icon="notifications" label="Alerts" onPress={() => router.replace('/alerts')} />
          <BottomNavItem icon="person" label="Profile" active />
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 124,
    gap: 16,
    backgroundColor: colors.background,
  },
  topBar: {
    width: '100%',
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
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
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
  bannerTitle: {
    color: colors.onPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  bannerSubtitle: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.86)',
    fontSize: 13,
    fontWeight: '500',
  },
  section: {
    width: '100%',
    marginTop: 0,
  },
  profileCard: {
    backgroundColor: '#ffffffee',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarWrapper: {
    marginBottom: 16,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#d8e2ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  cameraButton: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 6,
  },
  profileSubtitle: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.primary,
    gap: 8,
  },
  editButtonText: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 12,
    paddingLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statCardHighlighted: {
    borderBottomWidth: 4,
    borderBottomColor: colors.secondary,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  listCard: {
    borderRadius: 24,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  listRowDisabled: {
    opacity: 0.6,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listTextGroup: {
    flex: 1,
    marginLeft: 12,
  },
  listLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.outline,
  },
  listValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.onSurface,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(193,198,214,0.2)',
    marginHorizontal: 16,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleTrack: {
    width: 44,
    height: 22,
    borderRadius: 12,
    backgroundColor: colors.outlineVariant,
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackActive: {
    backgroundColor: colors.primary,
  },
  toggleTrackOff: {
    backgroundColor: colors.outlineVariant,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.surfaceAlt,
    transform: [{ translateX: 0 }],
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    paddingBottom: 28,
  },
  footerText: {
    color: colors.outline,
    fontSize: 12,
  },
  // ── Modal styles ──────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onSurface,
  },
  modalField: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.outline,
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.onSurface,
    backgroundColor: colors.surfaceLow,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: colors.surfaceHigh,
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  modalSaveBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  modalSaveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  // ── Bottom nav ────────────────────────────────────────────
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
