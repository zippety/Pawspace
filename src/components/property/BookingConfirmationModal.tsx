import React, { useCallback } from 'react';
import { format } from 'date-fns';
import { Property, PropertyBooking } from '../../types/property';
import { formatTimeSlot } from '../../utils/availability';
import { Dialog } from '@headlessui/react';
import { CheckCircle, X, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
import ErrorTracker, { ErrorCategory, withErrorBoundary } from '../../utils/errorTracking';

interface BookingConfirmationModalProps {
  booking: PropertyBooking;
  onClose: () => void;
  className?: string;
}

interface BookingStatusProps {
  status: string;
  className?: string;
}

const BookingStatus: React.FC<BookingStatusProps> = ({ status, className }) => {
  const statusConfig = {
    pending: {
      className: 'bg-yellow-100 text-yellow-800',
      text: 'Pending Confirmation',
    },
    confirmed: {
      className: 'bg-green-100 text-green-800',
      text: 'Confirmed',
    },
    cancelled: {
      className: 'bg-red-100 text-red-800',
      text: 'Cancelled',
    },
  }[status] || {
    className: 'bg-gray-100 text-gray-800',
    text: status,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusConfig.className,
        className
      )}
    >
      {statusConfig.text}
    </span>
  );
};

function BookingConfirmationModalContent({
  booking,
  onClose,
  className,
}: BookingConfirmationModalProps) {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  const handleClose = useCallback(() => {
    try {
      // Track successful booking completion
      ErrorTracker.logError(
        ErrorTracker.createError(
          'Booking confirmation viewed',
          'BookingConfirmationModal',
          ErrorCategory.INTERNAL
        ),
        'BookingConfirmationModal',
        {
          bookingId: booking.id,
          status: booking.status,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }
      );

      onClose();
    } catch (error) {
      ErrorTracker.logError(
        error as Error,
        'BookingConfirmationModal',
        { action: 'close', bookingId: booking.id }
      );
      onClose();
    }
  }, [booking.id, booking.status, onClose, startTime, endTime]);

  const handleAddToCalendar = useCallback(async () => {
    try {
      // Check rate limit for calendar additions
      if (!ErrorTracker.checkRateLimit(`calendar-add-${booking.id}`, 3, 60000)) { // 3 attempts per minute
        throw ErrorTracker.createError(
          'Too many calendar add attempts. Please wait a moment before trying again.',
          'BookingConfirmationModal',
          ErrorCategory.RATE_LIMIT
        );
      }

      // Add to calendar logic here
      // ...

    } catch (error) {
      ErrorTracker.logError(
        error as Error,
        'BookingConfirmationModal',
        { action: 'addToCalendar', bookingId: booking.id }
      );
    }
  }, [booking.id]);

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container for centering */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className={cn(
            'w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all',
            className
          )}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>

          {/* Success icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Content */}
          <div className="mt-4 text-center">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
              Booking Confirmed!
            </Dialog.Title>

            <div className="mt-4">
              <h3 className="font-medium text-gray-900">{booking.property.title}</h3>
              <p className="text-sm text-gray-500">{booking.property.address}</p>
            </div>

            <div className="mt-4 space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-900">Date & Time</p>
                <p className="text-sm text-gray-500">
                  {format(startTime, 'MMMM d, yyyy')} at{' '}
                  {formatTimeSlot(
                    format(startTime, 'HH:mm'),
                    format(endTime, 'HH:mm')
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">Dogs</p>
                <p className="text-sm text-gray-500">
                  {booking.dogNames.join(', ')}
                </p>
              </div>

              {booking.specialRequirements && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Special Requirements</p>
                  <p className="text-sm text-gray-500">{booking.specialRequirements}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-900">Booking Status</p>
                <BookingStatus status={booking.status} />
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={handleAddToCalendar}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Add to Calendar
              </button>
              <button
                onClick={handleClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// Wrap with error boundary
export const BookingConfirmationModal = withErrorBoundary('BookingConfirmationModal')(BookingConfirmationModalContent);
