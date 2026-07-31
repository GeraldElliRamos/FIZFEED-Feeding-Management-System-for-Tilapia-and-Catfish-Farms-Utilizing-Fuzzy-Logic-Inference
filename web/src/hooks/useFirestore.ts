import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./useAuth";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const DEMO_PONDS = [
  { id: "demo-pond-1", name: "Pond A", fishType: "Tilapia", capacity: 25, currentStock: 18.5, dailyUsage: 8.2, isConnected: true },
  { id: "demo-pond-2", name: "Pond B", fishType: "Catfish", capacity: 25, currentStock: 11.2, dailyUsage: 2.8, isConnected: true },
];

const DEMO_SCHEDULES = [
  { id: "demo-sched-1", time: "06:00", period: "AM", amountKg: 2.5, pondName: "Pond A", fishType: "Tilapia", enabled: true, status: "Completed" },
  { id: "demo-sched-2", time: "12:00", period: "PM", amountKg: 3.0, pondName: "Pond A", fishType: "Tilapia", enabled: true, status: "Scheduled" },
  { id: "demo-sched-3", time: "06:00", period: "PM", amountKg: 2.7, pondName: "Pond B", fishType: "Catfish", enabled: true, status: "Scheduled" },
];

const DEMO_NOTIFICATIONS = [
  {
    id: "demo-notif-1",
    type: "recommendation",
    category: "recommendation",
    title: "Feed Adjustment",
    subtitle: "Weather looks clear today",
    message: "Normal feeding is fine for Pond A. Keep sessions steady and monitor fish activity after feeding.",
    reason: "Clear weather and stable water conditions.",
    priority: "medium",
    createdAt: new Date().toISOString(),
  },
];

const DEMO_DEVICES = [
  {
    id: "demo-device-1",
    name: "ESP32 Pond A",
    pondName: "Pond A",
    fishType: "Tilapia",
    status: "online",
    temperature: 28.4,
    ph_level: 7.1,
    batteryLevel: 87,
    lastSeenAt: new Date().toISOString(),
  },
  {
    id: "demo-device-2",
    name: "ESP32 Pond B",
    pondName: "Pond B",
    fishType: "Catfish",
    status: "offline",
    temperature: 27.8,
    ph_level: 6.9,
    batteryLevel: 44,
    lastSeenAt: new Date().toISOString(),
  },
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

    // Usually you'd order by time/date, using a simple query for now
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

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEMO_MODE) {
      setNotifications(DEMO_NOTIFICATIONS);
      setLoading(false);
      return;
    }

    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "notifications"),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notifData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { notifications, loading };
}

export function useDevices() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEMO_MODE) {
      setDevices(DEMO_DEVICES);
      setLoading(false);
      return;
    }

    if (!user) {
      setDevices([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "users", user.uid, "devices"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDevices(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { devices, loading };
}
