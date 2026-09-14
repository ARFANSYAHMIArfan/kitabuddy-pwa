
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  limit,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  increment,
  getDoc
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { ChatMessage } from '../types';

// Firebase Configuration for safe-aistd
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCXbiq5oyy9zQmCLoodUOjSMLL9OFKNB0g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "safe-aistd.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://safe-aistd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "safe-aistd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "safe-aistd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "222835619714",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:222835619714:web:54f183ce46fb428117819b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NVSPG9R63N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export interface GoogleAuthResult {
  id: string;
  name: string;
  role: string;
  email: string;
  photoURL?: string;
  uid: string;
}

/**
 * Log masuk menggunakan Google Sign-In pop-up
 */
export const signInWithGoogle = async (): Promise<GoogleAuthResult> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const email = user.email || '';
    const name = user.displayName || email.split('@')[0] || 'Pengguna Google';
    const photoURL = user.photoURL || undefined;

    let role = 'student';
    // Semak jika pengguna ialah admin rasmi
    if (
      email.toLowerCase() === 'm-10531068@moe-dl.edu.my' ||
      email.toLowerCase().includes('admin')
    ) {
      role = 'admin';
    } else {
      // Semak peranan sedia ada di Firestore jika ada
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('studentId', '==', email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data();
          role = (docData.role || 'student').toLowerCase();
        } else {
          // Rekod pengguna baharu ke Firestore
          await setDoc(doc(db, 'users', user.uid), {
            studentId: email,
            name: name,
            role: role,
            photoURL: photoURL || '',
            provider: 'google',
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          }, { merge: true });
        }
      } catch (err) {
        console.warn('Tidak dapat menyelaraskan profil pengguna ke Firestore:', err);
      }
    }

    return {
      id: email || user.uid,
      name: name,
      role: role,
      email: email,
      photoURL: photoURL,
      uid: user.uid
    };
  } catch (error: any) {
    console.error('Ralat Log Masuk Google:', error);
    throw error;
  }
};

/**
 * Log keluar pengguna daripada Firebase Auth
 */
export const logoutFirebase = async () => {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('Ralat log keluar Firebase:', error);
  }
};

/**
 * Dengar perubahan status pengesahan Firebase
 */
export const onAuthStatusChanged = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const loginUser = async (studentId: string, password: string) => {
  try {
    // Look for a user in the 'users' collection with matching ID and password
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef, 
      where("studentId", "==", studentId),
      where("password", "==", password)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      // Prioritize StudentName as per request
      return {
        id: userData.studentId,
        name: userData.StudentName || userData.name || userData.studentId,
        role: userData.role || 'Student'
      };
    }
    return null;
  } catch (error) {
    console.error("Error logging in:", error);
    // Fallback for demo purposes if DB isn't set up yet or permission issues occur
    if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
        console.warn("Firebase login failed, allowing access for development/demo.");
        
        // Mock Admin role for testing if ID contains 'admin'
        const isAdmin = studentId.toLowerCase().includes('admin');
        
        return { 
          id: studentId,
          name: studentId,
          role: isAdmin ? 'Admin' : 'Student'
        }; 
    }
    throw error;
  }
};

export const subscribeToChat = (userId: string, callback: (messages: ChatMessage[]) => void) => {
  // Create a reference to the specific user's chat collection
  const messagesRef = collection(db, 'chats', userId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(50));

  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ChatMessage));
    callback(messages);
  });
};

export const saveChatMessage = async (userId: string, message: Omit<ChatMessage, 'id'>) => {
  try {
    const messagesRef = collection(db, 'chats', userId, 'messages');
    await addDoc(messagesRef, {
      ...message,
      timestamp: Date.now() // Ensure numerical timestamp for sorting
    });
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

// --- User Management ---

export const getUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({
      docId: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const addUser = async (userData: { studentId: string; name: string; role: string; password?: string }) => {
  try {
    await addDoc(collection(db, 'users'), {
      ...userData,
      password: userData.password || '123456', // Default password if not provided
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error adding user:", error);
    return false;
  }
};

export const updateUserRole = async (docId: string, newRole: string) => {
  try {
    const userRef = doc(db, 'users', docId);
    await updateDoc(userRef, { role: newRole });
    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    return false;
  }
};

export const deleteUser = async (docId: string) => {
  try {
    await deleteDoc(doc(db, 'users', docId));
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};

// --- Report Management ---

export const getReports = async () => {
  try {
    const q = query(collection(db, 'reports'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert timestamp to string if needed for UI, or handle in UI
      date: doc.data().date?.toDate ? doc.data().date.toDate().toLocaleString() : 'Just now'
    }));
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
};

export const addReport = async (reportData: any) => {
  try {
    await addDoc(collection(db, 'reports'), {
      ...reportData,
      date: serverTimestamp(),
      status: 'Baru'
    });
    return true;
  } catch (error) {
    console.error("Error adding report:", error);
    return false;
  }
};

export const updateReport = async (docId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'reports', docId), data);
    return true;
  } catch (error) {
    console.error("Error updating report:", error);
    return false;
  }
};

export const deleteReport = async (docId: string) => {
  try {
    await deleteDoc(doc(db, 'reports', docId));
    return true;
  } catch (error) {
    console.error("Error deleting report:", error);
    return false;
  }
};

// --- Feature Management ---

export const getFeatures = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'features'));
    const features: Record<string, any> = {};
    snapshot.forEach(doc => {
      features[doc.id] = doc.data();
    });
    return features;
  } catch (error) {
    console.error("Error getting features:", error);
    return {};
  }
};

export const updateFeature = async (featureId: string, data: any) => {
  try {
    await setDoc(doc(db, 'features', featureId), data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating feature:", error);
    return false;
  }
};

// --- Analytics ---

export const incrementFeatureUsage = async (featureId: string) => {
  try {
    const docRef = doc(db, 'analytics', 'feature_usage');
    // Use setDoc with merge to ensure document exists
    await setDoc(docRef, { [featureId]: increment(1) }, { merge: true });
  } catch (error) {
    console.error("Error incrementing feature usage:", error);
  }
};

export const getFeatureUsage = async () => {
  try {
    const docRef = doc(db, 'analytics', 'feature_usage');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return {};
  } catch (error) {
    console.error("Error fetching feature usage:", error);
    return {};
  }
};

// --- System Settings ---

export const getSettings = async () => {
  try {
    const docRef = doc(db, 'settings', 'general');
    const snapshot = await getDocs(query(collection(db, 'settings'))); // Fallback scan if doc doesn't exist by ID directly in some permissions
    
    // Try direct doc get first
    // const s = await getDoc(docRef);
    
    // Using collection scan for safety with loose permissions
    if (!snapshot.empty) {
      // Look for the 'general' id or just take the first one
      const general = snapshot.docs.find(d => d.id === 'general') || snapshot.docs[0];
      return general.data();
    }
    return { maintenanceMode: false };
  } catch (error) {
    console.error("Error getting settings:", error);
    return { maintenanceMode: false };
  }
};

export const toggleMaintenanceMode = async (enabled: boolean) => {
  try {
    const docRef = doc(db, 'settings', 'general');
    // Use setDoc with merge to create if not exists
    await setDoc(docRef, { maintenanceMode: enabled }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error toggling maintenance:", error);
    return false;
  }
};