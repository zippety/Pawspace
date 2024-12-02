import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingForm } from './BookingForm';

describe('BookingForm', () => {
  const mockProps = {
    spaceId: '123',
    pricePerHour: 25,
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<BookingForm {...mockProps} />);

    expect(screen.getByLabelText(/start time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of dogs/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/special requirements/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i agree to the terms/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book now/i })).toBeInTheDocument();
  });

  it('calculates total price correctly', async () => {
    render(<BookingForm {...mockProps} />);

    // Set start time to now and end time to 2 hours later
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    fireEvent.change(screen.getByLabelText(/start time/i), {
      target: { value: now.toISOString().slice(0, 16) },
    });

    fireEvent.change(screen.getByLabelText(/end time/i), {
      target: { value: twoHoursLater.toISOString().slice(0, 16) },
    });

    // Select 2 dogs
    fireEvent.change(screen.getByLabelText(/number of dogs/i), {
      target: { value: '2' },
    });

    // Total should be: 2 hours * $25/hour * 2 dogs = $100
    await waitFor(() => {
      expect(screen.getByText('$100.00')).toBeInTheDocument();
    });
  });

  it('shows validation errors for required fields', async () => {
    render(<BookingForm {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /book now/i }));

    await waitFor(() => {
      expect(screen.getByText(/start time is required/i)).toBeInTheDocument();
      expect(screen.getByText(/end time is required/i)).toBeInTheDocument();
      expect(screen.getByText(/you must agree to the terms/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<BookingForm {...mockProps} />);

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    fireEvent.change(screen.getByLabelText(/start time/i), {
      target: { value: now.toISOString().slice(0, 16) },
    });

    fireEvent.change(screen.getByLabelText(/end time/i), {
      target: { value: twoHoursLater.toISOString().slice(0, 16) },
    });

    fireEvent.change(screen.getByLabelText(/special requirements/i), {
      target: { value: 'My dog needs special attention' },
    });

    fireEvent.click(screen.getByLabelText(/i agree to the terms/i));

    fireEvent.click(screen.getByRole('button', { name: /book now/i }));

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        startTime: now.toISOString().slice(0, 16),
        endTime: twoHoursLater.toISOString().slice(0, 16),
        numberOfDogs: 1,
        specialRequirements: 'My dog needs special attention',
        agreedToTerms: true,
      });
    });
  });
});
