import React, { useEffect, useState } from 'react';
import { AlertCircle, Lock } from 'lucide-react';

interface SquarePaymentFormProps {
  total: number;
  isProcessing: boolean;
  onPaymentTokenReady: (sourceId: string) => Promise<void>;
  onError: (error: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    Square?: any;
  }
}

export default function SquarePaymentForm({
  total,
  isProcessing,
  onPaymentTokenReady,
  onError,
  disabled = false,
}: SquarePaymentFormProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [paymentElement, setPaymentElement] = useState<any>(null);
  const [error, setError] = useState('');

  const applicationId = import.meta.env.VITE_SQUARE_APPLICATION_ID || '';
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID || '';

  // Initialize Square Web Payments SDK
  useEffect(() => {
    const initializeSquare = async () => {
      if (!window.Square) {
        setError('Square SDK failed to load. Please refresh the page.');
        return;
      }

      if (!applicationId || !locationId) {
        setError('Square configuration missing. Please set up environment variables.');
        return;
      }

      try {
        const payments = window.Square.payments(applicationId, locationId);
        const paymentMethod = await payments.paymentRequest({
          countryCode: 'US',
          currencyCode: 'USD',
          requestShippingAddress: false,
        });

        // Create web payments form
        const web = await payments.web();

        setPaymentElement({
          payments,
          web,
        });
        setIsInitialized(true);
      } catch (err: any) {
        setError(err?.message || 'Failed to initialize payment form');
      }
    };

    // Delay to ensure Square SDK is loaded
    const timeout = setTimeout(initializeSquare, 500);
    return () => clearTimeout(timeout);
  }, [applicationId, locationId]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!paymentElement) {
      setError('Payment form not ready. Please try again.');
      return;
    }

    try {
      // Request payment token from Square
      const result = await paymentElement.web.requestCardNonce();

      if (result.status === 'OK') {
        // Payment token ready - pass to parent for order submission
        await onPaymentTokenReady(result.nonce);
      } else {
        setError(
          result.errors?.[0]?.message ||
            'Payment processing failed. Please try again.'
        );
        onError(result.errors?.[0]?.message || 'Payment error');
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Payment processing error';
      setError(errorMsg);
      onError(errorMsg);
    }
  };

  if (!isInitialized) {
    return (
      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
        <div className="flex items-center gap-3 text-stone-600">
          <div className="animate-spin">
            <Lock className="w-4 h-4" />
          </div>
          <p className="text-sm">Loading secure payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handlePaymentSubmit} className="space-y-4">
      {/* Payment Method Input (Web Payments will render here via Square SDK) */}
      <div id="square-container" className="border border-stone-300 rounded-lg p-4">
        {/* Square Web Payments form renders here */}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Pay Button */}
      <button
        type="submit"
        disabled={disabled || isProcessing || !isInitialized}
        className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <span className="animate-spin inline-block">⟳</span>
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay ${(total / 100).toFixed(2)}
          </>
        )}
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-1 text-xs text-stone-500">
        <Lock className="w-3 h-3" />
        <span>Secure payment processed by Square</span>
      </div>
    </form>
  );
}
