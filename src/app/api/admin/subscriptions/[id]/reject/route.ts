import { NextResponse } from 'next/server';
import { db } from '@app/services/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

/**
 * @openapi
 * /api/admin/subscriptions/{id}/reject:
 *   post:
 *     summary: Reject a subscription payment (admin only)
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
 *         description: Payment rejected successfully
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
    
    await updateDoc(subscriptionRef, {
      status: 'expired',
      rejectedAt: serverTimestamp(),
      rejectionReason: 'Payment verification failed'
    });

    return NextResponse.json({
      success: true,
      message: 'Payment rejected successfully'
    });

  } catch (error) {
    console.error('Error rejecting subscription:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 