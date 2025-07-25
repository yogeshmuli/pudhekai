// --- Client SDK ---
import {
  initializeApp as initClientApp,
  getApps as getClientApps,
  getApp as getClientApp,
} from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// --- Admin SDK ---
import {
  initializeApp as initAdminApp,
  cert,
  getApps as getAdminApps,
  getApp as getAdminApp,
  App as AdminApp,
} from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import serviceAccount from "../../src/keys/serviceAccountKey.json";

// --- Client SDK Initialization ---
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

const clientApp = getClientApps().length
  ? getClientApp()
  : initClientApp(firebaseConfig);

export const db = getFirestore(clientApp);
export const auth = getAuth(clientApp);
export const googleProvider = new GoogleAuthProvider();

// --- Admin SDK Initialization ---
let adminApp: AdminApp;
if (!getAdminApps().length) {
  adminApp = initAdminApp({
    credential: cert(serviceAccount as any),
  });
} else {
  adminApp = getAdminApp();
}

export const adminAuth = getAdminAuth(adminApp);

export { adminApp };
