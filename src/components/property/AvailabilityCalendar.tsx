import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ErrorMessage } from '@/components/ui/error-message';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/useToast';
import * as Sentry from '@sentry/nextjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { z } from 'zod';

interface AvailabilityCalendarProps {
  propertyId: string;
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

const availabilitySchema = z.object({
  date: z.string(),
  isAvailable: z.boolean(),
  price: z.number().optional(),
});

type Availability = z.infer<typeof availabilitySchema>;

export function AvailabilityCalendar({ propertyId, onDateSelect, selectedDate }: AvailabilityCalendarProps) {
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch availability data
  const {
    data: availabilityData,
    isLoading,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['availability', propertyId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}/availability`);
        if (!response.ok) {
          throw new Error('Failed to fetch availability');
        }
        const data = await response.json();
        return data.map((item: any) => availabilitySchema.parse(item));
      } catch (err) {
        Sentry.captureException(err, {
          tags: {
            component: 'AvailabilityCalendar',
            action: 'fetchAvailability',
          },
          extra: {
            propertyId,
          },
        });
        throw err;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Update availability mutation
  const updateAvailability = useMutation({
    mutationFn: async ({ date, isAvailable }: { date: Date; isAvailable: boolean }) => {
      try {
        const response = await fetch(`/api/properties/${propertyId}/availability`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: format(date, 'yyyy-MM-dd'),
            isAvailable,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update availability');
        }

        return response.json();
      } catch (err) {
        Sentry.captureException(err, {
          tags: {
            component: 'AvailabilityCalendar',
            action: 'updateAvailability',
          },
          extra: {
            propertyId,
            date: date.toISOString(),
            isAvailable,
          },
        });
        throw err;
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update availability. Please try again.',
        variant: 'destructive',
      });
      setError(error as Error);
    },
    retry: 2,
  });

  // Handle date selection
  const handleDateSelect = async (date: Date) => {
    try {
      await updateAvailability.mutateAsync({
        date,
        isAvailable: true,
      });
      onDateSelect?.(date);
    } catch (err) {
      setError(err as Error);
    }
  };

  // Handle errors
  useEffect(() => {
    if (fetchError) {
      setError(fetchError as Error);
    }
  }, [fetchError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load availability"
        message={error.message}
        onRetry={() => {
          setError(null);
          refetch();
        }}
      />
    );
  }

  return (
    <ErrorBoundary fallback={<ErrorMessage title="Something went wrong" onRetry={() => window.location.reload()} />}>
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) => {
            const availability = availabilityData?.find(
              (a) => format(new Date(a.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
            );
            return availability ? !availability.isAvailable : false;
          }}
          className="rounded-md border"
        />
        {updateAvailability.isLoading && (
          <div className="flex items-center justify-center p-2">
            <Spinner className="h-4 w-4" />
            <span className="ml-2 text-sm text-gray-500">Updating availability...</span>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
