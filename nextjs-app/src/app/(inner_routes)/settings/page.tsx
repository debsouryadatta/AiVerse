// import SubscriptionButton from "@/components/SubscriptionButton";
import { auth } from "@/lib/auth";
import React from "react";
import { checkSubscriptionAction } from "./actions";
import SubscriptionButton from "@/components/settings/SubscriptionButton";


export default async function page(){
  const session = await auth();

  const isPro = await checkSubscriptionAction(session?.user?.id!);

  return (
    <div className="py-8 mx-auto max-w-7xl h-[60vh]">
      <h1 className="text-3xl font-bold">Settings</h1>
      {isPro ? (
        <p className="text-xl text-secondary-foreground/60">
          You are a pro user!
        </p>
      ) : (
        <p className="text-xl text-secondary-foreground/60">
          You are a free user
        </p>
      )}

      <SubscriptionButton isPro={isPro} />
    </div>
  );
};
