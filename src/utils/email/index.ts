import sgMail from '@sendgrid/mail';
import Handlebars from 'handlebars';
import { startTransaction } from '../sentry';
import { PropertyBooking, Property } from '../../types/property';
import { format } from 'date-fns';
import { formatTimeSlot } from '../availability';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Email templates using Handlebars
const bookingConfirmationTemplate = Handlebars.compile(`
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .booking-details { background-color: #f9fafb; padding: 20px; border-radius: 8px; }
    .property-image { width: 100%; max-width: 300px; height: auto; border-radius: 8px; }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4f46e5;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 20px;
    }
    .footer { margin-top: 30px; text-align: center; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmation</h1>
      <p>Thank you for booking with PawSpace!</p>
    </div>

    <div class="booking-details">
      <h2>{{property.title}}</h2>
      <p>{{property.address}}</p>

      {{#if property.images.length}}
      <img src="{{property.images.[0].url}}" alt="{{property.title}}" class="property-image">
      {{/if}}

      <h3>Booking Details</h3>
      <p><strong>Date:</strong> {{date}}</p>
      <p><strong>Time:</strong> {{time}}</p>
      <p><strong>Dogs:</strong> {{dogNames}}</p>
      {{#if specialRequirements}}
      <p><strong>Special Requirements:</strong> {{specialRequirements}}</p>
      {{/if}}

      <p><strong>Status:</strong> {{status}}</p>
    </div>

    <div style="text-align: center;">
      <a href="{{viewBookingUrl}}" class="button">View Booking</a>
    </div>

    <div class="footer">
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>© {{year}} PawSpace. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`);

const bookingUpdateTemplate = Handlebars.compile(`
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .status-update {
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      background-color: {{#if approved}}#ecfdf5{{else}}#fef2f2{{/if}};
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4f46e5;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 20px;
    }
    .footer { margin-top: 30px; text-align: center; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Update</h1>
    </div>

    <div class="status-update">
      <h2>Your booking has been {{status}}</h2>
      <p>Property: {{property.title}}</p>
      <p>Date: {{date}}</p>
      <p>Time: {{time}}</p>
    </div>

    <div style="text-align: center;">
      <a href="{{viewBookingUrl}}" class="button">View Booking Details</a>
    </div>

    <div class="footer">
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>© {{year}} PawSpace. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

async function sendEmail({ to, subject, html, from = 'noreply@pawspace.com' }: SendEmailOptions) {
  const transaction = startTransaction({
    name: 'sendEmail',
    data: { to, subject },
  });

  try {
    await sgMail.send({
      to,
      from,
      subject,
      html,
    });

    transaction?.setStatus('ok');
  } catch (error) {
    transaction?.setStatus('error');
    throw error;
  } finally {
    transaction?.end();
  }
}

export async function sendBookingConfirmationEmail(
  booking: PropertyBooking,
  property: Property,
  userEmail: string
) {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  const html = bookingConfirmationTemplate({
    property,
    date: format(startTime, 'MMMM d, yyyy'),
    time: formatTimeSlot(
      format(startTime, 'HH:mm'),
      format(endTime, 'HH:mm')
    ),
    dogNames: booking.dogNames.join(', '),
    specialRequirements: booking.specialRequirements,
    status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
    viewBookingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}`,
    year: new Date().getFullYear(),
  });

  await sendEmail({
    to: userEmail,
    subject: 'Your PawSpace Booking Confirmation',
    html,
  });
}

export async function sendBookingUpdateEmail(
  booking: PropertyBooking,
  property: Property,
  userEmail: string
) {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  const html = bookingUpdateTemplate({
    property,
    date: format(startTime, 'MMMM d, yyyy'),
    time: formatTimeSlot(
      format(startTime, 'HH:mm'),
      format(endTime, 'HH:mm')
    ),
    status: booking.status,
    approved: booking.status === 'confirmed',
    viewBookingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}`,
    year: new Date().getFullYear(),
  });

  await sendEmail({
    to: userEmail,
    subject: `Your PawSpace Booking Has Been ${
      booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
    }`,
    html,
  });
}
