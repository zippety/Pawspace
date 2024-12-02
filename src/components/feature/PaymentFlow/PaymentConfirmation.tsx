import React from 'react';
import { useRouter } from 'next/router';

interface PaymentConfirmationProps {
  bookingId: string;
  spaceTitle: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  paymentId: string;
}

export const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  bookingId,
  spaceTitle,
  startTime,
  endTime,
  totalPrice,
  paymentId,
}) => {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-100 rounded-full p-3">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">
          Booking Confirmed!
        </h1>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-4">Booking Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID</span>
                <span className="font-medium">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Space</span>
                <span className="font-medium">{spaceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in</span>
                <span className="font-medium">
                  {new Date(startTime).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out</span>
                <span className="font-medium">
                  {new Date(endTime).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t">
                <span className="text-gray-600">Total Paid</span>
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-2">What's Next?</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>A confirmation email has been sent to your registered email address</li>
              <li>The space owner will be notified of your booking</li>
              <li>You can view your booking details in your dashboard</li>
              <li>Need to make changes? Contact the space owner through messaging</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            View Dashboard
          </button>
          <button
            onClick={() => router.push('/spaces')}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Browse More Spaces
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Payment ID: {paymentId}
        </p>
      </div>
    </div>
  );
};
