'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '../../store/hooks';
import { setSubscription } from '../../slice/auth.slice';
import DashboardHeader from '../../components/header/dashboardheader';


interface TierOption {
  id: 'free' | 'paid';
  name: string;
  price: string;
  features: string[];
  description: string;
  popular?: boolean;
}

const tierOptions: TierOption[] = [
  {
    id: 'free',
    name: 'Free Tier',
    price: '₹0',
    description: 'Basic assessment with limited questions',
    features: [
      '4 questions per HEXACO trait',
      '2 questions per RIASEC category',
      '8 Multiple Intelligence questions',
      '40 Aptitude questions',
      'Basic career recommendations',
      'PDF report download',
      'Valid for 6 months'
    ]
  },
  {
    id: 'paid',
    name: 'Premium Tier',
    price: '₹999',
    description: 'Comprehensive assessment with detailed analysis',
    features: [
      '10 questions per HEXACO trait',
      '5 questions per RIASEC category',
      'All Multiple Intelligence questions',
      'All Aptitude questions',
      'Advanced career recommendations',
      'Detailed PDF report with insights',
      'Priority support',
      'Valid for 1 year',
      'Retake assessments anytime'
    ],
    popular: true
  }
];

export default function TierSelectionPage() {
  const [selectedTier, setSelectedTier] = useState<'free' | 'paid' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch();


  const handleTierSelection = async (tier: 'free' | 'paid') => {
    setIsLoading(true);

    try {
      if (tier === 'free') {
        // For free tier, create subscription immediately
        const response = await fetch('/api/subscription/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tier: 'free',
            paymentDetails: null
          }),
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(setSubscription(data.subscription));

          router.push(`/assessment`);
        } else {
          throw new Error('Failed to create subscription');
        }
      } else {
        // For paid tier, redirect to payment details form
        router.push(`/payment-details?tier=${tier}`);
      }
    } catch (error) {
      console.error('Error selecting tier:', error);
      alert('Failed to select tier. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/20 py-12 px-4">

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Assessment Tier
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the tier that best fits your career guidance needs.
              Start with our free tier or unlock comprehensive insights with our premium plan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {tierOptions.map((tier) => (
              <div
                key={tier.id}
                className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 hover:shadow-xl ${tier.popular
                  ? 'border-primary shadow-primary/10'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {tier.price}
                  </div>
                  <p className="text-gray-600">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleTierSelection(tier.id)}
                  disabled={isLoading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${tier.popular
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    tier.id === 'free' ? 'Start Free Assessment' : 'Choose Premium'
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              Need help choosing? Contact our support team for guidance.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}