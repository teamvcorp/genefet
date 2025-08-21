import { NextResponse } from "next/server";
import Stripe from "stripe";
// ...imports unchanged...

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-07-30.basil" });
const ACCOUNT_ID = process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID!;

export async function POST(req: Request) {
  try {
    const { amount, currency, description, customerEmail } = await req.json();

    if (!amount || !currency) {
      return NextResponse.json({ error: "Missing amount or currency" }, { status: 400 });
    }

    // If you wanted MOTO and it's not enabled, we silently fall back to card-only.
    const useCardOnly = true; // keep the Payment Element limited to cards here

    const params: Stripe.PaymentIntentCreateParams = {
      amount,
      currency,
      description: description || undefined,
      receipt_email: customerEmail || undefined,
      // Limit to cards so the Payment Element shows only card entry
      payment_method_types: useCardOnly ? ["card"] : undefined,
      // Do NOT send `payment_method_options.card.moto` since it's not enabled
      // automatic_payment_methods is omitted when you explicitly set payment_method_types
    };

    const pi = await stripe.paymentIntents.create(params, { stripeAccount: ACCOUNT_ID });
    return NextResponse.json({ clientSecret: pi.client_secret });
  } catch (err: unknown) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
