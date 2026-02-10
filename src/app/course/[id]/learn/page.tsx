"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    BookOpen,
    Clock,
    Users,
    ArrowLeft,
    Play,
    CheckCircle,
    Circle,
    Star,
    Award,
    Target,
    TrendingUp,
    MessageSquare,
    Share2
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Progress } from "@/src/components/ui/progress"

import { VideoPlayer } from "@/src/components/video-player"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { LessonProgressItem } from "@/src/components/progress/lesson-progress"

import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Separator } from "@/src/components/ui/separator"
import { CourseProgressIndicator } from "@/src/components/progress/course-progress-indicator"
import { SuccessToast } from "@/src/components/ui/success-toast"

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

interface CourseProgressData {
    id: number
    course: number
    course_name: string
    course_image: string
    total_lessons: number
    completed_lessons: number
    total_watch_time: number
    completion_percentage: number
    last_accessed_at: string | null
    enrolled_at: string
}

interface CourseLearnData {
    course_progress: CourseProgressData
    lesson_progresses: LessonProgressData[]
}

import { useAuthStore } from "@/src/store/useAuthStore"
import { useCourseDetail, useLessonProgress, useUpdateProgress } from "@/src/hooks/useCourses"

export default function CourseLearnPage() {
    const params = useParams()
    const router = useRouter()
    const courseId = params.id as string

    const user = useAuthStore((state) => state.user)
    const isRestoring = useAuthStore((state) => state.isRestoring)

    const { data: courseData, isLoading: courseLoading } = useCourseDetail(courseId)
    const { data: progressData, isLoading: progressLoading } = useLessonProgress(courseId)
    const updateProgressMutation = useUpdateProgress(courseId)

    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)
    const [currentLessonId, setCurrentLessonId] = useState<number | null>(null)

    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [completedLessonName, setCompletedLessonName] = useState("")

    const loading = courseLoading || progressLoading || isRestoring
    const isLecturer = courseData?.lecturer?.id === user?.id
    const isEnrolled = !!progressData || isLecturer

    useEffect(() => {
        if (!isRestoring && !user) {
            router.push('/auth/signin')
        }
    }, [user, isRestoring, router])

    // Auto-select first lesson if none selected
    useEffect(() => {
        if (courseData?.chapters?.length > 0 && !currentLessonId) {
            const firstChapter = courseData.chapters[0]
            if (firstChapter.lessons?.length > 0) {
                const firstLesson = firstChapter.lessons[0]
                setCurrentLessonId(firstLesson.id)
                setCurrentVideoUrl(firstLesson.video_url)

                // Track progress if not already started
                const progress = progressData?.lesson_progresses.find((lp: any) => lp.lesson === firstLesson.id)
                if (!progress || progress.status === 'NOT_STARTED') {
                    updateLessonProgress(firstLesson.id, 0, 0, 'IN_PROGRESS')
                }
            }
        }
    }, [courseData, progressData, currentLessonId])


    const handleLessonClick = (lessonId: number, videoUrl: string) => {
        if (currentLessonId === lessonId) return

        setCurrentLessonId(lessonId)
        setCurrentVideoUrl(videoUrl)

        // Update progress to IN_PROGRESS
        const progress = progressData?.lesson_progresses.find((lp: any) => lp.lesson === lessonId)
        if (!progress || progress.status === 'NOT_STARTED') {
            updateLessonProgress(lessonId, 0, 0, 'IN_PROGRESS')
        }
    }

    const updateLessonProgress = (lessonId: number, watchTime: number, completionPercentage: number, status: string) => {
        updateProgressMutation.mutate({
            lessonId,
            watchTime,
            completionPercentage
        }, {
            onError: (error: any) => {
                console.error("Progress update failed:", error)
            }
        })
    }


    const handleVideoTimeUpdate = (currentTime: number, duration: number) => {
        if (!currentLessonId) return

        const completionPercentage = (currentTime / duration) * 100
        updateLessonProgress(currentLessonId, Math.floor(currentTime), completionPercentage, 'IN_PROGRESS')
    }

    const handleVideoComplete = () => {
        if (!currentLessonId) return
        // Find lesson name for success toast
        const currentLesson = courseData?.chapters
            .flatMap((chapter: any) => chapter.lessons)
            .find((lesson: any) => lesson.id === currentLessonId)

        if (currentLesson) {
            setCompletedLessonName(currentLesson.name)
            setShowSuccessToast(true)
        }

        updateLessonProgress(currentLessonId, 0, 100, 'COMPLETED')
    }

    const handleManualProgress = (percentage: number) => {
        if (!currentLessonId) return

        // Find lesson name for success toast if completed
        if (percentage >= 100) {
            const currentLesson = courseData?.chapters
                .flatMap((chapter: any) => chapter.lessons)
                .find((lesson: any) => lesson.id === currentLessonId)

            if (currentLesson) {
                setCompletedLessonName(currentLesson.name)
                setShowSuccessToast(true)
            }
        }

        updateLessonProgress(currentLessonId, 0, percentage, percentage >= 90 ? 'COMPLETED' : 'IN_PROGRESS')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto animate-ping opacity-20"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Đang tải khóa học...</h3>
                    <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
                </div>
            </div>
        )
    }

    if (!courseData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Khóa học không tồn tại</h2>
                    <p className="text-gray-600 mb-8">Khóa học bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
                    <div className="space-y-3">
                        <Button
                            onClick={() => router.push('/courses')}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                            Quay lại danh sách khóa học
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/')}
                            className="w-full"
                        >
                            Về trang chủ
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (!isEnrolled) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center max-w-lg mx-auto p-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Bạn chưa đăng ký khóa học này</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Vui lòng đăng ký khóa học để có thể truy cập nội dung học tập và theo dõi tiến độ của bạn.
                    </p>
                    <div className="space-y-3">
                        <Button
                            onClick={() => router.push(`/course/${courseId}`)}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                            Xem chi tiết khóa học
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/courses')}
                            className="w-full"
                        >
                            Khám phá khóa học khác
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Enhanced Header */}
            <div className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        <div className="flex items-center gap-3 lg:gap-6 min-w-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.back()}
                                className="h-9 w-9 hover:bg-slate-100 text-slate-600 transition-colors flex-shrink-0"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="hidden sm:flex w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                                    <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-sm lg:text-xl font-black text-slate-900 truncate tracking-tight">{courseData.name}</h1>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none py-0 px-1.5 min-h-[18px] text-[9px] lg:text-[10px] font-black uppercase tracking-wider">
                                            LIVE
                                        </Badge>
                                        <span className="text-[10px] lg:text-sm font-bold text-slate-400 truncate">với {courseData.lecturer?.username || 'Giảng viên'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {progressData && (
                            <div className="flex items-center gap-4 lg:gap-8 flex-shrink-0">
                                <div className="hidden md:block text-right">
                                    <div className="text-sm font-black text-slate-900">
                                        {progressData.course_progress.completed_lessons} / {progressData.course_progress.total_lessons} <span className="text-slate-400 text-xs">BÀI HỌC</span>
                                    </div>
                                    <div className="text-[10px] font-black text-blue-500 flex items-center justify-end gap-1 uppercase tracking-widest">
                                        <TrendingUp className="w-3 h-3" />
                                        {progressData.course_progress.completion_percentage.toFixed(0)}% hoàn thành
                                    </div>
                                </div>
                                <div className="hidden sm:block w-24 lg:w-32">
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${progressData.course_progress.completion_percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/course/${courseId}/forum`)}
                                        className="h-9 font-black text-slate-600 border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all px-3 sm:px-4"
                                    >
                                        <MessageSquare className="w-4 h-4 sm:mr-2" />
                                        <span className="hidden sm:inline">Thảo luận</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 sm:hidden text-slate-400"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Video Player */}
                    <div className="lg:col-span-2 space-y-6">
                        {currentVideoUrl ? (
                            <div className="relative">
                                <VideoPlayer
                                    url={currentVideoUrl}
                                    onTimeUpdate={handleVideoTimeUpdate}
                                    onComplete={handleVideoComplete}
                                    onManualProgress={handleManualProgress}
                                />
                                <div className="absolute top-4 right-4">
                                    <Badge className="bg-black/70 text-white hover:bg-black/80">
                                        <Play className="w-3 h-3 mr-1" />
                                        Đang phát
                                    </Badge>
                                </div>
                            </div>
                        ) : (
                            <Card className="aspect-video flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors duration-300">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse hover:scale-110 transition-transform duration-300">
                                        <Play className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Chọn bài học để bắt đầu</h3>
                                    <p className="text-gray-600 max-w-sm">Nhấn vào bài học bên phải để xem video và bắt đầu hành trình học tập của bạn</p>
                                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </Card>
                        )}
                        {/* Enhanced Course Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-2xl p-5 group hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-slate-900">
                                            {courseData.chapters.reduce((count: number, chapter: any) => count + chapter.lessons.length, 0)}
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bài học</div>
                                    </div>
                                </div>
                            </Card>
                            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-2xl p-5 group hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Clock className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-emerald-900">
                                            {Math.floor(courseData.duration / 60)}<span className="text-xs uppercase ml-0.5">h</span> {courseData.duration % 60}<span className="text-xs uppercase ml-0.5">m</span>
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời lượng</div>
                                    </div>
                                </div>
                            </Card>
                            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-2xl p-5 group hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Users className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-slate-900">
                                            {courseData.students_count?.toLocaleString('vi-VN')}
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Học viên</div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Instructor Info */}
                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-2xl p-6">
                            <div className="flex items-center gap-5">
                                <Avatar className="w-14 h-14 border-2 border-slate-100 shadow-sm">
                                    <AvatarImage src={courseData.lecturer.avatar || ""} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black">
                                        {courseData.lecturer.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className="font-black text-slate-900 truncate tracking-tight">{courseData.lecturer.username}</h4>
                                        <Badge className="bg-blue-50 text-blue-600 border-none py-0 px-2 text-[9px] font-black uppercase tracking-wider">CHUYÊN GIA</Badge>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 4.9 Đánh giá</span>
                                        <span className="hidden sm:inline-block w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span className="flex items-center gap-1 font-bold">15 Khóa học</span>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="hidden sm:flex border-2 border-slate-100 font-bold rounded-xl active:scale-95 transition-all">
                                    Hồ sơ
                                </Button>
                            </div>
                        </Card>
                    </div>
                    {/* Enhanced Lesson List */}
                    <div className="space-y-6">
                        {/* Progress Indicator */}
                        {progressData && (
                            <CourseProgressIndicator
                                completedLessons={progressData.course_progress.completed_lessons}
                                totalLessons={progressData.course_progress.total_lessons}
                                completionPercentage={progressData.course_progress.completion_percentage}
                                totalWatchTime={progressData.course_progress.total_watch_time}
                            />
                        )}

                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 py-6">
                                <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-800 uppercase tracking-tight">
                                    <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                        <Target className="w-4 h-4 text-white" />
                                    </div>
                                    Nội dung khóa học
                                </CardTitle>
                                {progressData && (
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${progressData.course_progress.completion_percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                            {progressData.course_progress.completed_lessons}/{progressData.course_progress.total_lessons} XONG
                                        </span>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto custom-scrollbar">
                                    {courseData.chapters.map((chapter: any, chapterIndex: number) => (
                                        <div key={chapter.id} className="group/chapter">
                                            <div className="flex items-center gap-3 p-4 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm border-b border-slate-100">
                                                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-slate-900 font-black text-xs shadow-sm border border-slate-100">
                                                    {chapterIndex + 1}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-black text-slate-800 text-sm truncate">{chapter.name}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{chapter.lessons.length} bài học</p>
                                                </div>
                                            </div>
                                            <div className="divide-y divide-slate-50">
                                                {chapter.lessons.map((lesson: any) => {
                                                    const lessonProgress = progressData?.lesson_progresses.find(
                                                        (lp: LessonProgressData) => lp.lesson === lesson.id
                                                    )
                                                    const isActive = currentLessonId === lesson.id
                                                    return (
                                                        <div
                                                            key={lesson.id}
                                                            className={`group/lesson p-4 transition-all duration-300 cursor-pointer flex items-center gap-4 relative overflow-hidden ${isActive
                                                                ? 'bg-blue-50/50 border-l-4 border-blue-600'
                                                                : 'bg-white hover:bg-slate-50 border-l-4 border-transparent hover:border-slate-200'
                                                                }`}
                                                            onClick={() => handleLessonClick(lesson.id, lesson.video_url)}
                                                        >
                                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover/lesson:scale-110 ${lessonProgress?.status === 'COMPLETED'
                                                                ? 'bg-emerald-100 text-emerald-600'
                                                                : isActive
                                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                                    : 'bg-slate-100 text-slate-400'
                                                                }`}>
                                                                {lessonProgress?.status === 'COMPLETED' ? (
                                                                    <CheckCircle className="w-4 h-4" />
                                                                ) : isActive ? (
                                                                    <Play className="w-4 h-4 fill-current" />
                                                                ) : (
                                                                    <Play className="w-3.5 h-3.5" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className={`font-bold text-sm truncate transition-colors ${isActive ? 'text-blue-700' : 'text-slate-700 group-hover/lesson:text-slate-900'}`}>
                                                                    {lesson.name}
                                                                </h5>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                        <Clock className="w-3 h-3 text-slate-300" />
                                                                        <span>{Math.floor(lesson.duration / 60) > 0 ? `${Math.floor(lesson.duration / 60)}h ` : ''}{lesson.duration % 60}m</span>
                                                                    </div>
                                                                    {lessonProgress && (
                                                                        <Badge className={`py-0 px-1.5 text-[9px] font-black uppercase tracking-tighter border-none ${lessonProgress.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                                                                            lessonProgress.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' :
                                                                                'bg-slate-100 text-slate-400'
                                                                            }`}>
                                                                            {lessonProgress.status_display}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                {lessonProgress && lessonProgress.completion_percentage > 0 && lessonProgress.status !== 'COMPLETED' && (
                                                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                                                                        <div
                                                                            className="h-full bg-blue-400 transition-all duration-500"
                                                                            style={{ width: `${lessonProgress.completion_percentage}%` }}
                                                                        ></div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <SuccessToast
                isVisible={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
                lessonName={completedLessonName}
                completionPercentage={100}
            />
        </div>
    )
}