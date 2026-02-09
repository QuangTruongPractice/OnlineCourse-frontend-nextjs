import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authApis, endpoints } from '../utils/api'

interface AuthState {
    user: any | null
    isRestoring: boolean
    login: (userData: any, token: string) => void
    logout: () => void
    restoreSession: () => Promise<void>
    updateUser: (userData: any) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isRestoring: true,

            login: (userData, token) => {
                localStorage.setItem('access_token', token)
                set({ user: userData, isRestoring: false })
            },

            logout: () => {
                localStorage.removeItem('access_token')
                set({ user: null, isRestoring: false })
            },

            updateUser: (userData) => {
                set({ user: userData })
            },

            restoreSession: async () => {
                const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
                if (!token) {
                    set({ user: null, isRestoring: false })
                    return
                }

                try {
                    const response = await authApis(token).get(endpoints.curent_user)
                    set({ user: response.data, isRestoring: false })
                } catch (error) {
                    console.error('Failed to restore session:', error)
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('access_token')
                    }
                    set({ user: null, isRestoring: false })
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user }), // Only persist user for now if needed, though we rely on token
        }
    )
)
