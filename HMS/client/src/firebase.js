import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBh_9JGJ-QkejhMjUmq3u2MZ1W4r5qFjC0",
  authDomain: "inventory-management-sys-cbfa1.firebaseapp.com",
  projectId: "inventory-management-sys-cbfa1",
  storageBucket: "inventory-management-sys-cbfa1.firebasestorage.app",
  messagingSenderId: "940416359974",
  appId: "1:940416359974:web:e2cd21b2ebabef9b2790e7",
  measurementId: "G-M0F9BCN3ZX"
};

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.warn('Firebase is not fully configured. Set values in .env and restart Vite.');
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {
  console.warn('Unable to set Firebase auth persistence.');
});
const db = getFirestore(app);

export { app, auth, db };