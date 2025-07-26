import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@app/utils/getUserFromRequest';
import { db } from '@app/services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * @openapi
 * /api/subscription/create:
 *   post:
 *     summary: Create a new subscription
 *     tags:
 *       - Subscriptions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tier:
 *                 type: string
 *                 enum: [free, paid]
 *               paymentDetails:
 *                 type: object
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Subscription created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
export async function POST(request: Request) {
  try {
    // Get logged-in user UID
    const uid = await getUserFromRequest(request);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tier, paymentDetails } = await request.json();
    
    if (!tier || !['free', 'paid'].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // Create subscription document
    const subscriptionData = {
      userId: uid,
      tier,
      status: tier === 'free' ? 'active' : 'pending',
      paymentDetails: paymentDetails || null,
      createdAt: serverTimestamp(),
      expiresAt: tier === 'free' 
        ? new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000) // 6 months
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      subscriptionKey: tier === 'free' 
        ? `FREE_${uid}_${Date.now()}` 
        : null, // Will be generated after payment approval
    };

    const subscriptionRef = await addDoc(collection(db, 'subscriptions'), subscriptionData);

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscriptionRef.id,
        ...subscriptionData,
        subscriptionKey: subscriptionData.subscriptionKey
      }
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 