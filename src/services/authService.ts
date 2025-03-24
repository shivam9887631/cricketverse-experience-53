
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  UserCredential,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// User type
export interface UserData {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  userType?: 'spectator' | 'player' | 'admin';
}

// Authentication service
export const authService = {
  // Register with email and password
  async register(email: string, password: string, displayName: string, userType: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user profile with the display name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName
        });
      }
      
      // Create a user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName,
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
        userType,
        createdAt: new Date().toISOString()
      });
      
      return userCredential;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },
  
  // Login with email and password
  async login(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },
  
  // Sign out
  async logout(): Promise<void> {
    try {
      return await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },
  
  // Google sign in
  async signInWithGoogle(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user and create a document if needed
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        userType: 'spectator', // Default user type for social logins
        createdAt: new Date().toISOString()
      }, { merge: true });
      
      return result;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  },
  
  // Facebook sign in
  async signInWithFacebook(): Promise<UserCredential> {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user and create a document if needed
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        userType: 'spectator', // Default user type for social logins
        createdAt: new Date().toISOString()
      }, { merge: true });
      
      return result;
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      throw error;
    }
  }
};
