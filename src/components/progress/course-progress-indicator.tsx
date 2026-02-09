"use client"

import { Progress } from "@/src/components/ui/progress"
import { Badge } from "@/src/components/ui/badge"
import { CheckCircle, Clock, Target, TrendingUp } from "lucide-react"

interface CourseProgressIndicatorProps {
    completedLessons: number
    totalLessons: number
    completionPercentage: number
    totalWatchTime: number
}

export function CourseProgressIndicator({
    completedLessons,
    totalLessons,
    completionPercentage,
    totalWatchTime
}: CourseProgressIndicatorProps) {
    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-gray-800">Tiến độ khóa học</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {completionPercentage.toFixed(1)}%
                </Badge>
            </div>

            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Hoàn thành</span>
                        <span>{completedLessons}/{totalLessons} bài học</span>
                    </div>
                    <Progress
                        value={completionPercentage}
                        className="h-2 bg-gray-200"
                    />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{completedLessons} bài đã hoàn thành</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{formatTime(totalWatchTime)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
