import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const colors = {
  primary: '#005bbf',
  secondary: '#006874',
  surface: '#f8f9fa',
  surfaceAlt: '#ffffff',
  onSurface: '#191c1d',
  onSurfaceVariant: '#414754',
  onPrimary: '#ffffff',
};

const faqs = [
  { q: 'How do I add a feeding schedule?', a: 'Open Schedule, tap Add, choose the time, pond, and fish type, then save.' },
  { q: 'How do I update my profile?', a: 'Go to Profile, tap Edit Profile, change your details, and save changes.' },
  { q: 'Why is a pond offline?', a: 'Offline status usually means the sensor or connection is unavailable.' },
  { q: 'How do I contact support?', a: 'Use Settings or email support@fizfeed.com for help.' },
];

export default function FAQScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <LinearGradient colors={['#1a73e8', '#006874']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable style={styles.iconButton} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={22} color={colors.onPrimary} />
            </Pressable>
            <Text style={styles.headerTitle}>FAQ</Text>
            <View style={{ width: 38 }} />
          </View>
          <Text style={styles.headerSubtitle}>Common questions and quick answers</Text>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {faqs.map((item) => (
            <View key={item.q} style={styles.card}>
              <Text style={styles.question}>{item.q}</Text>
              <Text style={styles.answer}>{item.a}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  screen: { flex: 1, backgroundColor: colors.surface },
  header: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: { color: colors.onPrimary, fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: 'rgba(255,255,255,0.78)', fontSize: 12, marginTop: 6 },
  content: { padding: 16, gap: 12 },
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  question: { color: colors.onSurface, fontSize: 15, fontWeight: '800' },
  answer: { color: colors.onSurfaceVariant, fontSize: 13, lineHeight: 19 },
});
