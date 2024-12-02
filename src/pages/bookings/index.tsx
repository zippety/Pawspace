import React from 'react';
import { GetServerSideProps } from 'next';
import { supabase } from '../../utils/supabase';
import { BookingHistory } from '../../components/bookings/BookingHistory';
import { PropertyBooking, Property } from '../../types/property';
import { startTransaction } from '../../utils/sentry';

interface BookingsPageProps {
  bookings: (PropertyBooking & { property: Property })[];
}

export default function BookingsPage({ bookings }: BookingsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookingHistory bookings={bookings} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const transaction = startTransaction({
    name: 'getServerSideProps_bookings',
  });

  try {
    // Get the current user
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) throw authError;

    if (!session) {
      transaction?.setStatus('not_authenticated');
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    // Get the user's bookings with property details
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        property:properties (
          id,
          title,
          address,
          images
        )
      `)
      .eq('userId', session.user.id)
      .order('startTime', { ascending: false });

    if (bookingsError) throw bookingsError;

    transaction?.setStatus('ok');
    return {
      props: {
        bookings: bookings || [],
      },
    };
  } catch (error) {
    transaction?.setStatus('error');
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  } finally {
    transaction?.end();
  }
};
