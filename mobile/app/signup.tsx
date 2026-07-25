import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile, AuthError } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const getFriendlyError = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/too-many-requests':
      return 'Too many requests. Please try again later.';
    default:
      return 'Account creation failed. Please try again.';
  }
};

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<'admin' | 'farm_owner' | 'farm_staff' | 'viewer'>('farm_owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async () => {
    // — Validation —
    if (!fullName.trim()) {
      Alert.alert('Missing Field', 'Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Missing Field', 'Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.');
      return;
    }
    if (!termsAccepted) {
      Alert.alert('Terms Required', 'Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create Firebase Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = userCredential.user.uid;

      // 2. Update Auth Profile
      try {
        await updateProfile(userCredential.user, { displayName: fullName.trim() });
      } catch (pErr) {
        console.warn("Profile update warning:", pErr);
      }
      
      // 3. Create User Document in Firestore (Required)
      try {
        await setDoc(doc(db, "users", uid), {
          displayName: fullName.trim(),
          email: email.trim(),
          role,
          farmName: farmName.trim() || "My Aqua Farm",
          address: address.trim(),
          phone: "",
          location: address.trim(),
          createdAt: serverTimestamp()
        });
        console.log("Firestore User Document Created successfully at users/" + uid);
      } catch (docErr: any) {
        console.error("Failed writing Firestore user document:", docErr);
        Alert.alert('Firestore Error', `Account created, but writing user data failed: ${docErr?.message || docErr}`);
        setIsLoading(false);
        return;
      }
      
      // 4. Populate default collections for the user
      try {
        const pondsRef = collection(db, "users", uid, "ponds");
        await addDoc(pondsRef, { name: "Pond A", fishType: "Tilapia", capacity: 25, currentStock: 18.5, dailyUsage: 8.2 });
        await addDoc(pondsRef, { name: "Pond B", fishType: "Catfish", capacity: 25, currentStock: 11.2, dailyUsage: 2.8 });

        const schedulesRef = collection(db, "users", uid, "schedules");
        await addDoc(schedulesRef, { time: "06:00", period: "AM", amountKg: 2.5, pondName: "Pond A", fishType: "Tilapia", status: "Scheduled", enabled: true, date: serverTimestamp() });
        
        const notifsRef = collection(db, "users", uid, "notifications");
        await addDoc(notifsRef, { title: "Welcome to FIZFEED", message: "Your smart aquaculture system is ready.", type: "success", read: false, createdAt: serverTimestamp() });
      } catch (colErr) {
        console.warn("Subcollection initialization warning:", colErr);
      }

      router.replace('/(tabs)');
    } catch (err: any) {
      console.error("Signup error details: ", err);
      Alert.alert('Sign Up Failed', err?.message || getFriendlyError(err?.code || ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.outerBg}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.bgBase} />
      <View style={styles.bgGradientTop} />
      <View style={styles.bgGradientBottom} />
      <View style={[styles.decorCircle, styles.decorCircleTopRight]} />
      <View style={[styles.decorCircle, styles.decorCircleBottomLeft]} />
      <View style={[styles.decorCircleSmall, styles.decorCircleTopLeft]} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Enter your details to start managing your farm.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="account-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#94a3b8"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  returnKeyType="next"
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Farm Name</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="home-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Oceanic Aqua Farm"
                  placeholderTextColor="#94a3b8"
                  value={farmName}
                  onChangeText={setFarmName}
                  autoCapitalize="words"
                  returnKeyType="next"
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Farm Address</Text>
              <View style={[styles.inputWrapper, styles.inputWrapperMultiline]}>
                <MaterialCommunityIcons name="map-marker-outline" size={20} color="#94a3b8" style={[styles.inputIcon, { alignSelf: 'flex-start', marginTop: 12 }]} />
                <TextInput
                  style={[styles.input, styles.addressInput]}
                  placeholder="Street, Barangay, City, Province"
                  placeholderTextColor="#94a3b8"
                  value={address}
                  onChangeText={setAddress}
                  autoCapitalize="words"
                  returnKeyType="next"
                  multiline
                  numberOfLines={3}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Role</Text>
              <View style={styles.roleOptions}>
                {[
                  { key: 'admin', label: 'Admin' },
                  { key: 'farm_owner', label: 'Farm Owner' },
                  { key: 'farm_staff', label: 'Farm Staff' },
                  { key: 'viewer', label: 'Viewer' },
                ].map((item) => (
                  <Pressable
                    key={item.key}
                    onPress={() => setRole(item.key as typeof role)}
                    style={({ pressed }) => [
                      styles.roleOption,
                      role === item.key && styles.roleOptionActive,
                      pressed && styles.roleOptionPressed,
                    ]}
                    disabled={isLoading}
                    accessibilityRole="button"
                    accessibilityLabel={`Select role ${item.label}`}
                  >
                    <Text style={[styles.roleOptionText, role === item.key && styles.roleOptionTextActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

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
                  returnKeyType="next"
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

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="lock-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleCreateAccount}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeBtn}
                  activeOpacity={0.7}
                  accessibilityLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#94a3b8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.termsRow}>
              <TouchableOpacity
                style={styles.checkboxWrap}
                onPress={() => setTermsAccepted(!termsAccepted)}
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                  {termsAccepted && <MaterialCommunityIcons name="check" size={12} color="#fff" />}
                </View>
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.createBtn,
                pressed && styles.createBtnPressed,
                isLoading && styles.createBtnDisabled,
              ]}
              onPress={handleCreateAccount}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Create Account"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.createText}>Create Account</Text>
                  <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
                </>
              )}
            </Pressable>
          </View>

          <View style={styles.secondaryAction}>
            <Text style={styles.secondaryText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')} activeOpacity={0.7} disabled={isLoading}>
              <Text style={styles.secondaryLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: 'center',
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
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  logo: {
    width: '85%',
    height: '85%',
  },
  brandName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: 10,
  },
  fieldGroup: {
    gap: 6,
  },
  roleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  roleOptionPressed: {
    opacity: 0.85,
  },
  roleOptionActive: {
    backgroundColor: '#005BBF',
    borderColor: '#005BBF',
  },
  roleOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  roleOptionTextActive: {
    color: '#ffffff',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputWrapperMultiline: {
    height: 'auto',
    minHeight: 80,
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    height: '100%',
  },
  addressInput: {
    height: undefined,
    minHeight: 60,
    textAlignVertical: 'top',
    paddingTop: 4,
  },
  passwordInput: {
    paddingRight: 8,
  },
  eyeBtn: {
    padding: 4,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingTop: 4,
  },
  checkboxWrap: {
    paddingTop: 2,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#005BBF',
    borderColor: '#005BBF',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#64748b',
  },
  termsLink: {
    color: '#2563eb',
    fontWeight: '700',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 6,
    backgroundColor: '#005BBF',
    shadowColor: '#005BBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  createBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  createBtnDisabled: {
    opacity: 0.7,
  },
  createText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'center',
    flexWrap: 'wrap',
    rowGap: 4,
  },
  secondaryText: {
    fontSize: 13,
    color: '#64748b',
  },
  secondaryLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
});
