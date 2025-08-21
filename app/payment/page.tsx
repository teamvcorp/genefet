"use client";

import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  LinkAuthenticationElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  { stripeAccount: process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID } // <<— IMPORTANT
);


type Mode = "card_now" | "send_link";

export default function PayPage() {
  const [mode, setMode] = useState<Mode>("card_now");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Simple form state
  const [amount, setAmount] = useState<string>("1000"); // 10.00 in minor units
  const [currency, setCurrency] = useState<string>("usd"); // USD for card/Cash App/Link; use EUR for iDEAL/Bancontact/EPS
  const [description, setDescription] = useState<string>("One-time payment");
  const [email, setEmail] = useState<string>("");

  const options = useMemo(
    () =>
      clientSecret
        ? ({
            clientSecret,
            appearance: { labels: "floating" },
          } as const)
        : undefined,
    [clientSecret, currency]
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setCheckoutUrl(null);
    setClientSecret(null);

    try {
      if (mode === "card_now") {
        // Create a PaymentIntent (card-only) with MOTO flag
        const res = await fetch("/api/pay/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(amount),
            currency,
            description,
            customerEmail: email || undefined,
            
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create PaymentIntent");
        setClientSecret(data.clientSecret);
      } else {
        // Create a Checkout Session link to send to the customer
        const res = await fetch("/api/pay/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(amount),
            currency,
            description,
            customerEmail: email || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create Checkout Session");
        setCheckoutUrl(data.url);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6 space-y-6 pt-20">
      <h1 className="text-2xl font-semibold">Take a Payment</h1>

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="mode"
            value="card_now"
            checked={mode === "card_now"}
            onChange={() => setMode("card_now")}
          />
          Enter card now (MOTO)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="mode"
            value="send_link"
            checked={mode === "send_link"}
            onChange={() => setMode("send_link")}
          />
          Send payment link
        </label>
      </div>

      <form onSubmit={handleCreate} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount (minor units)</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 1000 = 10.00"
              className="w-full rounded border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="usd">USD (Cards, Cash App, Link, Klarna, Affirm*)</option>
              <option value="eur">EUR (iDEAL, Bancontact, EPS, Klarna, Affirm*)</option>
              <option value="gbp">GBP (Cards, Klarna, etc.)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Customer Email {mode === "send_link" ? "(to send the link)" : "(for receipt, optional)"}
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : mode === "card_now" ? "Start Card Entry" : "Create Pay Link"}
        </button>
      </form>

      {/* Card entry flow */}
      {clientSecret && mode === "card_now" && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutSection />
        </Elements>
      )}

      {/* Send link flow */}
      {checkoutUrl && mode === "send_link" && (
        <div className="space-y-2 rounded border p-4">
          <div className="font-medium">Payment link created</div>
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline break-all"
          >
            {checkoutUrl}
          </a>
          <div className="text-sm text-gray-600">
            Copy this link into an email/text to the customer. If you provided an email, you can also send it via your mailer.
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(checkoutUrl)}
            className="rounded bg-black px-3 py-2 text-white"
          >
            Copy link
          </button>
        </div>
      )}
    </div>
  );
}

function CheckoutSection() {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/payment/complete`,
      },
    });

    if (error) {
      alert(error.message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Link can show 'Link with Stripe' etc. Keep it for saved wallets. */}
      <LinkAuthenticationElement options={{ defaultValues: { email: "" } }} />
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {submitting ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
