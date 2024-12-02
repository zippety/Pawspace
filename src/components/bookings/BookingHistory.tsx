import React, { useState } from 'react';
import { format, isAfter } from 'date-fns';
import { Property, PropertyBooking } from '../../types/property';
import { cn } from '../../utils/cn';
import { Calendar, Clock, MapPin, Check, X, AlertTriangle } from 'lucide-react';
import { formatTimeSlot } from '../../utils/availability';
import Image from 'next/image';
import Link from 'next/link';

interface BookingHistoryProps {
  bookings: (PropertyBooking & { property: Property })[];
  className?: string;
}

type BookingFilter = 'all' | 'upcoming' | 'past' | 'pending' | 'confirmed' | 'cancelled';
type BookingSort = 'date-asc' | 'date-desc';

export function BookingHistory({ bookings, className }: BookingHistoryProps) {
  const [filter, setFilter] = useState<BookingFilter>('all');
  const [sort, setSort] = useState<BookingSort>('date-desc');

  const filteredBookings = bookings
    .filter((booking) => {
      const isUpcoming = isAfter(new Date(booking.startTime), new Date());

      switch (filter) {
        case 'upcoming':
          return isUpcoming;
        case 'past':
          return !isUpcoming;
        case 'pending':
        case 'confirmed':
        case 'cancelled':
          return booking.status === filter;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return sort === 'date-asc' ? timeA - timeB : timeB - timeA;
    });

  const getStatusBadge = (status: PropertyBooking['status'], isUpcoming: boolean) => {
    const baseClasses = 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium';

    switch (status) {
      case 'confirmed':
        return (
          <span className={cn(baseClasses, 'bg-green-100 text-green-800')}>
            <Check className="h-3 w-3" />
            {isUpcoming ? 'Upcoming' : 'Completed'}
          </span>
        );
      case 'cancelled':
        return (
          <span className={cn(baseClasses, 'bg-red-100 text-red-800')}>
            <X className="h-3 w-3" />
            Cancelled
          </span>
        );
      case 'pending':
        return (
          <span className={cn(baseClasses, 'bg-yellow-100 text-yellow-800')}>
            <AlertTriangle className="h-3 w-3" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">My Bookings</h2>

        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as BookingFilter)}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="all">All Bookings</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
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
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
          <p className="mt-1 text-gray-500">Start exploring properties to make your first booking!</p>
          <div className="mt-6">
            <Link
              href="/properties"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => {
            const isUpcoming = isAfter(new Date(booking.startTime), new Date());

            return (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="relative w-full md:w-48 h-48 md:h-auto">
                    <Image
                      src={booking.property.images[0]?.url || '/placeholder.jpg'}
                      alt={booking.property.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <Link
                            href={`/property/${booking.property.id}`}
                            className="text-lg font-medium text-gray-900 hover:text-primary-600"
                          >
                            {booking.property.title}
                          </Link>
                          {getStatusBadge(booking.status, isUpcoming)}
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{booking.property.address}</span>
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

                        <div>
                          <p className="text-sm text-gray-600">
                            {booking.dogNames.join(', ')} ({booking.numberOfDogs} {booking.numberOfDogs === 1 ? 'dog' : 'dogs'})
                          </p>
                        </div>

                        {booking.specialRequirements && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">{booking.specialRequirements}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/property/${booking.property.id}`}
                          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          View Property
                        </Link>
                        {booking.status === 'confirmed' && isUpcoming && (
                          <button
                            onClick={() => {/* TODO: Implement cancellation */}}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
