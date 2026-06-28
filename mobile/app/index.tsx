import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const LOGO_SIZE = width * 0.48;
const BAR_WIDTH = width - 64; // matches px-8 on both sides

const MILESTONES = [
  { p: 15, t: 'Connecting to pond sensors...' },
  { p: 45, t: 'Syncing environmental data...' },
  { p: 75, t: 'Optimizing feed schedules...' },
  { p: 100, t: 'System Ready' },
];

export default function SplashScreen() {
  const router = useRouter();

  // Logo float (loops forever)
  const logoFloat = useRef(new Animated.Value(0)).current;

  // Ambient blob pulse
  const blob1Opacity = useRef(new Animated.Value(0.35)).current;
  const blob2Opacity = useRef(new Animated.Value(0.2)).current;

  // Fade-up for progress section
  const progressOpacity = useRef(new Animated.Value(0)).current;
  const progressTranslateY = useRef(new Animated.Value(20)).current;

  // Fade-up for footer
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerTranslateY = useRef(new Animated.Value(20)).current;

  // Progress bar animated width
  const barWidth = useRef(new Animated.Value(0)).current;

  const [statusText, setStatusText] = useState(MILESTONES[0].t);
  const [percent, setPercent] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    // ── Logo float loop ──────────────────────────────────────────
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -12,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoFloat, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // ── Ambient blob pulse loops ─────────────────────────────────
    Animated.loop(
      Animated.sequence([
        Animated.timing(blob1Opacity, { toValue: 0.55, duration: 2000, useNativeDriver: true }),
        Animated.timing(blob1Opacity, { toValue: 0.25, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(2000),
        Animated.timing(blob2Opacity, { toValue: 0.45, duration: 2000, useNativeDriver: true }),
        Animated.timing(blob2Opacity, { toValue: 0.15, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // ── Progress section fade-up (delay: 600ms) ──────────────────
    timers.push(setTimeout(() => {
      Animated.parallel([
        Animated.timing(progressOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(progressTranslateY, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]).start();
    }, 600));

    // ── Footer fade-up (delay: 900ms) ────────────────────────────
    timers.push(setTimeout(() => {
      Animated.parallel([
        Animated.timing(footerOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(footerTranslateY, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]).start();
    }, 900));

    // ── Progress bar fill (starts at 500ms, lasts 3s) ────────────
    timers.push(setTimeout(() => {
      Animated.timing(barWidth, {
        toValue: BAR_WIDTH,
        duration: 3000,
        useNativeDriver: false,
      }).start();
    }, 500));

    // ── Milestone status text updates ────────────────────────────
    MILESTONES.forEach((milestone) => {
      const delay = 500 + (milestone.p / 100) * 3000;
      timers.push(setTimeout(() => {
        setStatusText(milestone.t);
        setPercent(milestone.p);
        if (milestone.p >= 100) setIsReady(true);
      }, delay));
    });

    // ── Navigate after loading finishes ─────────────────────────
    const navTimer = setTimeout(() => {
      router.replace('/login');
    }, 4800);

    timers.push(navTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [barWidth, blob1Opacity, blob2Opacity, footerOpacity, footerTranslateY, logoFloat, progressOpacity, progressTranslateY, router]);

  return (
    <View style={styles.container}>
      {/* ── Ambient Background Blobs ── */}
      <Animated.View style={[styles.blob1, { opacity: blob1Opacity }]} />
      <Animated.View style={[styles.blob2, { opacity: blob2Opacity }]} />

      {/* ── Floating Logo (centered) ── */}
      <Animated.View
        style={[styles.logoWrap, { transform: [{ translateY: logoFloat }] }]}
      >
        <Image
          source={require('../assets/images/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ── Progress Section (pinned near bottom) ── */}
      <Animated.View
        style={[
          styles.progressSection,
          { opacity: progressOpacity, transform: [{ translateY: progressTranslateY }] },
        ]}
      >
        {/* Bar track */}
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidth }]} />
        </View>

        {/* Status row */}
        <View style={styles.statusRow}>
          <View style={styles.statusLeft}>
            <MaterialIcons
              name="check-circle"
              size={14}
              color="#005BBF"
              style={isReady ? styles.iconReady : undefined}
            />
            <Text style={[styles.statusText, isReady && styles.statusTextReady]}>
              {statusText}
            </Text>
          </View>
          <Text style={styles.percentText}>{percent}%</Text>
        </View>
      </Animated.View>

      {/* ── Footer ── */}
      <Animated.View
        style={[
          styles.footer,
          { opacity: footerOpacity, transform: [{ translateY: footerTranslateY }] },
        ]}
      >
        <Text style={styles.footerText}>
          Powered by Advanced Environmental Bio-metrics
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // ── Ambient blobs ──────────────────────────────────────────────
  blob1: {
    position: 'absolute',
    top: '5%',
    left: '-25%',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#7fedfe', // secondary-container
  },
  blob2: {
    position: 'absolute',
    bottom: '15%',
    right: '-25%',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#d8e2ff', // primary-fixed
  },

  // ── Logo ───────────────────────────────────────────────────────
  // Note: No shadow/elevation here — Android elevation forces a white
  // background on the View which bleeds through transparent PNGs.
  logoWrap: {},
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },

  // ── Progress section ───────────────────────────────────────────
  progressSection: {
    position: 'absolute',
    bottom: 80,
    left: 32,
    right: 32,
  },
  barTrack: {
    height: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(193,198,214,0.35)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  barFill: {
    height: '100%',
    borderRadius: 99,
    backgroundColor: '#005BBF',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    opacity: 0.65,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#005BBF',
    lineHeight: 14,
    flex: 1,
  },
  statusTextReady: {
    fontWeight: '800',
  },
  iconReady: {
    // small bounce would go here — scale handled in JS if needed
  },
  percentText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#191c1d',
    lineHeight: 14,
    marginLeft: 8,
  },

  // ── Footer ─────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 40,
    opacity: 0.4,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#191c1d',
    lineHeight: 14,
    textAlign: 'center',
  },
});
