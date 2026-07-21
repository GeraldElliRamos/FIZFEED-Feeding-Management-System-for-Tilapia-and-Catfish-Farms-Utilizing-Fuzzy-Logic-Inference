import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import designTokens from '@/constants/design-tokens';

const { colors: tokenColors, fontSize } = designTokens;

const colors = {
  primaryContainer: tokenColors['primary-container'],
  primary: tokenColors.primary,
  onPrimary: tokenColors['on-primary'],
  secondary: tokenColors.secondary,
  tertiary: tokenColors.tertiary,
  background: tokenColors.background,
  surface: tokenColors.surface,
  surfaceContainerLowest: tokenColors['surface-container-lowest'],
  surfaceContainerLow: tokenColors['surface-container-low'],
  surfaceContainerHigh: tokenColors['surface-container-high'],
  surfaceContainerHighest: tokenColors['surface-container-highest'],
  onSurface: tokenColors['on-surface'],
  onSurfaceVariant: tokenColors['on-surface-variant'],
  outline: tokenColors.outline,
  outlineVariant: tokenColors['outline-variant'],
  error: tokenColors.error,
  errorContainer: tokenColors['error-container'],
  tertiaryContainer: tokenColors['tertiary-container'],
  secondaryContainer: tokenColors['secondary-container'],
};

type Alert = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  bgColor: string;
  isRead: boolean;
  type: 'error' | 'warning' | 'info' | 'success';
};

type NavButtonProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  active?: boolean;
  onPress?: () => void;
};

const initialAlerts: Alert[] = [
  {
    id: '1',
    title: 'Low Feed Supply',
    message: 'Pond A device has only 25% feed remaining. Consider refilling soon.',
    timestamp: '10 mins ago',
    icon: 'warning',
    iconColor: colors.error,
    bgColor: colors.errorContainer,
    isRead: false,
    type: 'error',
  },
  {
    id: '2',
    title: 'Device Offline',
    message: 'FeedSense Device 3 (Pond C) has been offline for 2 hours.',
    timestamp: '2 hours ago',
    icon: 'wifi-off',
    iconColor: colors.error,
    bgColor: colors.errorContainer,
    isRead: false,
    type: 'error',
  },
  {
    id: '3',
    title: 'AI Recommendation Available',
    message: 'New feeding optimization suggestion for Pond A - Tilapia.',
    timestamp: '3 hours ago',
    icon: 'smart-toy',
    iconColor: colors.primary,
    bgColor: colors.primaryContainer,
    isRead: false,
    type: 'info',
  },
  {
    id: '4',
    title: 'Feeding Completed',
    message: 'Scheduled feeding at 12:00 PM completed successfully. 3.0 kg dispensed.',
    timestamp: '5 hours ago',
    icon: 'check-circle',
    iconColor: colors.tertiary,
    bgColor: colors.tertiaryContainer,
    isRead: true,
    type: 'success',
  },
  {
    id: '5',
    title: 'High Temperature Alert',
    message: 'Water temperature in Pond A reached 29.5°C. Consider adjusting feed amount.',
    timestamp: '6 hours ago',
    icon: 'thermostat',
    iconColor: colors.secondary,
    bgColor: colors.secondaryContainer,
    isRead: true,
    type: 'warning',
  },
];

function NavButton({ icon, label, active, onPress }: NavButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.navButton, pressed && styles.navButtonPressed]}
    >
      <MaterialIcons name={icon} size={24} color={active ? colors.primary : colors.onSurfaceVariant} />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function AlertCard({
  alert,
  onDismiss,
}: {
  alert: Alert;
  onDismiss: (id: string) => void;
}) {
  return (
    <View
      style={[
        styles.alertCard,
        alert.isRead && styles.alertCardRead,
      ]}
    >
      <View style={[styles.alertIconContainer, { backgroundColor: `${alert.bgColor}33` }]}>
        <MaterialIcons name={alert.icon} size={24} color={alert.iconColor} />
      </View>

      <View style={styles.alertContent}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Pressable
            onPress={() => onDismiss(alert.id)}
            style={({ pressed }) => [
              styles.dismissButton,
              pressed && styles.dismissButtonPressed,
            ]}
          >
            <MaterialIcons name="close" size={20} color={colors.outline} />
          </Pressable>
        </View>

        <Text style={styles.alertMessage}>{alert.message}</Text>

        <View style={styles.alertFooter}>
          <Text style={styles.alertTime}>{alert.timestamp}</Text>
          {!alert.isRead && <View style={styles.activeIndicator} />}
        </View>
      </View>
    </View>
  );
}

export default function AlertsScreen() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={['#1a73e8', '#006874']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
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
                <Text style={styles.pageBannerTitle}>Notifications</Text>
                <Text style={styles.pageBannerSubtitle}>
                  {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
                </Text>
              </View>
              {unreadCount > 0 && (
                <Pressable
                  onPress={handleMarkAllRead}
                  style={({ pressed }) => [
                    styles.markAllButton,
                    pressed && styles.markAllButtonPressed,
                  ]}
                >
                  <Text style={styles.markAllButtonText}>Mark all read</Text>
                </Pressable>
              )}
            </View>
          </LinearGradient>

          <View style={styles.mainContent}>
            {alerts.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons
                  name="notifications-none"
                  size={48}
                  color={colors.outline}
                />
                <Text style={styles.emptyStateText}>No alerts</Text>
                <Text style={styles.emptyStateSubtext}>
                  All caught up! You'll see notifications here.
                </Text>
              </View>
            ) : (
              <View style={styles.alertsList}>
                {alerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onDismiss={handleDismiss}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <NavButton icon="home" label="Home" onPress={() => router.push('/')} />
          <NavButton icon="calendar-month" label="Schedule" onPress={() => router.push('/schedule')} />
          <NavButton icon="bar-chart" label="Analytics" onPress={() => router.push('/analytics')} />
          <NavButton icon="auto-awesome" label="Insights" onPress={() => router.push('/insights')} />
          <NavButton icon="notifications" label="Alerts" active />
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
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBlock: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onPrimary,
    letterSpacing: 0.5,
  },
  menuButton: {
    padding: 8,
    borderRadius: 24,
  },
  headerBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pageBannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onPrimary,
    marginBottom: 4,
  },
  pageBannerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onPrimary,
    opacity: 0.8,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  markAllButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  markAllButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  alertsList: {
    gap: 12,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  alertCardRead: {
    opacity: 0.7,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
    flex: 1,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
  dismissButtonPressed: {
    opacity: 0.6,
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTime: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.outline,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.onSurfaceVariant,
    textAlign: 'center',
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
});
