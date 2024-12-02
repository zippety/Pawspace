import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.4.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-08-16',
});

serve(async (req) => {
  try {
    const { paymentId, amount } = await req.json();

    const refund = await stripe.refunds.create({
      payment_intent: paymentId,
      amount: Math.round(amount * 100), // Convert to cents
    });

    return new Response(
      JSON.stringify({
        refundId: refund.id,
        status: refund.status,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
