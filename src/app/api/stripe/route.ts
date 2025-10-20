import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const settingsUrl = process.env.NEXTJS_BASE_URL as string + "/settings";

const pricingTiers = {
  starter: {
    credits: 2000,
    price: 1999, // in cents
  },
  standard: {
    credits: 5000,
    price: 3999, // in cents
  },
  premium: {
    credits: 10000,
    price: 6999, // in cents
  }
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("unauthorised", { status: 401 });
    }

    const body = await req.json();
    const { tier } = body;

    if (!tier || !pricingTiers[tier as keyof typeof pricingTiers]) {
      return new NextResponse("Invalid tier selected", { status: 400 });
    }

    const selectedTier = pricingTiers[tier as keyof typeof pricingTiers];

    // Paid tier handling
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "payment",
      billing_address_collection: "auto",
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: `AiVerse ${tier.charAt(0).toUpperCase() + tier.slice(1)} Credits`,
              description: `${selectedTier.credits} credits for ${tier.charAt(0).toUpperCase() + tier.slice(1)} plan`,
            },
            unit_amount: selectedTier.price, // already in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        credits: selectedTier.credits.toString(),
      },
    } as Stripe.Checkout.SessionCreateParams);

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("StripeError:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}