import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // Clear the auth token cookie
    // (await cookies()).set("auth_token", idToken, {
    //   httpOnly: true,
    //   path: "/",
    //   maxAge: 60 * 60 * 24,
    //   sameSite: "lax",
    //   secure: process.env.NODE_ENV === "production",
    // });
    (await cookies()).delete("auth_token");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
