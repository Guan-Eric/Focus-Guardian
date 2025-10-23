// context/AuthContext.tsx - Data Provider Only (No Navigation)
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthService } from '../services/authService';
import { getLevelFromXP } from '../utils/levelingSystem';

type UserData = {
  uid: string;
  isAnonymous: boolean;
  email?: string;
  totalXP: number;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  title: string;
  titleEmoji: string;
  tier: string;
  streak: number;
  shields: any[];
  badges: any[];
  settings: {
    screenTimeGoal: number;
    notifications: boolean;
    dailyCheckIn: boolean;
  };
  stats: {
    screenTimeToday: number;
    xpToday: number;
    sessionsToday: number;
    totalSessions: number;
    totalMinutes: number;
    longestSession: number;
    maxSessionsPerDay: number;
    totalResists: number;
    questsCompleted: number;
    longestStreak?: number;
  };
  reason: string[];
  onboardingCompleted: boolean;
};

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  linkEmail: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let firestoreUnsubscribe: (() => void) | null = null;

    // Listen to auth state
    const authUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // Clean up previous Firestore listener
      if (firestoreUnsubscribe) {
        firestoreUnsubscribe();
        firestoreUnsubscribe = null;
      }

      setUser(firebaseUser);

      if (firebaseUser) {
        // Subscribe to user data
        const userRef = doc(db, 'users', firebaseUser.uid);
        firestoreUnsubscribe = onSnapshot(
          userRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              const levelData = getLevelFromXP(data.totalXP || 0);

              setUserData({
                uid: firebaseUser.uid,
                isAnonymous: firebaseUser.isAnonymous,
                email: firebaseUser.email || undefined,
                ...data,
                ...levelData,
              } as UserData);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Firestore listener error:', error);
            setLoading(false);
          }
        );
      } else {
        // No user - clear data
        setUserData(null);
        setLoading(false);
      }
    });

    // Cleanup
    return () => {
      authUnsubscribe();
      if (firestoreUnsubscribe) {
        firestoreUnsubscribe();
      }
    };
  }, []);

  const signIn = async () => {
    try {
      await AuthService.signInAnonymous();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const linkEmail = async (email: string, password: string) => {
    try {
      await AuthService.linkWithEmail(email, password);
    } catch (error) {
      console.error('Link email error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signIn,
        signOut,
        linkEmail,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
