"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  tier: "starter" | "standard" | "premium";
  isCurrentTier?: boolean;
  credits: number;
  price: number;
}

const SubscriptionButton = ({ tier, isCurrentTier, credits, price }: Props) => {
  const [loading, setLoading] = React.useState(false);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/stripe", {
        tier
      });
      if (typeof window !== 'undefined') {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      disabled={loading}
      onClick={handlePurchase}
      className="w-full"
      variant={isCurrentTier ? "outline" : "default"}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isCurrentTier ? "Current Plan" : price === 0 ? "Get Started" : `Get ${credits} Credits`}
    </Button>
  );
};

export default SubscriptionButton;