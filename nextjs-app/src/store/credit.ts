import { ExplorePost } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CreditsState {
  credits: number | null;
  setCredits: (credits: number | null) => void;
  clearCredits: () => void;
}

export const useGlobalCreditsStore = create<CreditsState>()(
    persist(
      (set) => ({
        credits: null,
        setCredits: (credits) => set({ credits }), // New function
        clearCredits: () => set({ credits: null }),
      }),
      {
        name: "global-credits-storage",
      }
    )
  );