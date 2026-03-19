import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string
  level: number
  xp: number
  current_world: number
  preferred_ai?: 'gemini' | 'deepseek'
}

interface UserState {
  user: User | null
  profile: UserProfile | null
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setPreferredAI: (ai: 'gemini' | 'deepseek') => void
  fetchProfile: (userId: string) => Promise<void>
  signOut: () => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setPreferredAI: async (ai) => {
    set((state) => ({
      profile: state.profile ? { ...state.profile, preferred_ai: ai } : null
    }))
    localStorage.setItem('preferred_ai', ai)
    
    const userId = (await supabase.auth.getUser()).data.user?.id
    if (userId) {
      await supabase.from('profiles').update({ preferred_ai: ai }).eq('id', userId)
    }
  },
  fetchProfile: async (userId) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (!error && data) {
      // Merge with localStorage preference if exists
      const savedAI = localStorage.getItem('preferred_ai') as 'gemini' | 'deepseek' | null
      set({ profile: { ...data, preferred_ai: savedAI || data.preferred_ai || 'deepseek' } })
    }
  },
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  }
}))
