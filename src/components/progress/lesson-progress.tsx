"use client"

import { useState, useEffect } from "react"
import { Play, Pause, CheckCircle, Clock, Lock } from "lucide-react"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"

interface LessonProgressData {
    id: number
    lesson: number
    lesson_name: string
    lesson_duration: number
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED'
    status_display: string
    started_at: string | null
    completed_at: string | null
    watch_time: number
    last_watched_at: string | null
    completion_percentage: number
}

interface LessonProgressProps {
    lesson: LessonProgressData
    onPlay: (lessonId: number) => void
    isActive: boolean
}

export function LessonProgressItem({ lesson, onPlay, isActive }: LessonProgressProps) {
    const getStatusIcon = () => {
        switch (lesson.status) {
            case 'COMPLETED':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'IN_PROGRESS':
                return <Play className="w-4 h-4 text-blue-500" />
            case 'PAUSED':
                return <Pause className="w-4 h-4 text-yellow-500" />
            default:
                return <Lock className="w-4 h-4 text-gray-400" />
        }
    }

    const getStatusBadge = () => {
        switch (lesson.status) {
            case 'COMPLETED':
                return <Badge variant="default" className="bg-green-500">Hoàn thành</Badge>
            case 'IN_PROGRESS':
                return <Badge variant="default" className="bg-blue-500">Đang học</Badge>
            case 'PAUSED':
                return <Badge variant="secondary" className="bg-yellow-500">Tạm dừng</Badge>
            default:
                return <Badge variant="outline">Chưa bắt đầu</Badge>
        }
    }

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        {getStatusIcon()}
                        <div>
                            <h4 className="font-medium text-sm">{lesson.lesson_name}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{formatDuration(lesson.lesson_duration)}</span>
                            </div>
                        </div>
                    </div>
                    {getStatusBadge()}
                </div>

                {lesson.status !== 'NOT_STARTED' && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>Tiến độ: {lesson.completion_percentage.toFixed(1)}%</span>
                            <span>Đã xem: {formatTime(lesson.watch_time)}</span>
                        </div>
                        <Progress
                            value={lesson.completion_percentage}
                            className="h-2"
                        />
                    </div>
                )}

                <div className="mt-3 flex justify-between items-center">
                    <Button
                        size="sm"
                        variant={isActive ? "default" : "outline"}
                        onClick={() => onPlay(lesson.lesson)}
                        className="text-xs"
                    >
                        {isActive ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                        {isActive ? 'Đang phát' : 'Phát'}
                    </Button>

                    {lesson.last_watched_at && (
                        <span className="text-xs text-gray-500">
                            Lần cuối: {new Date(lesson.last_watched_at).toLocaleDateString('vi-VN')}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
