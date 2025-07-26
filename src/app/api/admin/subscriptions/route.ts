import { NextResponse } from 'next/server';
import { db } from '@app/services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

/**
 * @openapi
 * /api/admin/subscriptions:
 *   get:
 *     summary: Get all subscriptions (admin only)
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: List of all subscriptions
 *       401:
 *         description: Unauthorized
 */
export async function GET(request: Request) {
  try {
    // TODO: Add admin authentication check
    // For now, this is open - in production, add proper admin auth
    
    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(subscriptionsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const subscriptions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      subscriptions
    });

  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 