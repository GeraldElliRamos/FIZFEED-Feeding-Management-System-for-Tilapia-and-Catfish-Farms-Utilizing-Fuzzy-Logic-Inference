import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === "true";

const DEMO_PONDS = [
  { id: 'demo-pond-1', name: 'Pond A', fishType: 'Tilapia', capacity: 25, currentStock: 18.5, dailyUsage: 8.2, isConnected: true },
  { id: 'demo-pond-2', name: 'Pond B', fishType: 'Catfish', capacity: 25, currentStock: 11.2, dailyUsage: 2.8, isConnected: true },
];

const DEMO_SCHEDULES = [
  { id: 'demo-sched-1', time: '06:00', period: 'AM', amountKg: 2.5, pondName: 'Pond A', fishType: 'Tilapia', enabled: true },
  { id: 'demo-sched-2', time: '12:00', period: 'PM', amountKg: 3.0, pondName: 'Pond A', fishType: 'Tilapia', enabled: true },
  { id: 'demo-sched-3', time: '06:00', period: 'PM', amountKg: 2.7, pondName: 'Pond B', fishType: 'Catfish', enabled: true },
];

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};

    try {
      const userDocRef = doc(db, "users", user.uid);
      unsubscribe = onSnapshot(
        userDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setProfile({ id: snapshot.id, ...snapshot.data() });
          } else {
            setProfile(null);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Failed to subscribe to user profile:", error);
          setProfile(null);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Failed to initialize user profile listener:", error);
      setProfile(null);
      setLoading(false);
    }

    return () => unsubscribe();
  }, [user]);

  return { profile, loading };
}

const DEFAULT_PONDS = [
  { id: 'p1', name: 'Pond A', fishType: 'Tilapia', capacity: 25, currentStock: 18.5, dailyUsage: 8.2 },
  { id: 'p2', name: 'Pond B', fishType: 'Catfish', capacity: 25, currentStock: 11.2, dailyUsage: 2.8 },
];

const DEFAULT_SCHEDULES = [
  { id: 's1', time: '06:00', period: 'AM', amountKg: 2.5, pondName: 'Pond A', fishType: 'Tilapia', enabled: true },
  { id: 's2', time: '12:00', period: 'PM', amountKg: 3.0, pondName: 'Pond A', fishType: 'Tilapia', enabled: true },
  { id: 's3', time: '06:00', period: 'PM', amountKg: 2.7, pondName: 'Pond A', fishType: 'Tilapia', enabled: true },
];

export function usePonds() {
  const { user } = useAuth();
  const [ponds, setPonds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEMO_MODE) {
      setPonds(DEMO_PONDS);
      setLoading(false);
      return;
    }

    if (!user) {
      setPonds([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "users", user.uid, "ponds"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pondData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPonds(pondData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { ponds, loading };
}

export function useSchedules() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEMO_MODE) {
      setSchedules(DEMO_SCHEDULES);
      setLoading(false);
      return;
    }

    if (!user) {
      setSchedules([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "users", user.uid, "schedules"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scheduleData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSchedules(scheduleData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { schedules, loading };
}
