import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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
import { SafeAreaView } from 'react-native-safe-area-context';
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
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = userCredential.user.uid;

      try {
        await updateProfile(userCredential.user, { displayName: fullName.trim() });
      } catch (pErr) {
        console.warn("Profile update warning:", pErr);
      }
      
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
      } catch (docErr: any) {
        console.error("Failed writing Firestore user document:", docErr);
        Alert.alert('Firestore Error', `Account created, but writing user data failed: ${docErr?.message || docErr}`);
        setIsLoading(false);
        return;
      }
      
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
    <SafeAreaView style={styles.outerBg} edges={['top', 'bottom']}>
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
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* Header with Logo */}
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

            {/* Form */}
            <View style={styles.form}>
              {/* Full Name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="account-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
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

              {/* Farm Name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Farm Name</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="home-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
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

              {/* Farm Address */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Farm Address</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="map-marker-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Street, Barangay, City, Province"
                    placeholderTextColor="#94a3b8"
                    value={address}
                    onChangeText={setAddress}
                    autoCapitalize="words"
                    returnKeyType="next"
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Role Options */}
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
                    >
                      <Text style={[styles.roleOptionText, role === item.key && styles.roleOptionTextActive]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Email Address */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="email-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
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

              {/* Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="lock-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
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
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={18}
                      color="#94a3b8"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="lock-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
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
                  >
                    <MaterialCommunityIcons
                      name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={18}
                      color="#94a3b8"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms Checkbox */}
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

              {/* Submit Button */}
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
                    <MaterialCommunityIcons name="arrow-right" size={16} color="#fff" />
                  </>
                )}
              </Pressable>
            </View>

            {/* Footer */}
            <View style={styles.secondaryAction}>
              <Text style={styles.secondaryText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/login')} activeOpacity={0.7} disabled={isLoading}>
                <Text style={styles.secondaryLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerBg: {
    flex: 1,
    backgroundColor: '#005BBF',
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#005BBF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#005BBF',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#005BBF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 400,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoCard: {
    width: 56,
    height: 56,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  logo: {
    width: '85%',
    height: '85%',
  },
  brandName: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: 9,
  },
  fieldGroup: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    height: '100%',
  },
  passwordInput: {
    paddingRight: 6,
  },
  eyeBtn: {
    padding: 3,
  },
  roleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  roleOption: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  roleOptionPressed: {
    opacity: 0.85,
  },
  roleOptionActive: {
    backgroundColor: '#005BBF',
    borderColor: '#005BBF',
  },
  roleOptionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  roleOptionTextActive: {
    color: '#FFFFFF',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingTop: 2,
  },
  checkboxWrap: {
    paddingTop: 1,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#005BBF',
    borderColor: '#005BBF',
  },
  termsText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: '#64748B',
  },
  termsLink: {
    color: '#2563EB',
    fontWeight: '700',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    paddingVertical: 11,
    marginTop: 4,
    backgroundColor: '#005BBF',
    shadowColor: '#005BBF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  createBtnDisabled: {
    opacity: 0.7,
  },
  createText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  secondaryText: {
    fontSize: 12,
    color: '#64748B',
  },
  secondaryLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
});
