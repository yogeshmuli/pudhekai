'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/hooks';

interface Assessment {
  id: string;
  type: string;
  createdAt: any;
  assessmentType: string;
}

interface Subscription {
  id: string;
  tier: 'free' | 'paid';
  status: 'active' | 'pending' | 'expired';
  subscriptionKey: string | null;
  createdAt: any;
  expiresAt: any;
}

export default function DashboardPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, router]);

  const fetchDashboardData = async () => {
    try {
      const [subscriptionRes, assessmentsRes] = await Promise.all([
        fetch('/api/subscription/current'),
        fetch('/api/profile')
      ]);

      if (subscriptionRes.ok) {
        const subData = await subscriptionRes.json();
        setSubscription(subData.subscription);
      }

      if (assessmentsRes.ok) {
        const profileData = await assessmentsRes.json();
        setAssessments(profileData.assessments || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTierColor = (tier: string) => {
    return tier === 'paid' ? 'text-purple-600 bg-purple-100' : 'text-blue-600 bg-blue-100';
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your subscriptions and view assessment history</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Subscription Status */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Status</h2>
              
              {subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Tier</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(subscription.tier)}`}>
                      {subscription.tier === 'paid' ? 'Premium' : 'Free'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Created</span>
                    <span className="text-sm text-gray-900">{formatDate(subscription.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Expires</span>
                    <span className="text-sm text-gray-900">{formatDate(subscription.expiresAt)}</span>
                  </div>
                  
                  {subscription.subscriptionKey && (
                    <div className="pt-4 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-500 block mb-2">Subscription Key</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
                        {subscription.subscriptionKey}
                      </code>
                    </div>
                  )}
                  
                  {subscription.status === 'pending' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Your payment is being reviewed. You'll receive an email once approved.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No active subscription</p>
                  <button
                    onClick={() => router.push('/tier-selection')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Choose a Tier
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Assessment History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Assessment History</h2>
                <button
                  onClick={() => router.push('/assessment')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Take New Assessment
                </button>
              </div>
              
              {assessments.length > 0 ? (
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">
                            {assessment.type} Assessment
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(assessment.createdAt)} • {assessment.assessmentType} tier
                          </p>
                        </div>
                        <button
                          onClick={() => router.push(`/report?assessment=${assessment.id}`)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No assessments completed yet</p>
                  <button
                    onClick={() => router.push('/assessment')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Start Your First Assessment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/assessment')}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-1">Take Assessment</h3>
              <p className="text-sm text-gray-500">Start a new career assessment</p>
            </button>
            
            <button
              onClick={() => router.push('/tier-selection')}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-1">Upgrade Plan</h3>
              <p className="text-sm text-gray-500">Switch to premium tier</p>
            </button>
            
            <button
              onClick={() => router.push('/profile')}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-1">View Profile</h3>
              <p className="text-sm text-gray-500">Manage your account</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 