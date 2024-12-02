import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Property, TimeSlot, PropertyBooking } from '../../types/property';
import { cn } from '../../utils/cn';
import { formatTimeSlot } from '../../utils/availability';
import { useBookingStore } from '../../store/bookingStore';
import { BookingConfirmationModal } from './BookingConfirmationModal';
import ErrorTracker, { ErrorCategory, withErrorBoundary } from '../../utils/errorTracking';
import { AlertTriangle } from 'lucide-react';

const bookingFormSchema = z.object({
  numberOfDogs: z.number().min(1, 'At least one dog is required').max(5, 'Maximum 5 dogs allowed'),
  dogNames: z.array(z.string().min(1, 'Dog name is required')).min(1, 'At least one dog name is required'),
  specialRequirements: z.string().optional(),
  agreement: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface PropertyBookingFormProps {
  property: Property;
  selectedDate: Date;
  selectedTimeSlot: TimeSlot;
  onSubmit: (data: BookingFormData) => void;
  onCancel: () => void;
  className?: string;
}

interface BookingErrorProps {
  message: string;
  onRetry?: () => void;
}

const BookingError: React.FC<BookingErrorProps> = ({ message, onRetry }) => (
  <div className="rounded-md bg-red-50 p-4 mb-6">
    <div className="flex">
      <div className="flex-shrink-0">
        <AlertTriangle className="h-5 w-5 text-red-400" />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">Booking Error</h3>
        <div className="mt-2 text-sm text-red-700">
          <p>{message}</p>
        </div>
        {onRetry && (
          <div className="mt-4">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

function PropertyBookingFormContent({
  property,
  selectedDate,
  selectedTimeSlot,
  onSubmit,
  onCancel,
  className,
}: PropertyBookingFormProps) {
  const createBooking = useBookingStore((state) => state.createBooking);
  const [confirmedBooking, setConfirmedBooking] = useState<PropertyBooking | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      numberOfDogs: 1,
      dogNames: [''],
      specialRequirements: '',
      agreement: false,
    },
  });

  const numberOfDogs = watch('numberOfDogs');

  // Update dog names array when number of dogs changes
  React.useEffect(() => {
    const currentDogNames = watch('dogNames');
    if (numberOfDogs > currentDogNames.length) {
      setValue('dogNames', [...currentDogNames, ...Array(numberOfDogs - currentDogNames.length).fill('')]);
    } else if (numberOfDogs < currentDogNames.length) {
      setValue('dogNames', currentDogNames.slice(0, numberOfDogs));
    }
  }, [numberOfDogs, setValue, watch]);

  const handleFormSubmit = async (data: BookingFormData) => {
    // Clear any previous errors
    setBookingError(null);

    try {
      // Check rate limit for bookings
      if (!ErrorTracker.checkRateLimit(`booking-${property.id}`, 5, 300000)) { // 5 attempts per 5 minutes
        throw ErrorTracker.createError(
          'Too many booking attempts. Please wait a few minutes before trying again.',
          'PropertyBookingForm',
          ErrorCategory.RATE_LIMIT
        );
      }

      // Create start and end times by combining the selected date with time slot times
      const startTime = new Date(selectedDate);
      const [startHours, startMinutes] = selectedTimeSlot.startTime.split(':');
      startTime.setHours(parseInt(startHours), parseInt(startMinutes));

      const endTime = new Date(selectedDate);
      const [endHours, endMinutes] = selectedTimeSlot.endTime.split(':');
      endTime.setHours(parseInt(endHours), parseInt(endMinutes));

      // Validate booking times
      if (startTime <= new Date()) {
        throw ErrorTracker.createError(
          'Cannot book a time slot in the past',
          'PropertyBookingForm',
          ErrorCategory.VALIDATION
        );
      }

      // Create the booking with retry logic
      const booking = await ErrorTracker.withRetry(
        async () => {
          const result = await createBooking(property.id, startTime, endTime, {
            numberOfDogs: data.numberOfDogs,
            dogNames: data.dogNames,
            specialRequirements: data.specialRequirements,
          });

          if (!result) {
            throw ErrorTracker.createError(
              'Failed to create booking',
              'PropertyBookingForm',
              ErrorCategory.INTERNAL
            );
          }

          return result;
        },
        'PropertyBookingForm',
        {
          maxAttempts: 3,
          delayMs: 1000,
          backoffFactor: 2,
        }
      );

      // Store the confirmed booking and show the confirmation modal
      setConfirmedBooking(booking);
      setShowConfirmation(true);

      // Call the onSubmit callback with the booking data
      await onSubmit(data);
    } catch (error) {
      const err = error as Error;
      ErrorTracker.logError(err, 'PropertyBookingForm', {
        propertyId: property.id,
        selectedDate: selectedDate.toISOString(),
        timeSlot: selectedTimeSlot,
        numberOfDogs,
      });

      setBookingError(err.message || 'Failed to create booking. Please try again.');
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    onCancel(); // Close the booking form
  };

  return (
    <>
      <div className={cn('bg-white rounded-lg shadow-lg p-6', className)}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Book Your Visit</h3>
          <p className="text-sm text-gray-500 mt-1">
            {format(selectedDate, 'MMMM d, yyyy')} at{' '}
            {formatTimeSlot(selectedTimeSlot.startTime, selectedTimeSlot.endTime)}
          </p>
        </div>

        {bookingError && (
          <BookingError
            message={bookingError}
            onRetry={() => setBookingError(null)}
          />
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Dogs
            </label>
            <select
              {...register('numberOfDogs', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Dog' : 'Dogs'}
                </option>
              ))}
            </select>
            {errors.numberOfDogs && (
              <p className="mt-1 text-sm text-red-600">{errors.numberOfDogs.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Dog Names</label>
            {Array.from({ length: numberOfDogs }).map((_, index) => (
              <div key={index}>
                <input
                  type="text"
                  {...register(`dogNames.${index}`)}
                  placeholder={`Dog ${index + 1} name`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {errors.dogNames?.[index] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dogNames[index]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Special Requirements
            </label>
            <textarea
              {...register('specialRequirements')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Any special requirements or notes..."
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                {...register('agreement')}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <div className="ml-3">
              <label className="text-sm text-gray-500">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  terms and conditions
                </a>{' '}
                and confirm that my dogs are up to date with their vaccinations.
              </label>
              {errors.agreement && (
                <p className="mt-1 text-sm text-red-600">{errors.agreement.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>

      {showConfirmation && confirmedBooking && (
        <BookingConfirmationModal
          booking={confirmedBooking}
          onClose={handleConfirmationClose}
        />
      )}
    </>
  );
}

// Wrap with error boundary
export const PropertyBookingForm = withErrorBoundary('PropertyBookingForm')(PropertyBookingFormContent);
