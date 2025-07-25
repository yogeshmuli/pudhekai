import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getAuth } from "firebase-admin/auth";

export async function POST(request: Request) {
  const { idToken } = await request.json();

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);

    // Set cookie
    (await cookies()).set("auth_token", idToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json({ success: true, uid: decodedToken.uid });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }
}

export async function GET() {
  const token = (await cookies()).get("auth_token")?.value;
  if (token) {
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      return NextResponse.json({ authenticated: true, uid: decodedToken.uid });
    } catch {
      return NextResponse.json({ authenticated: false });
    }
  }
  return NextResponse.json({ authenticated: false });
}
