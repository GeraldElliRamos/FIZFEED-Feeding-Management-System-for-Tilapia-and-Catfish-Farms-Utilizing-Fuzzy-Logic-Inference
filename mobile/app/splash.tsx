import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const LOGO_SIZE = width * 0.38;

export default function SplashScreen() {
  const router = useRouter();

  // Animation values
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(15)).current;
  const dotOpacity1 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity2 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity3 = useRef(new Animated.Value(0.3)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.6)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Ring pulse animation (loops indefinitely)
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 1.4, duration: 1200, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 0.6, duration: 0, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // Main entrance → hold → fade out sequence
    Animated.sequence([
      // 1. Logo springs in
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      // 2. Title slides up
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(titleTranslateY, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
      ]),
      // 3. Subtitle slides up
      Animated.delay(80),
      Animated.parallel([
        Animated.timing(subtitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(subtitleTranslateY, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
      ]),
      // 4. Hold
      Animated.delay(2000),
      // 5. Fade out
      Animated.timing(overlayOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start(() => {
      // Navigate to main app, replacing splash so back button won't return to it
      router.replace('/login');
    });

    // Loading dots animation
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dotOpacity1, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dotOpacity2, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dotOpacity3, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(dotOpacity1, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dotOpacity2, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dotOpacity3, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
      ]).start(() => animateDots());
    };
    const dotTimer = setTimeout(animateDots, 800);
    return () => clearTimeout(dotTimer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background layers (simulate blue → teal gradient) */}
      <View style={styles.bgBase} />
      <View style={styles.bgGradientTop} />
      <View style={styles.bgGradientBottom} />

      {/* Decorative circles */}
      <View style={[styles.decorCircle, styles.decorCircleTopRight]} />
      <View style={[styles.decorCircle, styles.decorCircleBottomLeft]} />
      <View style={[styles.decorCircleSmall, styles.decorCircleTopLeft]} />

      {/* Pulse ring behind logo */}
      <Animated.View
        style={[styles.rippleRing, { transform: [{ scale: ringScale }], opacity: ringOpacity }]}
      />

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo card */}
        <Animated.View
          style={[styles.logoContainer, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}
        >
          <View style={styles.logoCard}>
            <Image
              source={require('../assets/images/splash-icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* App name */}
        <Animated.Text
          style={[styles.appName, { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] }]}
        >
          FIZFEED
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text
          style={[styles.tagline, { opacity: subtitleOpacity, transform: [{ translateY: subtitleTranslateY }] }]}
        >
          Fuzzy Inference-Based Feeding Management
        </Animated.Text>

        {/* Divider */}
        <Animated.View style={[styles.divider, { opacity: subtitleOpacity }]} />

        {/* Species label */}
        <Animated.Text style={[styles.speciesLabel, { opacity: subtitleOpacity }]}>
          TILAPIA · CATFISH
        </Animated.Text>
      </View>

      {/* Loading dots */}
      <Animated.View style={[styles.dotsContainer, { opacity: subtitleOpacity }]}>
        <Animated.View style={[styles.dot, { opacity: dotOpacity1 }]} />
        <Animated.View style={[styles.dot, { opacity: dotOpacity2 }]} />
        <Animated.View style={[styles.dot, { opacity: dotOpacity3 }]} />
      </Animated.View>

      {/* Version */}
      <Animated.Text style={[styles.version, { opacity: subtitleOpacity }]}>v1.0.0</Animated.Text>

      {/* Full-screen fade-out overlay */}
      <Animated.View
        style={[styles.fadeOverlay, { opacity: overlayOpacity }]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#005BBF',
    overflow: 'hidden',
  },
  bgBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#005BBF',
  },
  bgGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: '#0047A0',
    opacity: 0.6,
  },
  bgGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: '#006874',
    opacity: 0.45,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  decorCircleTopRight: {
    width: 220,
    height: 220,
    top: -60,
    right: -60,
  },
  decorCircleBottomLeft: {
    width: 300,
    height: 300,
    bottom: -100,
    left: -100,
  },
  decorCircleSmall: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  decorCircleTopLeft: {
    width: 120,
    height: 120,
    top: 60,
    left: -30,
    borderRadius: 9999,
  },
  rippleRing: {
    position: 'absolute',
    width: LOGO_SIZE + 80,
    height: LOGO_SIZE + 80,
    borderRadius: (LOGO_SIZE + 80) / 2,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 16,
  },
  logoCard: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE * 0.28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    width: '85%',
    height: '85%',
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 6,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.80)',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  divider: {
    width: 40,
    height: 2,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginBottom: 14,
  },
  speciesLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 3,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  version: {
    position: 'absolute',
    bottom: 44,
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1,
  },
  fadeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F8F9FA',
  },
});
