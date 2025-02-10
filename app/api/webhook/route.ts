import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import UpdateUser from "@/firebase/Users/UpdateUser";

export async function POST(req: Request) {
  const body: string = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(`WEBHOOK_ERROR: ${(error as Error).message}`, {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (session?.metadata?.userId) {
      await stripe.subscriptions.update(subscription.id, {
        metadata: {
          userId: session.metadata.userId,
        },
      });
    } else {
      return new NextResponse("UserId is required", { status: 400 });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string
    );

    const userId = subscription.metadata.userId;

    if (!userId) {
      return new NextResponse("UserId is required", { status: 400 });
    }

    await UpdateUser({
      userId,
      data: {
        role: "premium",
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
