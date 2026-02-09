"use client"

import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
// import { Skeleton } from "./ui/skeleton"
import { BookOpen, Clock, Users } from "lucide-react"
import { authApis, endpoints } from "../../utils/api"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Badge } from "../ui/badge"
import { Skeleton } from "../ui/skeleton"
import { CourseCard } from "./course-progress"
import { useToast } from "../ui/use-toast"
import { useAuthStore } from "../../store/useAuthStore"


interface EnrolledCourse {
    id: number
    course: ICourseDetail
    status: string
    progress: {
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
    created_at: string
}

export function EnrolledCourses() {
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const user = useAuthStore((state) => state.user)
    const isTeacher = user?.userRole?.toLowerCase() === 'teacher'

    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()

    useEffect(() => {
        const status = searchParams.get('status')
        if (status === 'success') {
            toast({
                title: "Thanh toán thành công!",
                description: "Khóa học đã được thêm vào tài khoản của bạn. Chúc bạn học tốt!",
                variant: "default",
            })
            // Xóa query param để tránh toast lặp lại
            router.replace('/my-courses')
        } else if (status === 'failed') {
            toast({
                title: "Thanh toán thất bại",
                description: "Giao dịch không thành công. Vui lòng thử lại sau.",
                variant: "destructive",
            })
            router.replace('/my-courses')
        }
    }, [searchParams, toast, router])

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('access_token')
                if (!token) {
                    router.push('/auth/signin')
                    return
                }

                const endpoint = isTeacher ? endpoints.myCourses : (endpoints.enrolledCourses || 'enrolled-courses/')
                const response = await authApis(token).get(endpoint)

                // Handle paginated vs non-paginated response
                const data = response.data.results || response.data
                setCourses(data)
            } catch (error) {
                console.error('Error fetching courses:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()
    }, [router, isTeacher])

    const handleContinueCourse = (courseId: number) => {
        router.push(`/course/${courseId}/learn`)
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Khóa học của tôi</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/4" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-3 w-full" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (courses.length === 0) {
        return (
            <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học nào</h3>
                <p className="text-gray-500 mb-6">
                    {isTeacher
                        ? "Bạn chưa đăng tải khóa học nào. Hãy bắt đầu chia sẻ kiến thức ngay!"
                        : "Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học mới!"}
                </p>
                <button
                    onClick={() => router.push(isTeacher ? '/create-course' : '/courses')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {isTeacher ? "Tạo khóa học mới" : "Khám phá khóa học"}
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                            {isTeacher ? "Khóa học đã đăng" : "Khóa học của tôi"}
                        </h2>
                    </div>
                    <p className="text-slate-500 font-medium pl-11">
                        {isTeacher
                            ? "Quản lý các khóa học bạn đang giảng dạy"
                            : "Tiếp tục hành trình chinh phục kiến thức của bạn"}
                    </p>
                </div>
                <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-2 font-black text-xs uppercase tracking-wider self-start sm:self-center">
                    {courses.length} {isTeacher ? "Khóa học" : "Khóa học"}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((item) => {
                    const course = isTeacher ? item : item.course
                    const progress = isTeacher ? 100 : (item.progress?.completion_percentage || 0)

                    return (
                        <CourseCard
                            key={item.id}
                            course={course}
                            progress={progress}
                            isTeacher={isTeacher}
                        />
                    )
                })}
            </div>
        </div>
    )
}
