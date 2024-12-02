import React, { useState } from 'react';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { useSession } from '@supabase/auth-helpers-react';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { BookingStatus } from '../../types/booking';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Booking {
  id: string;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  propertyId: string;
  property: {
    name: string;
    images: string[];
  };
  user: {
    name: string;
    email: string;
  };
}

interface BookingCalendarProps {
  bookings: Booking[];
  onUpdateBooking?: (booking: Booking, status: BookingStatus) => Promise<void>;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function BookingCalendar({ bookings, onUpdateBooking }: BookingCalendarProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const session = useSession();

  const events = bookings.map((booking) => ({
    id: booking.id,
    title: `${booking.property.name} - ${booking.status}`,
    start: new Date(booking.startDate),
    end: new Date(booking.endDate),
    resource: booking,
  }));

  const handleSelectEvent = (event: any) => {
    setSelectedBooking(event.resource);
  };

  const handleUpdateStatus = async (status: BookingStatus) => {
    if (selectedBooking && onUpdateBooking) {
      await onUpdateBooking(selectedBooking, status);
      setSelectedBooking(null);
    }
  };

  return (
    <div className="h-[600px] bg-white p-4 rounded-lg shadow">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={Views.MONTH}
        eventPropGetter={(event) => ({
          className: statusColors[event.resource.status],
        })}
      />

      {/* Booking Details Dialog */}
      <Dialog
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {selectedBooking.property.images?.[0] && (
                <img
                  src={selectedBooking.property.images[0]}
                  alt={selectedBooking.property.name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-medium">{selectedBooking.property.name}</h3>
                <Badge variant={selectedBooking.status as any}>
                  {selectedBooking.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p>
                <span className="font-medium">Check-in:</span>{' '}
                {format(new Date(selectedBooking.startDate), 'PPP')}
              </p>
              <p>
                <span className="font-medium">Check-out:</span>{' '}
                {format(new Date(selectedBooking.endDate), 'PPP')}
              </p>
              <p>
                <span className="font-medium">Guest:</span>{' '}
                {selectedBooking.user.name}
              </p>
            </div>

            {onUpdateBooking && selectedBooking.status === 'pending' && (
              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={() => handleUpdateStatus('confirmed')}
                  variant="primary"
                >
                  Confirm Booking
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('cancelled')}
                  variant="destructive"
                >
                  Cancel Booking
                </Button>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
