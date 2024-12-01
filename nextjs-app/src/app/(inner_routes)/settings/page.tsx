import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Check, Coins } from "lucide-react";
import SubscriptionButton from "@/components/settings/SubscriptionButton";
import { cn } from "@/utils/cn";

const creditPackages = {
  starter: {
    credits: 2000,
    price: 19.99
  },
  standard: {
    credits: 5000,
    price: 39.99
  },
  premium: {
    credits: 10000,
    price: 69.99
  }
};

export default async function page() {
  const session = await auth();
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) return null;

  const creditsPerDollar = (packageData: typeof creditPackages[keyof typeof creditPackages]) => {
    return (packageData.credits / packageData.price).toFixed(0);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100 sm:text-4xl">
            Buy Credits
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-zinc-800">
            <Coins className="w-5 h-5 text-blue-500" />
            <span className="text-lg text-gray-900 dark:text-zinc-100 font-medium">
              {user.credits} credits available
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {Object.entries(creditPackages).map(([packageName, packageData]) => (
            <div
              key={packageName}
              className={cn(
                "rounded-lg overflow-hidden",
                "bg-white dark:bg-zinc-800",
                "border border-gray-200 dark:border-zinc-700",
                "shadow-sm hover:shadow-md transition-shadow duration-200"
              )}
            >
              <div className="relative px-6 py-8 sm:p-10">
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 capitalize">
                      {packageName}
                    </h3>
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100">
                      {creditsPerDollar(packageData)} credits/$
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline text-gray-900 dark:text-zinc-100">
                      <span className="text-5xl font-extrabold tracking-tight">
                        {packageData.credits.toLocaleString()}
                      </span>
                      <span className="ml-2 text-xl text-gray-500 dark:text-zinc-400">credits</span>
                    </div>
                    <p className="mt-2 text-lg text-gray-500 dark:text-zinc-400">
                      ${packageData.price}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="mt-8">
                    <SubscriptionButton
                      tier={packageName as "starter" | "standard" | "premium"}
                      isCurrentTier={false}
                      credits={packageData.credits}
                      price={packageData.price}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
