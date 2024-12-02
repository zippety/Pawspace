import { Property, PropertyBooking } from '../types/property';
import { format } from 'date-fns';
import { formatTimeSlot } from './availability';
import { supabase } from './supabase';

interface EmailTemplate {
  subject: string;
  body: string;
}

function generateBookingConfirmationTemplate(
  booking: PropertyBooking,
  property: Property
): EmailTemplate {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  return {
    subject: `Booking Confirmation - ${property.title}`,
    body: `
      <h1>Your Booking is Confirmed!</h1>

      <h2>Booking Details</h2>
      <p><strong>Property:</strong> ${property.title}</p>
      <p><strong>Date:</strong> ${format(startTime, 'MMMM d, yyyy')}</p>
      <p><strong>Time:</strong> ${formatTimeSlot(
        format(startTime, 'HH:mm'),
        format(endTime, 'HH:mm')
      )}</p>
      <p><strong>Dogs:</strong> ${booking.dogNames.join(', ')}</p>
      ${booking.specialRequirements ?
        `<p><strong>Special Requirements:</strong> ${booking.specialRequirements}</p>` :
        ''}

      <h2>Property Details</h2>
      <p><strong>Address:</strong> ${property.location.address}</p>
      <p><strong>Price:</strong> $${property.pricePerHour}/hour</p>

      <h2>Important Information</h2>
      <ul>
        ${property.rules.vaccineRequired ?
          '<li>Please bring proof of vaccination for your dogs</li>' :
          ''}
        ${property.rules.spayNeuterRequired ?
          '<li>Please note that all dogs must be spayed/neutered</li>' :
          ''}
        ${property.rules.additionalRules?.map(rule => `<li>${rule}</li>`).join('') || ''}
      </ul>

      <p>The property owner will review your booking and confirm it shortly.</p>

      <p>Thank you for choosing PawSpace!</p>
    `
  };
}

function generateBookingUpdateTemplate(
  booking: PropertyBooking,
  property: Property,
  previousStatus: string
): EmailTemplate {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  const statusMessages = {
    confirmed: 'Great news! Your booking has been confirmed by the property owner.',
    cancelled: 'Your booking has been cancelled.',
    pending: 'Your booking status has been updated to pending.',
  };

  return {
    subject: `Booking Update - ${property.title}`,
    body: `
      <h1>Booking Status Update</h1>

      <p>${statusMessages[booking.status as keyof typeof statusMessages]}</p>

      <h2>Booking Details</h2>
      <p><strong>Property:</strong> ${property.title}</p>
      <p><strong>Date:</strong> ${format(startTime, 'MMMM d, yyyy')}</p>
      <p><strong>Time:</strong> ${formatTimeSlot(
        format(startTime, 'HH:mm'),
        format(endTime, 'HH:mm')
      )}</p>
      <p><strong>Previous Status:</strong> ${previousStatus}</p>
      <p><strong>New Status:</strong> ${booking.status}</p>

      ${booking.status === 'confirmed' ? `
        <h2>Next Steps</h2>
        <ul>
          <li>Save this booking to your calendar</li>
          <li>Review the property rules and requirements</li>
          <li>Prepare any necessary documentation (vaccination records, etc.)</li>
        </ul>
      ` : ''}

      <p>If you have any questions, please don't hesitate to contact us.</p>
    `
  };
}

export async function sendBookingConfirmationEmail(
  booking: PropertyBooking,
  property: Property,
  userEmail: string
): Promise<void> {
  const template = generateBookingConfirmationTemplate(booking, property);

  // Send email using Supabase Edge Functions
  const { error } = await supabase.functions.invoke('send-email', {
    body: {
      to: userEmail,
      subject: template.subject,
      html: template.body,
    },
  });

  if (error) {
    console.error('Failed to send confirmation email:', error);
    throw error;
  }
}

export async function sendBookingUpdateEmail(
  booking: PropertyBooking,
  property: Property,
  userEmail: string,
  previousStatus: string = 'pending'
): Promise<void> {
  const template = generateBookingUpdateTemplate(booking, property, previousStatus);

  // Send email using Supabase Edge Functions
  const { error } = await supabase.functions.invoke('send-email', {
    body: {
      to: userEmail,
      subject: template.subject,
      html: template.body,
    },
  });

  if (error) {
    console.error('Failed to send update email:', error);
    throw error;
  }
}
