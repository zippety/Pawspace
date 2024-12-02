import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Property, PropertyBooking } from '../../types/property';
import { useBookingStore } from '../../store/bookingStore';
import { cn } from '../../utils/cn';
import { Calendar, Clock, User, MessageSquare, Check, X, AlertTriangle, RefreshCcw } from 'lucide-react';
import { formatTimeSlot } from '../../utils/availability';
import { BookingCalendar } from '../bookings/BookingCalendar';
import ErrorTracker, { ErrorCategory, withErrorBoundary } from '../../utils/errorTracking';

interface BookingManagementProps {
  property: Property;
  className?: string;
}

type BookingFilter = 'all' | 'pending' | 'confirmed' | 'cancelled';
type BookingSort = 'date-asc' | 'date-desc' | 'status';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="rounded-lg bg-red-50 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <AlertTriangle className="h-5 w-5 text-red-400" />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">Error</h3>
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
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

function BookingManagementContent({ property, className }: BookingManagementProps) {
  const { bookings, fetchPropertyBookings, updateBookingStatus, isLoading } = useBookingStore();
  const [filter, setFilter] = useState<BookingFilter>('all');
  const [sort, setSort] = useState<BookingSort>('date-desc');
  const [selectedBooking, setSelectedBooking] = useState<PropertyBooking | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    try {
      // Check rate limit for fetching bookings
      if (!ErrorTracker.checkRateLimit(`fetch-bookings-${property.id}`, 10, 60000)) { // 10 attempts per minute
        throw ErrorTracker.createError(
          'Too many refresh attempts. Please wait a moment before trying again.',
          'BookingManagement',
          ErrorCategory.RATE_LIMIT
        );
      }

      await ErrorTracker.withRetry(
        async () => {
          await fetchPropertyBookings(property.id);
        },
        'BookingManagement',
        {
          maxAttempts: 3,
          delayMs: 1000,
          backoffFactor: 2,
        }
      );

      setError(null);
    } catch (err) {
      const error = err as Error;
      ErrorTracker.logError(error, 'BookingManagement', {
        action: 'fetchBookings',
        propertyId: property.id,
      });
      setError(error.message || 'Failed to load bookings');
    }
  }, [property.id, fetchPropertyBookings]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleStatusUpdate = async (bookingId: string, status: PropertyBooking['status']) => {
    try {
      // Check rate limit for status updates
      if (!ErrorTracker.checkRateLimit(`update-booking-${bookingId}`, 5, 60000)) { // 5 attempts per minute
        throw ErrorTracker.createError(
          'Too many update attempts. Please wait a moment before trying again.',
          'BookingManagement',
          ErrorCategory.RATE_LIMIT
        );
      }

      await ErrorTracker.withRetry(
        async () => {
          await updateBookingStatus(bookingId, status);
        },
        'BookingManagement',
        {
          maxAttempts: 2,
          delayMs: 1000,
        }
      );

      setSelectedBooking(null);
      setError(null);
    } catch (err) {
      const error = err as Error;
      ErrorTracker.logError(error, 'BookingManagement', {
        action: 'updateStatus',
        bookingId,
        newStatus: status,
      });
      setError(error.message || 'Failed to update booking status');
    }
  };

  const filteredBookings = bookings
    .filter((booking) => {
      if (filter === 'all') return true;
      return booking.status === filter;
    })
    .sort((a, b) => {
      switch (sort) {
        case 'date-asc':
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        case 'date-desc':
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const getStatusIcon = (status: PropertyBooking['status']) => {
    switch (status) {
      case 'confirmed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Bookings</h2>
        <div className="flex space-x-2">
          <button
            className={cn(
              'px-4 py-2 rounded-md',
              view === 'list' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-300'
            )}
            onClick={() => setView('list')}
          >
            List View
          </button>
          <button
            className={cn(
              'px-4 py-2 rounded-md',
              view === 'calendar' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-300'
            )}
            onClick={() => setView('calendar')}
          >
            Calendar View
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadBookings} />}

      {view === 'list' ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as BookingFilter)}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as BookingSort)}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="status">By Status</option>
            </select>
          </div>
        </div>
      ) : null}

      {view === 'list' ? (
        isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No bookings found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className={cn(
                  'bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow',
                  selectedBooking?.id === booking.id && 'ring-2 ring-primary-500'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      <span
                        className={cn('text-sm font-medium', {
                          'text-green-700': booking.status === 'confirmed',
                          'text-red-700': booking.status === 'cancelled',
                          'text-yellow-700': booking.status === 'pending',
                        })}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {format(new Date(booking.startTime), 'MMMM d, yyyy')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {formatTimeSlot(
                          format(new Date(booking.startTime), 'HH:mm'),
                          format(new Date(booking.endTime), 'HH:mm')
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <span className="text-sm">
                        {booking.dogNames.join(', ')} ({booking.numberOfDogs} {booking.numberOfDogs === 1 ? 'dog' : 'dogs'})
                      </span>
                    </div>

                    {booking.specialRequirements && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <MessageSquare className="h-4 w-4 mt-1" />
                        <span className="text-sm">{booking.specialRequirements}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <BookingCalendar bookings={bookings} />
      )}
    </div>
  );
}

// Wrap with error boundary
export const BookingManagement = withErrorBoundary('BookingManagement')(BookingManagementContent);
