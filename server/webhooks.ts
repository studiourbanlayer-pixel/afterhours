import Stripe from "stripe";
import { Request, Response } from "express";
import { createBooking } from "./db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[Webhook] Checkout session completed:", session.id);

        if (session.metadata) {
          const booking = await createBooking({
            listingId: parseInt(session.metadata.listingId),
            guestId: parseInt(session.metadata.userId),
            quantity: parseInt(session.metadata.quantity),
            totalAmountCents: parseInt(session.metadata.totalCents),
            commissionCents: parseInt(session.metadata.commissionCents),
            hostPayoutCents: parseInt(session.metadata.hostPayoutCents),
            stripePaymentIntentId: session.payment_intent as string,
            status: "confirmed",
          });
          console.log("[Webhook] Booking created:", booking.id);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Webhook] Payment intent succeeded:", paymentIntent.id);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
