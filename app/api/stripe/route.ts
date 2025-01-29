import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { headers } from "next/headers";

const cancelUrl = absoluteUrl("/dashboard");
const successUrl = absoluteUrl("/dashboard");

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    const headersList = headers();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const countryCode = headersList.get("x-vercel-ip-country") || "US";
    const isBrazil = countryCode === "BR";

    console.log("IS BRAZIL", isBrazil);

    const currency = isBrazil ? "BRL" : "USD";
    const unitAmount = isBrazil ? 5000 : 1000;

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Ezydata",
              description: "AI-powered low code platform for data analysts.",
            },
            unit_amount: unitAmount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.error("STRIPE_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
