import { PropertyAvailability } from '../types/property';
import {
  startOfWeek,
  addDays,
  format,
  parse,
  isWithinInterval,
  eachDayOfInterval,
  addWeeks,
  isSameDay,
} from 'date-fns';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DayAvailability {
  date: Date;
  timeSlots: TimeSlot[];
  isFullyBooked: boolean;
}

export function getAvailabilityForDateRange(
  startDate: Date,
  endDate: Date,
  availability: PropertyAvailability[],
  existingBookings: Array<{ startTime: Date; endTime: Date }> = []
): DayAvailability[] {
  const days: DayAvailability[] = [];
  const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });

  daysInRange.forEach((date) => {
    const dayOfWeek = date.getDay();
    const dayAvailability = availability.filter((slot) => slot.dayOfWeek === dayOfWeek);

    const timeSlots = dayAvailability.map((slot) => {
      const slotStart = parse(slot.startTime, 'HH:mm', date);
      const slotEnd = parse(slot.endTime, 'HH:mm', date);

      // Check if the slot is booked
      const isBooked = existingBookings.some((booking) =>
        isWithinInterval(slotStart, {
          start: booking.startTime,
          end: booking.endTime,
        }) ||
        isWithinInterval(slotEnd, {
          start: booking.startTime,
          end: booking.endTime,
        })
      );

      return {
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable && !isBooked,
      };
    });

    days.push({
      date,
      timeSlots,
      isFullyBooked: timeSlots.every((slot) => !slot.isAvailable),
    });
  });

  return days;
}

export function getNextAvailableSlots(
  availability: PropertyAvailability[],
  existingBookings: Array<{ startTime: Date; endTime: Date }> = [],
  weeksToCheck = 4
): DayAvailability[] {
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 });
  const endDate = addWeeks(startOfCurrentWeek, weeksToCheck);

  return getAvailabilityForDateRange(today, endDate, availability, existingBookings);
}

export function formatTimeSlot(startTime: string, endTime: string): string {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const period = Number(hours) >= 12 ? 'PM' : 'AM';
    const hour = Number(hours) % 12 || 12;
    return `${hour}${minutes === '00' ? '' : `:${minutes}`}${period}`;
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

export function isSlotAvailable(
  date: Date,
  startTime: string,
  endTime: string,
  availability: PropertyAvailability[],
  existingBookings: Array<{ startTime: Date; endTime: Date }> = []
): boolean {
  const dayOfWeek = date.getDay();
  const dayAvailability = availability.find(
    (slot) => slot.dayOfWeek === dayOfWeek &&
    slot.startTime === startTime &&
    slot.endTime === endTime
  );

  if (!dayAvailability || !dayAvailability.isAvailable) {
    return false;
  }

  const slotStart = parse(startTime, 'HH:mm', date);
  const slotEnd = parse(endTime, 'HH:mm', date);

  return !existingBookings.some(
    (booking) =>
      isWithinInterval(slotStart, {
        start: booking.startTime,
        end: booking.endTime,
      }) ||
      isWithinInterval(slotEnd, {
        start: booking.startTime,
        end: booking.endTime,
      })
  );
}

export function generateTimeSlots(
  startTime: string = '09:00',
  endTime: string = '17:00',
  intervalMinutes: number = 60
): string[] {
  const slots: string[] = [];
  const start = parse(startTime, 'HH:mm', new Date());
  const end = parse(endTime, 'HH:mm', new Date());

  let current = start;
  while (current < end) {
    slots.push(format(current, 'HH:mm'));
    current = addDays(current, intervalMinutes / (24 * 60));
  }

  return slots;
}
