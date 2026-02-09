"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Star, Trophy, Sparkles } from "lucide-react"
import { Card, CardContent } from "./card"

interface SuccessToastProps {
    isVisible: boolean
    onClose: () => void
    lessonName: string
    completionPercentage: number
}

export function SuccessToast({ isVisible, onClose, lessonName, completionPercentage }: SuccessToastProps) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (isVisible) {
            setShow(true)
            const timer = setTimeout(() => {
                setShow(false)
                setTimeout(onClose, 300)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isVisible, onClose])

    if (!isVisible) return null

    return (
        <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}>
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 shadow-2xl text-white min-w-[320px]">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1">
                                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-lg">Chúc mừng!</h4>
                            <p className="text-sm text-white/90">
                                Bạn đã hoàn thành bài học "{lessonName}"
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <Trophy className="w-4 h-4 text-yellow-300" />
                                <span className="text-sm font-medium">
                                    {completionPercentage.toFixed(0)}% hoàn thành
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <Star className="w-5 h-5 text-yellow-300 fill-current" />
                            <span className="text-xs">+10 XP</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
