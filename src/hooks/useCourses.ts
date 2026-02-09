import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { courseService } from '../services/courseService'

export const useEnrolledCourses = () => {
    return useQuery({
        queryKey: ['enrolled-courses'],
        queryFn: courseService.getEnrolledCourses,
    })
}

export const useCourseDetail = (courseId: string) => {
    return useQuery({
        queryKey: ['course', courseId],
        queryFn: () => courseService.getCourseDetail(courseId),
        enabled: !!courseId,
    })
}

export const useLessonProgress = (courseId: string) => {
    return useQuery({
        queryKey: ['lesson-progress', courseId],
        queryFn: () => courseService.getLessonProgress(courseId),
        enabled: !!courseId,
    })
}

export const useUpdateProgress = (courseId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ lessonId, watchTime, completionPercentage }: { lessonId: number; watchTime: number; completionPercentage: number }) =>
            courseService.updateLessonProgress(lessonId, watchTime, completionPercentage),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lesson-progress', courseId] })
        },
    })
}
