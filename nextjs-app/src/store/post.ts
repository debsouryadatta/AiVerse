import { ExplorePost } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PostsState {
  posts: ExplorePost[];
  setPosts: (posts: ExplorePost[]) => void; // New function
  clearPosts: () => void;
}

export const useProfilePostsStore = create<PostsState>()(
    persist(
      (set) => ({
        posts: [],
        setPosts: (posts) => set({ posts }), // New function
        clearPosts: () => set({ posts: [] }),
      }),
      {
        name: "profile-posts-storage",
      }
    )
  );