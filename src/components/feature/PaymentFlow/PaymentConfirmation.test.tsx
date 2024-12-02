import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentConfirmation } from './PaymentConfirmation';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('PaymentConfirmation', () => {
  const mockProps = {
    bookingId: 'BOOK123',
    spaceTitle: 'Cozy Backyard',
    startTime: '2024-01-01T10:00:00',
    endTime: '2024-01-01T12:00:00',
    totalPrice: 50,
    paymentId: 'PAY123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders booking details correctly', () => {
    render(<PaymentConfirmation {...mockProps} />);

    expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument();
    expect(screen.getByText('BOOK123')).toBeInTheDocument();
    expect(screen.getByText('Cozy Backyard')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
    expect(screen.getByText('PAY123')).toBeInTheDocument();
  });

  it('navigates to dashboard when dashboard button is clicked', () => {
    render(<PaymentConfirmation {...mockProps} />);

    fireEvent.click(screen.getByText('View Dashboard'));
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to spaces when browse more spaces button is clicked', () => {
    render(<PaymentConfirmation {...mockProps} />);

    fireEvent.click(screen.getByText('Browse More Spaces'));
    expect(mockPush).toHaveBeenCalledWith('/spaces');
  });

  it('displays next steps information', () => {
    render(<PaymentConfirmation {...mockProps} />);

    expect(screen.getByText("What's Next?")).toBeInTheDocument();
    expect(screen.getByText(/confirmation email has been sent/i)).toBeInTheDocument();
    expect(screen.getByText(/space owner will be notified/i)).toBeInTheDocument();
  });
});
