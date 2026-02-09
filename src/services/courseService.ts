import api, { authApis, endpoints } from '../utils/api'

export const courseService = {
    getEnrolledCourses: async () => {
        const token = localStorage.getItem('access_token')
        if (!token) throw new Error('No token found')
        const response = await authApis(token).get(endpoints.enrolledCourses || 'enrolled-courses/')
        return response.data
    },

    getCourseDetail: async (courseId: string) => {
        const token = localStorage.getItem('access_token')
        if (!token) throw new Error('No token found')
        const response = await authApis(token).get(`/courses/${courseId}/detail/`)
        return response.data
    },

    getLessonProgress: async (courseId: string) => {
        const token = localStorage.getItem('access_token')
        if (!token) throw new Error('No token found')
        const response = await authApis(token).get(`/lesson-progress/course/${courseId}/`)
        return response.data
    },

    updateLessonProgress: async (lessonId: number, watchTime: number, completionPercentage: number) => {
        const token = localStorage.getItem('access_token')
        if (!token) throw new Error('No token found')
        const response = await authApis(token).post('/lesson-progress/update-progress/', {
            lesson_id: lessonId,
            watch_time: watchTime,
            completion_percentage: completionPercentage
        })
        return response.data
    }
}
