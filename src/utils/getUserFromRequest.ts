import { adminAuth } from "@app/services/firebase";

export async function getUserFromRequest(request: Request): Promise<string | null> {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/auth_token=([^;]+)/);
  if (!match) return null;
  const token = match[1];
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
} 