import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  spaceId: string;
  spaceTitle: string;
  spaceImage: string;
  startTime: string;
  endTime: string;
  numberOfDogs: number;
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface BookingHistoryProps {
  userId: string;
}

export const BookingHistory: React.FC<BookingHistoryProps> = ({ userId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/users/${userId}/bookings`);
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  const filteredBookings = bookings.filter(
    (booking) => filter === 'all' || booking.status === filter
  );

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Bookings</h2>
        <div className="flex space-x-2">
          {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-6"
            >
              <img
                src={booking.spaceImage}
                alt={booking.spaceTitle}
                className="w-24 h-24 rounded-lg object-cover"
              />

              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{booking.spaceTitle}</h3>
                <div className="text-gray-600 space-y-1 mt-2">
                  <p>
                    {format(new Date(booking.startTime), 'PPP')} -{' '}
                    {format(new Date(booking.endTime), 'p')}
                  </p>
                  <p>{booking.numberOfDogs} dogs</p>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                <p className="mt-2 text-lg font-semibold">
                  ${booking.totalPrice.toFixed(2)}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  className="px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                  onClick={() => {
                    // TODO: Implement view details
                    console.log('View booking details:', booking.id);
                  }}
                >
                  View Details
                </button>
                {booking.status === 'upcoming' && (
                  <button
                    className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                    onClick={() => {
                      // TODO: Implement cancellation
                      console.log('Cancel booking:', booking.id);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
