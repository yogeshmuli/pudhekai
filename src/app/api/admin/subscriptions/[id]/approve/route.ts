import { NextResponse } from 'next/server';
import { db } from '@app/services/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

/**
 * @openapi
 * /api/admin/subscriptions/{id}/approve:
 *   post:
 *     summary: Approve a subscription payment (admin only)
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment approved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Subscription not found
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // TODO: Add admin authentication check
    // For now, this is open - in production, add proper admin auth
    
    const subscriptionId = id;
    const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
    
    // Generate subscription key for paid tier
    const subscriptionKey = `PAID_${subscriptionId}_${Date.now()}`;
    
    await updateDoc(subscriptionRef, {
      status: 'active',
      subscriptionKey,
      approvedAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    });

    return NextResponse.json({
      success: true,
      message: 'Payment approved successfully',
      subscriptionKey
    });

  } catch (error) {
    console.error('Error approving subscription:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 