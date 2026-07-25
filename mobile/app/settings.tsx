import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const colors = {
  primary: '#005bbf',
  primaryContainer: '#1a73e8',
  secondary: '#006874',
  tertiary: '#006b1b',
  surface: '#f8f9fa',
  surfaceAlt: '#ffffff',
  surfaceLow: '#f3f4f5',
  onSurface: '#191c1d',
  onSurfaceVariant: '#414754',
  outlineVariant: '#c1c6d6',
  onPrimary: '#ffffff',
};

export default function SettingsScreen() {
  const router = useRouter();
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <LinearGradient colors={['#1a73e8', '#006874']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable style={styles.iconButton} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={22} color={colors.onPrimary} />
            </Pressable>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={{ width: 38 }} />
          </View>
          <Text style={styles.headerSubtitle}>Adjust app preferences and behavior</Text>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>General</Text>
            <View style={styles.row}>
              <View>
                <Text style={styles.rowTitle}>Automatic Sync</Text>
                <Text style={styles.rowDesc}>Keep feeds and schedule data updated in the background.</Text>
              </View>
              <Switch value={autoSyncEnabled} onValueChange={setAutoSyncEnabled} />
            </View>
            <View style={styles.row}>
              <View>
                <Text style={styles.rowTitle}>Sound Alerts</Text>
                <Text style={styles.rowDesc}>Play a sound for important notifications.</Text>
              </View>
              <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Support</Text>
            <Pressable style={styles.linkRow} onPress={() => router.push('/faq')}>
              <Text style={styles.linkLabel}>Open FAQ</Text>
              <MaterialIcons name="chevron-right" size={20} color={colors.onSurfaceVariant} />
            </Pressable>
            <Pressable
              style={styles.linkRow}
              onPress={() => Alert.alert('Contact Support', 'Email support@fizfeed.com for help with sensors, schedules, or account access.')}
            >
              <Text style={styles.linkLabel}>Contact Support</Text>
              <MaterialIcons name="chevron-right" size={20} color={colors.onSurfaceVariant} />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  screen: { flex: 1, backgroundColor: colors.surface },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: {
    color: colors.onPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    marginTop: 6,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    color: colors.onSurface,
    fontSize: 16,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowTitle: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: '700',
  },
  rowDesc: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    marginTop: 4,
    maxWidth: 260,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  linkLabel: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
