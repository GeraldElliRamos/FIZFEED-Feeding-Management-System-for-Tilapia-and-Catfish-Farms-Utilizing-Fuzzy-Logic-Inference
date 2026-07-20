import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

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

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        setProfile({ id: doc.id, ...doc.data() });
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { profile, loading };
}

export function usePonds() {
  const { user } = useAuth();
  const [ponds, setPonds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
