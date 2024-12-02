import { create } from 'zustand';
import { startTransaction } from '../utils/sentry';
import { supabase } from '../utils/supabase';
import { PropertyBooking } from '../types/property';
import { sendBookingConfirmationEmail, sendBookingUpdateEmail } from '../utils/email';
import { processPayment, PaymentDetails } from '../services/payment';

interface BookingFormData {
  numberOfDogs: number;
  dogNames: string[];
  specialRequirements?: string;
  paymentDetails: PaymentDetails;
}

interface BookingState {
  bookings: PropertyBooking[];
  isLoading: boolean;
  error: string | null;
  fetchPropertyBookings: (propertyId: string) => Promise<void>;
  createBooking: (
    propertyId: string,
    startTime: Date,
    endTime: Date,
    formData: BookingFormData
  ) => Promise<PropertyBooking>;
  updateBookingStatus: (
    bookingId: string,
    status: PropertyBooking['status']
  ) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchPropertyBookings: async (propertyId: string) => {
    const transaction = startTransaction({
      name: 'fetchPropertyBookings',
      data: { propertyId },
    });

    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('propertyId', propertyId)
        .order('startTime', { ascending: true });

      if (error) throw error;

      set({ bookings: data as PropertyBooking[] });
      transaction?.setStatus('ok');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookings';
      set({ error: errorMessage });
      transaction?.setStatus('error');
      throw error;
    } finally {
      set({ isLoading: false });
      transaction?.end();
    }
  },

  createBooking: async (
    propertyId: string,
    startTime: Date,
    endTime: Date,
    formData: BookingFormData
  ) => {
    const transaction = startTransaction({
      name: 'createBooking',
      data: { propertyId, startTime, endTime, formData },
    });

    try {
      set({ isLoading: true, error: null });

      // Check for booking conflicts
      const { data: existingBookings, error: conflictError } = await supabase
        .from('bookings')
        .select('*')
        .eq('propertyId', propertyId)
        .overlaps('timeRange', `[${startTime.toISOString()}, ${endTime.toISOString()}]`);

      if (conflictError) throw conflictError;
      if (existingBookings && existingBookings.length > 0) {
        throw new Error('This time slot is already booked');
      }

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Get the property details
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (propertyError) throw propertyError;

      // Calculate booking duration in hours
      const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      const totalAmount = durationHours * propertyData.pricePerHour;

      // Process payment
      const paymentResult = await processPayment({
        amount: totalAmount,
        currency: 'USD',
        description: `Booking for ${propertyData.title}`,
        ...formData.paymentDetails,
      });

      if (!paymentResult.success) {
        throw new Error('Payment failed: ' + paymentResult.error);
      }

      const newBooking: Omit<PropertyBooking, 'id'> = {
        propertyId,
        userId: user.id,
        startTime,
        endTime,
        status: 'pending',
        numberOfDogs: formData.numberOfDogs,
        dogNames: formData.dogNames,
        specialRequirements: formData.specialRequirements,
        paymentId: paymentResult.paymentId,
        totalAmount,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([newBooking])
        .select()
        .single();

      if (error) {
        // If booking creation fails, refund the payment
        await processPayment({
          type: 'refund',
          paymentId: paymentResult.paymentId,
          amount: totalAmount,
        });
        throw error;
      }

      const booking = data as PropertyBooking;
      set((state) => ({
        bookings: [...state.bookings, booking],
      }));

      // Send confirmation email
      await sendBookingConfirmationEmail(booking, propertyData, user.email || '');

      transaction?.setStatus('ok');
      return booking;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
      set({ error: errorMessage });
      transaction?.setStatus('error');
      throw error;
    } finally {
      set({ isLoading: false });
      transaction?.end();
    }
  },

  updateBookingStatus: async (bookingId: string, status: PropertyBooking['status']) => {
    const transaction = startTransaction({
      name: 'updateBookingStatus',
      data: { bookingId, status },
    });

    try {
      set({ isLoading: true, error: null });

      // Get the booking and property details
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*, properties(*)')
        .eq('id', bookingId)
        .single();

      if (bookingError) throw bookingError;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('id', bookingData.userId)
        .single();

      if (userError) throw userError;

      const previousStatus = bookingData.status;

      // If cancelling a confirmed booking, process refund
      if (status === 'cancelled' && previousStatus === 'confirmed') {
        await processPayment({
          type: 'refund',
          paymentId: bookingData.paymentId,
          amount: bookingData.totalAmount,
        });
      }

      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status, updatedAt: new Date() })
        .eq('id', bookingId);

      if (updateError) throw updateError;

      const updatedBooking = {
        ...bookingData,
        status,
        updatedAt: new Date(),
      };

      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === bookingId ? updatedBooking : booking
        ),
      }));

      // Send update email
      await sendBookingUpdateEmail(
        updatedBooking,
        bookingData.properties,
        userData.email,
        previousStatus
      );

      transaction?.setStatus('ok');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update booking status';
      set({ error: errorMessage });
      transaction?.setStatus('error');
      throw error;
    } finally {
      set({ isLoading: false });
      transaction?.end();
    }
  },

  cancelBooking: async (bookingId: string) => {
    return get().updateBookingStatus(bookingId, 'cancelled');
  },
}));
