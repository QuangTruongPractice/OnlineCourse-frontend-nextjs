import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const endpoints = {
    token: '/o/token/',
    authSocial: '/auth/social/',
    curent_user: 'users/current-user/',

    categories: 'categories/',
    teacher: 'teachers/',

    courses: 'courses/',

    myCourses: 'courses/my-course/',
    coursesDetail: (id: string) => `courses/${id}/`,

    chapters: 'chapters/',

    lessons: 'lessons/',

    enrollments: 'enrollments/',
    courseComplete: 'enrollments/complete/',
    enrollmentsCreate: 'enrollments/create/',

    // Progress tracking endpoints
    lessonProgress: 'lesson-progress/',
    lessonProgressUpdate: 'lesson-progress/update-progress/',
    lessonProgressCourse: (courseId: string) => `lesson-progress/course/${courseId}/`,
    enrolledCourses: 'enrolled-courses/',

    // Forum endpoints
    forums: 'forums/',
    topics: 'topics/',
    comments: 'comments/',
    forumByCourse: (courseId: string) => `forums/?course=${courseId}`,
    topicsByForum: (forumId: string) => `topics/?forum_id=${forumId}`,
    commentsByTopic: (topicId: string) => `comments/?topic_id=${topicId}`,

}

export const authApis = (token: string) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
})
export const getMediaUrl = (url?: string | null) => {
    if (!url) return "/placeholder-user.jpg"
    if (url.startsWith('http') || url.startsWith('blob:')) return url
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

export const handleApiError = (error: any, defaultMessage: string = "Có lỗi xảy ra, vui lòng thử lại sau.") => {
    console.error("API Error:", error)

    let message = defaultMessage

    if (axios.isAxiosError(error)) {
        const data = error.response?.data

        if (data) {
            if (typeof data === 'string') {
                message = data
            } else if (Array.isArray(data)) {
                message = data[0]
            } else if (typeof data === 'object') {
                if (data.detail) {
                    message = data.detail
                } else if (data.non_field_errors) {
                    message = data.non_field_errors[0]
                } else {
                    const firstKey = Object.keys(data)[0]
                    const firstError = data[firstKey]
                    if (Array.isArray(firstError)) message = firstError[0]
                    else if (typeof firstError === 'string') message = firstError
                }
            }
        }
    }

    toast({
        title: "Lỗi",
        description: message,
        variant: "destructive"
    })
}

export const formatDuration = (minutes: number): string => {
    if (!minutes || minutes <= 0) return "Đang cập nhật"
    if (minutes < 60) return `${minutes} phút`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`
}
