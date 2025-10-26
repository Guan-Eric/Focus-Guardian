// services/authService.ts
import {
  signInAnonymously,
  onAuthStateChanged,
  User,
  linkWithCredential,
  EmailAuthProvider,
  updateProfile,
  signInWithCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { credential } from 'firebase-admin';

export class AuthService {
  // Sign in anonymously
  static async signInAnonymous(): Promise<User> {
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // Create initial user document
      await this.createUserDocument(user.uid);

      return user;
    } catch (error: any) {
      console.error('Anonymous sign in error:', error);
      throw new Error('Failed to sign in: ' + error.message);
    }
  }

  // Sign in with email
  static async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const credential = EmailAuthProvider.credential(email, password);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      return user;
    } catch (error: any) {
      console.error('Email sign in error:', error);
      throw new Error('Failed to sign in: ' + error.message);
    }
  }
  // Create initial user document in Firestore
  static async createUserDocument(userId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    // Only create if doesn't exist
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: userId,
        isAnonymous: true,
        createdAt: serverTimestamp(),

        // Initial stats
        totalXP: 0,
        level: 1,
        title: 'Wanderer',
        titleEmoji: '🌱',

        // Initial streaks
        streak: 0,

        // Initial shields
        shields: [],

        // Initial badges
        badges: [],

        // Settings
        settings: {
          screenTimeGoal: 2, // hours
          notifications: true,
          dailyCheckIn: true,
        },

        // Initial stats
        stats: {
          totalSessions: 0,
          totalMinutes: 0,
          sessionsToday: 0,
          longestSession: 0,
          maxSessionsPerDay: 0,
          totalResists: 0,
          questsCompleted: 0,
          dailyQuestStreak: 0,
          phoneFreeMeals: 0,
          phoneFreeSocial: 0,
          phoneFreeOutdoor: 0,
          sleepStreak: 0,
          perfectDays: 0,
          comebackStreaks: 0,
          maxQuestsPerDay: 0,
          lateNightFreeStreak: 0,
          appsDeleted: 0,
          communityHelps: 0,
        },

        // Empty history arrays
        xpHistory: [],
        levelHistory: [],
        unlockedRewards: [],
      });
    }
  }

  // Convert anonymous account to permanent (optional feature)
  static async linkWithEmail(email: string, password: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const credential = EmailAuthProvider.credential(email, password);
      await linkWithCredential(user, credential);

      // Update user document
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          email,
          isAnonymous: false,
          linkedAt: serverTimestamp(),
        },
        { merge: true }
      );

      console.log('Account linked successfully');
    } catch (error: any) {
      console.error('Link account error:', error);
      throw new Error('Failed to link account: ' + error.message);
    }
  }

  // Get current user data
  static async getCurrentUserData(): Promise<any> {
    const user = auth.currentUser;
    if (!user) return null;

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }

    return null;
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await auth.signOut();
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out: ' + error.message);
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}
