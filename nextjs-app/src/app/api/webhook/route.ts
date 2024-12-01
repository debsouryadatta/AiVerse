import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  console.log("Webhook called");
  try {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error: any) {
      return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
      if (!session?.metadata?.userId || !session?.metadata?.credits) {
        return new NextResponse("Missing metadata", { status: 400 });
      }

      // Create purchase record and update user's credits
      await prisma.$transaction(async (tx) => {
        // Create purchase record
        await tx.userPurchase.create({
          data: {
            userId: session?.metadata?.userId!,
            creditsAmount: parseInt(session?.metadata?.credits!),
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency?.toUpperCase() ?? "USD",
            status: session.status ?? "succeeded",
            stripePaymentIntentId: session.payment_intent as string,
            stripePaymentIntentStatus: "succeeded"
          },
        });

        // Update user's credits
        await tx.user.update({
          where: {
            id: session?.metadata?.userId!,
          },
          data: {
            credits: {
              increment: parseInt(session?.metadata?.credits!),
            },
          },
        });
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}