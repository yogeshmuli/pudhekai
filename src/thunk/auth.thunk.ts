import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

// Firebase client config (use your .env values)

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const login = createAsyncThunk(
  "auth/login",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      // Send ID token to your Next.js API route
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();

      if (!data.success) {
        return rejectWithValue(data.message || "Login failed");
      }

      return { uid: data.uid, email: username };
    } catch (error: any) {
      return rejectWithValue(error.message || "Login error");
    }
  }
);

// thunk for registering a new user
export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      uid,
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      currentGrade,
    }: {
      uid: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      dateOfBirth: string;
      currentGrade: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // first create the user in Firebase Auth
      const auth = getAuth();
      let newUser = await createUserWithEmailAndPassword(auth, email, password);
      if (!newUser.user) {
        return rejectWithValue("User creation failed");
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: newUser.user.uid,
          firstName,
          lastName,
          email,
          dateOfBirth,
          currentGrade,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        return rejectWithValue(data.error || "Registration failed");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration error");
    }
  }
);

// thunk for logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      await auth.signOut();

      // clear the auth token cookie
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        return rejectWithValue("Logout failed");
      }

      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout error");
    }
  }
);
