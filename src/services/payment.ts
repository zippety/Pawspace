import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../utils/supabase';

export interface PaymentDetails {
  paymentMethodId?: string;
  saveCard?: boolean;
  cardholderName?: string;
  billingDetails?: {
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    email: string;
    name: string;
    phone?: string;
  };
}

interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export async function processPayment(params: {
  amount: number;
  currency?: string;
  description?: string;
  type?: 'payment' | 'refund';
  paymentId?: string;
  paymentMethodId?: string;
} & PaymentDetails): Promise<PaymentResult> {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Failed to initialize Stripe');
    }

    // If this is a refund, process it differently
    if (params.type === 'refund' && params.paymentId) {
      const { data, error } = await supabase.functions.invoke('process-refund', {
        body: {
          paymentId: params.paymentId,
          amount: params.amount,
        },
      });

      if (error) throw error;
      return {
        success: true,
        paymentId: data.refundId,
      };
    }

    // Create a payment intent
    const { data: { clientSecret, paymentIntentId }, error: intentError } =
      await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: params.amount,
          currency: params.currency || 'USD',
          description: params.description,
          paymentMethodId: params.paymentMethodId,
        },
      });

    if (intentError) throw intentError;

    // If a payment method was provided, confirm the payment immediately
    if (params.paymentMethodId) {
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: params.paymentMethodId,
        save_payment_method: params.saveCard,
        setup_future_usage: params.saveCard ? 'off_session' : undefined,
      });

      if (confirmError) throw confirmError;

      return {
        success: true,
        paymentId: paymentIntentId,
      };
    }

    // Otherwise, return the client secret for the frontend to handle payment
    return {
      success: true,
      paymentId: paymentIntentId,
      clientSecret,
    };

  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed',
    };
  }
}

export async function getSavedPaymentMethods(): Promise<any[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('get-payment-methods', {
      body: { userId: user.id },
    });

    if (error) throw error;
    return data.paymentMethods;

  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}

export async function deletePaymentMethod(paymentMethodId: string): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('delete-payment-method', {
      body: { paymentMethodId },
    });

    if (error) throw error;
    return true;

  } catch (error) {
    console.error('Error deleting payment method:', error);
    return false;
  }
}
