import { create } from 'zustand';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  authInitialized: false,

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      const userSnapshot = await getDoc(doc(db, 'users', credentials.user.uid));

      const user = userSnapshot.exists()
        ? { uid: userSnapshot.id, ...userSnapshot.data() }
        : { uid: credentials.user.uid, email, role: 'student', name: credentials.user.email };

      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async ({ name, email, password, role }) => {
    set({ isLoading: true });

    try {
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      const userData = {
        uid: credentials.user.uid,
        name,
        email,
        role,
      };

      await setDoc(doc(db, 'users', credentials.user.uid), userData);
      set({ user: userData, isAuthenticated: true, isLoading: false });
      return userData;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false });
  },

  initializeAuth: () => {
    set({ isLoading: true });

    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userSnapshot = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userSnapshot.exists()) {
          set({
            user: { uid: userSnapshot.id, ...userSnapshot.data() },
            isAuthenticated: true,
            isLoading: false,
            authInitialized: true,
          });
          return;
        }
      }

      set({ user: null, isAuthenticated: false, isLoading: false, authInitialized: true });
    });
  },
}));

export default useAuthStore;
