// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { AuthService } from '../services/authService';
import { getLevelFromXP } from '../utils/levelingSystem';
import { db } from '../firebase';

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
    // Listen to auth state changes
    const unsubscribeAuth = AuthService.onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Subscribe to user data changes
        const userRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeFirestore = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            const levelData = getLevelFromXP(data.totalXP || 0);

            setUserData({
              uid: firebaseUser.uid,
              isAnonymous: firebaseUser.isAnonymous,
              email: firebaseUser.email || undefined,
              ...data,
              ...levelData,
            } as UserData);
          }
        });

        setLoading(false);
        return () => unsubscribeFirestore();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      await AuthService.signInAnonymous();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
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
