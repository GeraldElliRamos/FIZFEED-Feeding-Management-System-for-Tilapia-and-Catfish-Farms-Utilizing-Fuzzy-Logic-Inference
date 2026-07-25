import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { auth } from '../firebase';

const getFriendlyError = (code: string): string => {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'No account found with these credentials. Please check your email and password.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    default:
      return 'Sign in failed. Please check your credentials and try again.';
  }
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      const authError = err as AuthError;
      Alert.alert('Sign In Failed', getFriendlyError(authError.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.outerBg}>
      {Platform.OS === 'web' && (
        <style>{`
          html, body, #root {
            background-color: #005BBF !important;
            min-height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        `}</style>
      )}
      <View style={styles.bgBase} />
      <View style={styles.bgGradientTop} />
      <View style={styles.bgGradientBottom} />
      <View style={[styles.decorCircle, styles.decorCircleTopRight]} />
      <View style={[styles.decorCircle, styles.decorCircleBottomLeft]} />
      <View style={[styles.decorCircleSmall, styles.decorCircleTopLeft]} />

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCard}>
              <Image
                source={require('../assets/images/splash-icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandName}>FIZFEED</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to monitor and manage your farm.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="email-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="lock-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  activeOpacity={0.7}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#94a3b8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Pressable
              style={({ pressed }) => [
                styles.loginBtn,
                pressed && styles.loginBtnPressed,
                isLoading && styles.loginBtnDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Sign In"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginText}>Sign In</Text>
                  <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
                </>
              )}
            </Pressable>
          </View>

          <View style={styles.secondaryAction}>
            <Text style={styles.secondaryText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/signup')} activeOpacity={0.7}>
              <Text style={styles.secondaryLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerBg: {
    flex: 1,
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
    height: '50%',
    backgroundColor: '#0047A0',
    opacity: 0.6,
  },
  bgGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
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
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingTop: 22,
    paddingBottom: 18,
    alignItems: 'center',
    transform: [{ translateY: -32 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 14,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCard: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  logo: {
    width: '85%',
    height: '85%',
  },
  brandName: {
    marginTop: 8,
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 2.5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    height: '100%',
  },
  passwordInput: {
    paddingRight: 8,
  },
  eyeBtn: {
    padding: 4,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
    backgroundColor: '#005BBF',
    shadowColor: '#005BBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 13,
    color: '#64748B',
  },
  secondaryLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
});
