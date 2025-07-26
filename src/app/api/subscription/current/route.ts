import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@app/utils/getUserFromRequest';
import { getUserActiveSubscription } from '@app/utils/subscriptionValidation';

/**
 * @openapi
 * /api/subscription/current:
 *   get:
 *     summary: Get current user's active subscription
 *     tags:
 *       - Subscriptions
 *     responses:
 *       200:
 *         description: Current subscription details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No active subscription found
 */
export async function GET(request: Request) {
  try {
    // Get logged-in user UID
    const uid = await getUserFromRequest(request);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await getUserActiveSubscription(uid);
    
    if (!subscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      subscription
    });

  } catch (error) {
    console.error('Error getting current subscription:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 