import { NextResponse } from "next/server";
import { db } from "@app/services/firebase"; // for Firestore client
import { collection, doc, setDoc } from "firebase/firestore";

type RegisterRequestModel = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  currentGrade: string;
};
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Register request data:', JSON.stringify(data, null, 2));
    if (!data) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    const { uid, firstName, lastName, email, dateOfBirth, currentGrade }: any =
      data;

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const userDocRef = doc(collection(db, "users"), uid);
    const userData = {
      firstName,
      lastName,
      email,
      dateOfBirth,
      currentGrade,
    };
    // Create or update user data in Firestore
    await setDoc(userDocRef, userData, { merge: true });
    return NextResponse.json(
      { success: true, message: "User registered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
