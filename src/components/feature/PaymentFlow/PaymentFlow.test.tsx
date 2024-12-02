import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentFlow } from './PaymentFlow';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({
    elements: vi.fn(),
    confirmPayment: vi.fn(),
  })),
}));

describe('PaymentFlow', () => {
  const mockProps = {
    bookingDetails: {
      spaceTitle: 'Cozy Backyard',
      startTime: '2024-01-01T10:00:00',
      endTime: '2024-01-01T12:00:00',
      numberOfDogs: 2,
      totalPrice: 50,
    },
    clientSecret: 'test_secret',
    onSuccess: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders booking summary correctly', () => {
    render(<PaymentFlow {...mockProps} />);

    expect(screen.getByText('Cozy Backyard')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    render(<PaymentFlow {...mockProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  // Note: Testing Stripe Elements integration requires more complex setup
  // These tests focus on the component's structure and basic interactions
  it('initializes Stripe with correct configuration', () => {
    render(<PaymentFlow {...mockProps} />);

    expect(loadStripe).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
  });

  it('displays error message when payment fails', async () => {
    const mockStripe = {
      confirmPayment: vi.fn().mockResolvedValue({
        error: { message: 'Payment failed' },
      }),
    };

    render(
      <Elements stripe={mockStripe}>
        <PaymentFlow {...mockProps} />
      </Elements>
    );

    await waitFor(() => {
      expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
    });
  });
});
