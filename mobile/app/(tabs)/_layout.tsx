import { Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import designTokens from '@/constants/design-tokens';
import { useUserProfile } from '../../hooks/useFirestore';

const { colors, fontSize, fontFamily } = designTokens;

type Role = 'admin' | 'farm_owner' | 'farm_staff' | 'viewer';

const tabAccess: Record<string, Role[]> = {
  index: ['admin', 'farm_owner', 'farm_staff', 'viewer'],
  schedule: ['admin', 'farm_owner', 'farm_staff'],
  analytics: ['admin', 'farm_owner', 'farm_staff', 'viewer'],
  alerts: ['admin', 'farm_owner', 'farm_staff', 'viewer'],
  profile: ['admin', 'farm_owner', 'farm_staff', 'viewer'],
};

export default function TabLayout() {
  const { profile, loading } = useUserProfile();
  const role = (String(profile?.role || 'farm_owner') as Role);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors["on-surface-variant"],
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'none',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          // Hide default border top
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: fontSize["label-sm"][0],
          fontWeight: fontFamily["label-sm"][0].fontWeight,
          fontFamily: fontFamily["label-sm"][0],
        },
        tabBarIconStyle: {
          // marginBottom: -3,
        },
      }}>
      {tabAccess.index.includes(role) && <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} /> }} />}
      {tabAccess.schedule.includes(role) && <Tabs.Screen name="schedule" options={{ title: 'Schedule', tabBarIcon: ({ color }) => <MaterialIcons name="calendar-month" size={24} color={color} /> }} />}
      {tabAccess.analytics.includes(role) && <Tabs.Screen name="analytics" options={{ title: 'Analytics', tabBarIcon: ({ color }) => <MaterialIcons name="bar-chart" size={24} color={color} /> }} />}
      {tabAccess.alerts.includes(role) && <Tabs.Screen name="alerts" options={{ title: 'Alerts', tabBarIcon: ({ color }) => <MaterialIcons name="notifications" size={24} color={color} /> }} />}
      {tabAccess.profile.includes(role) && <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} /> }} />}
    </Tabs>
  );
}
