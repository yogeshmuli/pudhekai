'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaymentDetails {
  payeeName: string;
  transactionId: string;
  paymentDate: string;
  paymentMethod: string;
  amount: string;
  screenshot?: File;
}

function PaymentDetailsContent() {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    payeeName: '',
    transactionId: '',
    paymentDate: '',
    paymentMethod: '',
    amount: '999',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tier, setTier] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tierParam = searchParams.get('tier');
    if (tierParam) {
      setTier(tierParam);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentDetails(prev => ({
        ...prev,
        screenshot: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: 'paid',
          paymentDetails
        }),
      });

      if (response.ok) {
        alert('Payment details submitted successfully! We will review your payment and provide you with a subscription key within 24 hours. You will receive an email notification once your payment is approved.');
        router.push('/dashboard');
      } else {
        throw new Error('Failed to submit payment details');
      }
    } catch (error) {
      console.error('Error submitting payment details:', error);
      alert('Failed to submit payment details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!tier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Details
            </h1>
            <p className="text-gray-600">
              Please provide your payment details. We will manually verify your payment and provide you with a subscription key within 24 hours.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Payment Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Pay ₹999 to our UPI ID: <strong>pudhekai@okicici</strong></li>
              <li>• Or transfer to Account: <strong>PudheKai Career Guidance</strong></li>
              <li>• Bank: <strong>ICICI Bank</strong></li>
              <li>• Account Number: <strong>1234567890</strong></li>
              <li>• IFSC: <strong>ICIC0001234</strong></li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="payeeName" className="block text-sm font-medium text-gray-700 mb-2">
                Payee Name *
              </label>
              <input
                type="text"
                id="payeeName"
                name="payeeName"
                value={paymentDetails.payeeName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the name of the person who made the payment"
              />
            </div>

            <div>
              <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID / UPI Reference *
              </label>
              <input
                type="text"
                id="transactionId"
                name="transactionId"
                value={paymentDetails.transactionId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter transaction ID or UPI reference number"
              />
            </div>

            <div>
              <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Date *
              </label>
              <input
                type="date"
                id="paymentDate"
                name="paymentDate"
                value={paymentDetails.paymentDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={paymentDetails.paymentMethod}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select payment method</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Google Pay">Google Pay</option>
                <option value="PhonePe">PhonePe</option>
                <option value="Paytm">Paytm</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount Paid *
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={paymentDetails.amount}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="₹999"
              />
            </div>

            <div>
              <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Screenshot (Optional)
              </label>
              <input
                type="file"
                id="screenshot"
                name="screenshot"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a screenshot of your payment confirmation for faster verification
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Important Notes:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Payment verification is manual and may take up to 24 hours</li>
                <li>• You will receive an email notification once your payment is approved</li>
                <li>• Your subscription key will be provided after payment verification</li>
                <li>• Please ensure all payment details are accurate</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Payment Details'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PaymentDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    }>
      <PaymentDetailsContent />
    </Suspense>
  );
} 