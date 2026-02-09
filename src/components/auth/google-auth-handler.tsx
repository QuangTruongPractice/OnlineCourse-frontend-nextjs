'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAuthStore } from '@/src/store/useAuthStore'
import { useRouter } from 'next/navigation'

export default function GoogleAuthHandler() {
    const { data: session, status } = useSession()
    const login = useAuthStore((state) => state.login)
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated' && session?.accessToken && session?.user) {
            console.log('>>> Google auth session detected, saving to store and redirecting')

            // Login via store (handles token saving)
            login(session.user, session.accessToken)

            // Redirect về trang chủ
            router.push('/')
        }
    }, [session, status, login, router])

    // Component này không render gì, chỉ xử lý logic
    return null
}
