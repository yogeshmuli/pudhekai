import { db } from '@app/services/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export interface Subscription {
  id: string;
  userId: string;
  tier: 'free' | 'paid';
  status: 'active' | 'pending' | 'expired';
  subscriptionKey: string | null;
  createdAt: any;
  expiresAt: any;
  paymentDetails?: any;
}

export async function validateSubscription(
  userId: string, 
  subscriptionId?: string
): Promise<{ valid: boolean; subscription?: Subscription; error?: string }> {
  try {
    // If no subscription ID provided, check for active free subscription
    if (!subscriptionId) {
      const freeSubQuery = query(
        collection(db, 'subscriptions'),
        where('userId', '==', userId),
        where('tier', '==', 'free'),
        where('status', '==', 'active')
      );
      
      const freeSubSnapshot = await getDocs(freeSubQuery);
      if (!freeSubSnapshot.empty) {
        const subscription = { id: freeSubSnapshot.docs[0].id, ...freeSubSnapshot.docs[0].data() } as Subscription;
        return { valid: true, subscription };
      }
      
      return { valid: false, error: 'No active subscription found' };
    }

    // Validate specific subscription ID
    const subscriptionDoc = await getDoc(doc(db, 'subscriptions', subscriptionId));
    
    if (!subscriptionDoc.exists()) {
      return { valid: false, error: 'Subscription not found' };
    }

    const subscription = { id: subscriptionDoc.id, ...subscriptionDoc.data() } as Subscription;

    // Check if subscription belongs to user
    if (subscription.userId !== userId) {
      return { valid: false, error: 'Subscription does not belong to user' };
    }

    // Check if subscription is active
    if (subscription.status !== 'active') {
      return { valid: false, error: `Subscription is ${subscription.status}` };
    }

    // Check if subscription has expired
    const now = new Date();
    const expiresAt = subscription.expiresAt?.toDate?.() || new Date(subscription.expiresAt);
    
    if (now > expiresAt) {
      return { valid: false, error: 'Subscription has expired' };
    }

    return { valid: true, subscription };
  } catch (error) {
    console.error('Error validating subscription:', error);
    return { valid: false, error: 'Failed to validate subscription' };
  }
}

export async function getUserActiveSubscription(userId: string): Promise<Subscription | null> {
  try {
    const subscriptionQuery = query(
      collection(db, 'subscriptions'),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(subscriptionQuery);
    
    if (snapshot.empty) {
      return null;
    }

    // Return the most recent active subscription
    const subscriptions = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...(doc.data() as any)
    })) as Subscription[];
    
    return subscriptions.sort((a, b) => 
      (b.createdAt?.toDate?.()?.getTime() || 0) - (a.createdAt?.toDate?.()?.getTime() || 0)
    )[0];
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
} 