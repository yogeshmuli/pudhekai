import { Suspense } from 'react';
import TierSelectionContent from './TierSelectionContent';

export default function TierSelectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tier selection...</p>
        </div>
      </div>
    }>
      <TierSelectionContent />
    </Suspense>
  );
}