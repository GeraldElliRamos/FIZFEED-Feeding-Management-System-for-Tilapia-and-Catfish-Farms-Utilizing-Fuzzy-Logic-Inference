import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack, useRootNavigationState, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useFirestore';

type Role = 'admin' | 'farm_owner' | 'farm_staff' | 'viewer';

const tabAccess: Record<string, Role[]> = {
  index: ['admin', 'farm_owner', 'farm_staff', 'viewer'],
  dashboard: ['admin', 'farm_owner', 'farm_staff', 'viewer'],
  schedule: ['admin', 'farm_owner', 'farm_staff'],
  analytics: ['admin', 'farm_owner', 'farm_staff', 'viewer'],
  insights: ['admin', 'farm_owner', 'farm_staff', 'viewer'],
  alerts: ['admin', 'farm_owner', 'farm_staff', 'viewer'],
  profile: ['admin', 'farm_owner', 'farm_staff', 'viewer'],
};

function getDefaultTabPath(_role: Role | undefined) {
  return '/(tabs)' as const;
}

/* ── Auth Guard: redirects unauthenticated users away from protected screens ── */
function AuthGuard() {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const role = profile?.role as Role | undefined;

  if (!navigationState?.key || loading) return null;

  const isAuthScreen = segments[0] === 'login' || segments[0] === 'signup';

  // Check authentication first. A signed-out user must never wait on Firestore.
  if (!user) {
    return isAuthScreen ? null : <Redirect href="/login" />;
  }

  if (isAuthScreen || !segments[0]) {
    return <Redirect href="/(tabs)" />;
  }

  if (profileLoading) return null;

  const inTabsGroup = segments[0] === '(tabs)';
  const tabName = segments[1] || 'index';
  const canAccessTab = role ? (tabAccess[tabName]?.includes(role) ?? true) : false;

  if (inTabsGroup && !canAccessTab) {
    return <Redirect href={getDefaultTabPath(role)} />;
  }

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthGuard />
        <Stack>
          {/* index.tsx = splash screen, no header, no transition animation */}
          <Stack.Screen name="index" options={{ headerShown: false, animation: 'none' }} />
          <Stack.Screen name="login" options={{ headerShown: false, animation: 'none' }} />
          <Stack.Screen name="signup" options={{ headerShown: false, animation: 'none' }} />
          {/* Main tabs */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </AuthProvider>
  );
}
