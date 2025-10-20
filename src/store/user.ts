import { User } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface FollowersState {
  followers: User[]
  setFollowers: (followers: User[]) => void  // New function
  clearFollowers: () => void
}

interface FollowingState {
  following: User[]
  setFollowing: (following: User[]) => void  // New function
  clearFollowing: () => void
}

interface ProfileUserState {
  user: User | null
  setUser: (user: User | null) => void  // New function
  clearUser: () => void
}


export const useFollowersStore = create<FollowersState>()(
  persist(
    (set) => ({
      followers: [],
      setFollowers: (followers) => set({ followers }),  // New function
      clearFollowers: () => set({ followers: [] }),
    }),
    {
      name: 'followers-storage',
    }
  )
)

export const useFollowingStore = create<FollowingState>()(
  persist(
    (set) => ({
      following: [],
      setFollowing: (following) => set({ following }),  // New function
      clearFollowing: () => set({ following: [] }),
    }),
    {
      name: 'following-storage',
    }
  )
)

export const useProfileUserStore = create<ProfileUserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),  // New function
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'profile-user-storage',
    }
  )
)

