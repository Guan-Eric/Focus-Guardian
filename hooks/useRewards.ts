// hooks/useRewards.ts
import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { getLevelFromXP } from '../utils/levelingSystem';
import { Quest } from '../types/rewards';

export const useRewards = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', auth.currentUser?.uid ?? ''), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const levelData = getLevelFromXP(data.totalXP || 0);

        setUserData({
          ...data,
          ...levelData,
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  return { userData, loading };
};

// Hook for quest management
export const useQuests = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to user's quests
    const questsRef = collection(db, 'users', auth.currentUser?.uid ?? '', 'quests');
    const q = query(
      questsRef,
      where('completed', '==', false),
      where('expiresAt', '>', new Date())
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const questData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Quest[];

      setQuests(questData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  return { quests, loading };
};
