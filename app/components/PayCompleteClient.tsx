// app/payment/complete/PayCompleteClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  { stripeAccount: process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID }
);

export default function PayCompleteClient() {
  const sp = useSearchParams();
  const clientSecret = sp.get("payment_intent_client_secret");
  const [status, setStatus] = useState<null | string>(null);
  const [message, setMessage] = useState("Checking payment status…");

  useEffect(() => {
    if (!clientSecret) {
      setMessage("Missing client secret in URL.");
      return;
    }
    (async () => {
      const stripe = await stripePromise;
      if (!stripe) {
        setMessage("Stripe failed to initialize.");
        return;
      }
      const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret);
      if (error) {
        setMessage(error.message || "Could not retrieve PaymentIntent.");
        return;
      }
      setStatus(paymentIntent?.status ?? null);
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded — thank you!");
          break;
        case "processing":
          setMessage("Payment processing — we’ll update you shortly.");
          break;
        case "requires_payment_method":
          setMessage("Payment failed or was canceled. Please try again.");
          break;
        default:
          setMessage(`Payment status: ${paymentIntent?.status ?? "unknown"}`);
      }
    })();
  }, [clientSecret]);

  return (
    <div className="mx-auto max-w-xl p-6 space-y-2 pt-20">
      <h1 className="text-2xl font-semibold">Payment Complete</h1>
      <p>{message}</p>
      {status && (
        <p className="text-sm text-gray-600">
          Status: <span className="font-mono">{status}</span>
        </p>
      )}
    </div>
  );
}
