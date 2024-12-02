import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const bookingSchema = z.object({
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  numberOfDogs: z.number().min(1, 'At least one dog is required').max(5, 'Maximum 5 dogs allowed'),
  specialRequirements: z.string().optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  spaceId: string;
  pricePerHour: number;
  onSubmit: (data: BookingFormData) => Promise<void>;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  spaceId,
  pricePerHour,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const numberOfDogs = watch('numberOfDogs') || 1;

  const calculatePrice = () => {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.max(1, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return hours * pricePerHour * numberOfDogs;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Time</label>
        <input
          type="datetime-local"
          {...register('startTime')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
        {errors.startTime && (
          <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">End Time</label>
        <input
          type="datetime-local"
          {...register('endTime')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
        {errors.endTime && (
          <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Dogs</label>
        <select
          {...register('numberOfDogs', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'dog' : 'dogs'}
            </option>
          ))}
        </select>
        {errors.numberOfDogs && (
          <p className="mt-1 text-sm text-red-600">{errors.numberOfDogs.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Special Requirements</label>
        <textarea
          {...register('specialRequirements')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Any special requirements for your dogs..."
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('agreedToTerms')}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label className="ml-2 block text-sm text-gray-900">
          I agree to the terms and conditions
        </label>
      </div>
      {errors.agreedToTerms && (
        <p className="mt-1 text-sm text-red-600">{errors.agreedToTerms.message}</p>
      )}

      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
        <div className="mb-4 text-lg font-semibold">
          Total Price: ${calculatePrice().toFixed(2)}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Booking...' : 'Book Now'}
        </button>
      </div>
    </form>
  );
};
