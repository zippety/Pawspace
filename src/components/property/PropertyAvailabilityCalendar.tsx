import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { Property, PropertyAvailability, PropertyBooking } from '../../types/property';
import { getAvailabilityForDateRange, DayAvailability, TimeSlot, formatTimeSlot } from '../../utils/availability';
import { cn } from '../../utils/cn';
import { PropertyBookingForm } from './PropertyBookingForm';
import { useBookingStore } from '../../store/bookingStore';
import { ErrorBoundary } from '../ErrorBoundary';

interface PropertyAvailabilityCalendarProps {
  property: Property;
  onSelectTimeSlot?: (date: Date, timeSlot: TimeSlot) => void;
  className?: string;
}

export function PropertyAvailabilityCalendar({
  property,
  onSelectTimeSlot,
  className,
}: PropertyAvailabilityCalendarProps) {
  const { fetchPropertyBookings, bookings, isLoading: isLoadingBookings } = useBookingStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [availabilityData, setAvailabilityData] = useState<DayAvailability[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        await fetchPropertyBookings(property.id);
      } catch (err) {
        setError('Failed to load bookings. Please try again later.');
      }
    };
    loadBookings();
  }, [property.id, fetchPropertyBookings]);

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        setIsLoadingTimeSlots(true);
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);

        const availability = getAvailabilityForDateRange(
          monthStart,
          monthEnd,
          property.availability,
          bookings.map(booking => ({
            startTime: new Date(booking.startTime),
            endTime: new Date(booking.endTime)
          }))
        );

        setAvailabilityData(availability);
        setError(null);
      } catch (err) {
        setError('Failed to load availability. Please try again later.');
      } finally {
        setIsLoadingTimeSlots(false);
      }
    };
    loadAvailability();
  }, [currentDate, property.availability, bookings]);

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  const handleTimeSlotSelect = (date: Date, timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    onSelectTimeSlot?.(date, timeSlot);
  };

  const handleBookingCancel = () => {
    setSelectedTimeSlot(null);
  };

  const handleBookingSubmit = async (formData: any) => {
    try {
      // TODO: Implement booking submission through bookingStore
      console.log('Booking submitted:', { date: selectedDate, timeSlot: selectedTimeSlot, formData });
    } catch (err) {
      setError('Failed to submit booking. Please try again later.');
    }
  };

  const renderTimeSlots = (date: Date) => {
    const dayAvailability = availabilityData.find((day) =>
      isSameDay(day.date, date)
    );

    if (!dayAvailability) return null;

    return (
      <div className="mt-4 space-y-2">
        <h4 className="font-medium text-gray-900">Available Time Slots</h4>
        {isLoadingTimeSlots ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          </div>
        ) : dayAvailability.timeSlots.length === 0 ? (
          <p className="text-sm text-gray-500">No available time slots for this date.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {dayAvailability.timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => handleTimeSlotSelect(date, slot)}
                disabled={!slot.isAvailable}
                className={cn(
                  'px-3 py-2 text-sm rounded-md transition-colors',
                  slot.isAvailable
                    ? selectedTimeSlot &&
                      selectedTimeSlot.startTime === slot.startTime &&
                      selectedTimeSlot.endTime === slot.endTime
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                {formatTimeSlot(slot.startTime, slot.endTime)}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-700 hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <ErrorBoundary>
      <div className={cn('space-y-4', className)}>
        {isLoadingBookings ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : selectedTimeSlot && selectedDate ? (
          <PropertyBookingForm
            property={property}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            onSubmit={handleBookingSubmit}
            onCancel={handleBookingCancel}
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handlePreviousMonth}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  aria-label="Previous month"
                >
                  ←
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  aria-label="Next month"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="bg-gray-50 py-2 text-center text-xs font-medium text-gray-700"
                >
                  {day}
                </div>
              ))}
              {days.map((day, dayIdx) => {
                const dayAvailability = availabilityData.find((d) =>
                  isSameDay(d.date, day)
                );
                const isAvailable = dayAvailability && !dayAvailability.isFullyBooked;
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <button
                    key={day.toString()}
                    onClick={() => isAvailable && handleDateSelect(day)}
                    disabled={!isAvailable}
                    className={cn(
                      'relative py-3 bg-white focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary-500',
                      isAvailable ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-not-allowed',
                      isSelected ? 'bg-primary-50' : ''
                    )}
                  >
                    <time
                      dateTime={format(day, 'yyyy-MM-dd')}
                      className={cn(
                        'mx-auto flex h-7 w-7 items-center justify-center rounded-full text-sm',
                        isToday(day) && 'bg-primary-500 text-white',
                        !isToday(day) && isSelected && 'bg-primary-100 text-primary-900',
                        !isToday(day) && !isSelected && isAvailable && 'text-gray-900',
                        !isToday(day) && !isAvailable && 'text-gray-400'
                      )}
                    >
                      {format(day, 'd')}
                    </time>
                  </button>
                );
              })}
            </div>

            {selectedDate && renderTimeSlots(selectedDate)}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
