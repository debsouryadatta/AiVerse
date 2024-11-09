"use server";

import { prisma } from "@/lib/db";

export const checkSubscriptionAction = async(userId: string) => {

    const DAY_IN_MS = 1000 * 60 * 60 * 24;

    try {
        const userSubscription = await prisma.userSubscription.findUnique({
          where: {
            userId: userId,
          },
        });
        if (!userSubscription) {
          return false;
        }
      
        const isValid =
          userSubscription.stripePriceId &&
          userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
            Date.now();
      
        return !!isValid;
    } catch (error) {
        console.log(error);
        throw error;
    }
}