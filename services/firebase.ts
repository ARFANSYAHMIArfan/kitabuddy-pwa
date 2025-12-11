
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
import { ChatMessage } from '../types';

// Firebase Configuration for safe-aistd
const firebaseConfig = {
  apiKey: "AIzaSyCXbiq5oyy9zQmCLoodUOjSMLL9OFKNB0g",
  authDomain: "safe-aistd.firebaseapp.com",
  databaseURL: "https://safe-aistd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "safe-aistd",
  storageBucket: "safe-aistd.firebasestorage.app",
  messagingSenderId: "222835619714",
  appId: "1:222835619714:web:54f183ce46fb428117819b",
  measurementId: "G-NVSPG9R63N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    if (process.env.NODE_ENV === 'development') {
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