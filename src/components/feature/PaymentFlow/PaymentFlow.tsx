import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface BookingDetails {
  spaceTitle: string;
  startTime: string;
  endTime: string;
  numberOfDogs: number;
  totalPrice: number;
}

interface PaymentFlowProps {
  bookingDetails: BookingDetails;
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<{ onSuccess: (paymentIntentId: string) => void; onCancel: () => void }> = ({
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmation`,
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed. Please try again.');
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

export const PaymentFlow: React.FC<PaymentFlowProps> = ({
  bookingDetails,
  clientSecret,
  onSuccess,
  onCancel,
}) => {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0F766E', // Tailwind teal-700
      },
    },
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Booking Summary</h2>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Space</span>
            <span>{bookingDetails.spaceTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date & Time</span>
            <span>
              {new Date(bookingDetails.startTime).toLocaleString()} -{' '}
              {new Date(bookingDetails.endTime).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Number of Dogs</span>
            <span>{bookingDetails.numberOfDogs}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold mt-4 pt-4 border-t">
            <span>Total Price</span>
            <span>${bookingDetails.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6">Payment Details</h3>
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
      </div>
    </div>
  );
};
