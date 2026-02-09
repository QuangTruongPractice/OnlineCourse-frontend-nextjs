'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/src/store/useAuthStore'

export default function AuthInitializer() {
    const restoreSession = useAuthStore((state) => state.restoreSession)

    useEffect(() => {
        restoreSession()
    }, [restoreSession])

    return null
}
