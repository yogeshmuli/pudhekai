// Firebase utility for server/client usage
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCf1KKEXvMsmZB_Wyn-HBKBL1pK3hrEqkA",
  authDomain: "pudhekai-22a9c.firebaseapp.com",
  projectId: "pudhekai-22a9c",
  storageBucket: "pudhekai-22a9c.appspot.com",
  messagingSenderId: "114108754350",
  appId: "1:114108754350:web:f1e80b2f1e1f94953a003f",
  measurementId: "G-VX4R08CND4"
};

// Prevent re-initialization in hot-reload/dev
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app); 