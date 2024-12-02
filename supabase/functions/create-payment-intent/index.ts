import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.4.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-08-16',
});

serve(async (req) => {
  try {
    const { amount, currency, description, paymentMethodId } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || 'USD',
      description,
      payment_method: paymentMethodId,
      confirm: Boolean(paymentMethodId),
      automatic_payment_methods: paymentMethodId ? undefined : {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
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
