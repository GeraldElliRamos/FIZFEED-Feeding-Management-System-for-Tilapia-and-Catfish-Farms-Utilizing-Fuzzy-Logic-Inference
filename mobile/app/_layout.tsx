import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useFirestore';

type Role = 'admin' | 'farm_owner' | 'farm_staff' | 'viewer';

const tabAccess: Record<string, Role[]> = {
  index: ['admin', 'farm_owner', 'farm_staff', 'viewer'],
  schedule: ['admin', 'farm_owner', 'farm_staff'],
  analytics: ['admin', 'farm_owner', 'farm_staff', 'viewer'],
  alerts: ['admin', 'farm_owner', 'farm_staff', 'viewer'],
  profile: ['admin', 'farm_owner', 'farm_staff', 'viewer'],
};

function getDefaultTabPath(role: Role) {
  if (role === 'viewer') return '/(tabs)/index';
  return '/(tabs)/index';
}

/* ── Auth Guard: redirects unauthenticated users away from protected screens ── */
function AuthGuard() {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const segments = useSegments();
  const router = useRouter();
  const role = (String(profile?.role || 'farm_owner') as Role);

  useEffect(() => {
    if (loading || profileLoading) return; // Wait until Firebase resolves auth state

    const inTabsGroup = segments[0] === '(tabs)';
    const tabName = segments[1] || 'index';
    const canAccessTab = tabAccess[tabName]?.includes(role) ?? true;

    if (!user && (inTabsGroup || segments[0] === 'index' || !segments[0])) {
      // Not logged in → redirect directly to login
      router.replace('/login');
    } else if (user && (segments[0] === 'login' || segments[0] === 'signup' || segments[0] === 'index' || !segments[0])) {
      // Already logged in → go to main app dashboard tabs
      router.replace('/(tabs)');
    } else if (user && inTabsGroup && !canAccessTab) {
      router.replace(getDefaultTabPath(role));
    }
  }, [user, loading, profileLoading, segments, router, role]);

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
