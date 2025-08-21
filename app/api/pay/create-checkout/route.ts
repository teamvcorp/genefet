import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil", // keep your chosen version
});
const ACCOUNT_ID = process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID!;
const resend = new Resend(process.env.RESEND_API_KEY!);

// Build a safe absolute base URL for success/cancel
async function getBaseUrl() {
  const h = await headers();
  const fromOrigin = h.get("origin");
  if (fromOrigin) return fromOrigin; // includes scheme
  const fromEnv = process.env.APP_URL;
  if (fromEnv) return fromEnv;
  return "http://localhost:3000";
}

export async function POST(req: Request) {
  try {
    const { amount, currency, description, customerEmail } = await req.json();

    if (!amount || !currency) {
      return NextResponse.json({ error: "Missing amount or currency" }, { status: 400 });
    }

    const baseUrl = await getBaseUrl();
    // Validate to avoid Stripe url_invalid
    new URL(baseUrl);

    // Create the Checkout Session on the CONNECTED account
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency,
              product_data: { name: description || "Genefet" },
              unit_amount: amount, // minor units
            },
            quantity: 1,
          },
        ],
        customer_email: customerEmail || undefined,
        allow_promotion_codes: false,
        success_url: `${baseUrl}/pay/complete`,
        cancel_url: `${baseUrl}/pay/complete`,
      },
      { stripeAccount: ACCOUNT_ID }
    );

    // Optionally email the link if you provided an address
    if (customerEmail) {
      // Keep the email simple & resilient (both text & HTML)
      const prettyAmount =
        typeof amount === "number"
          ? `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`
          : `${amount} ${currency.toUpperCase()}`;

      const subject = `Your secure payment link${description ? ` — ${description}` : ""}`;
      const textBody = [
        `Hello,`,
        ``,
        `Please complete your payment${description ? ` for "${description}"` : ""}:`,
        `${session.url}`,
        ``,
        `Amount: ${prettyAmount}`,
        `If you have any questions, just reply to this email.`,
        ``,
        `Thank you!`,
      ].join("\n");

      const htmlBody = `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;">
          <p>Hello,</p>
          <p>Please complete your payment${description ? ` for "<strong>${escapeHtml(description)}</strong>"` : ""}:</p>
          <p><a href="${session.url}" target="_blank" rel="noreferrer" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#000;color:#fff;text-decoration:none;">Open secure payment link</a></p>
          <p style="word-break:break-all;color:#555;margin-top:8px;">Or copy & paste:<br>${session.url}</p>
          <p><strong>Amount:</strong> ${prettyAmount}</p>
          <p>If you have any questions, just reply to this email.</p>
          <p>Thank you!</p>
        </div>
      `;

      // IMPORTANT: "from" must be from your verified domain (fyt4.com)
      await resend.emails.send({
        from: "payments@fyht4.com",            // use an address on your verified domain
        to: customerEmail,
        subject,
        text: textBody,
        html: htmlBody,
        // Optionally:
        // reply_to: "support@fyt4.com",
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error(err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Minimal HTML escaper to avoid breaking the email markup
function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
