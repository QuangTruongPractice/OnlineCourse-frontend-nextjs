import { BookOpen, Calendar, Users, Star, Accessibility, Loader2, GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { useEnrolledCourses } from "../../../hooks/useCourses"
import { useAuthStore } from "../../../store/useAuthStore"
import { getMediaUrl } from "../../../utils/api"

export function EnrolledCourses() {
    const user = useAuthStore((state) => state.user)
    const { data: myCourse = [], isLoading: loading } = useEnrolledCourses()

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-magenta-100 text-magenta-800 dark:bg-magenta-900 dark:text-magenta-300"
            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            case "COMPLETE":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "FAILED":
            case "PAYMENT_FAILED":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }
    }

    return (
        <Card className="shadow-xl bg-white/80">
            {(!loading) ? <>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Khóa học đã đăng ký
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 space-y-4">
                    {myCourse.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground italic">Bạn chưa đăng ký khóa học nào</div>
                    ) : myCourse.map((course: any) => (
                        <div
                            key={course.id}
                            className="flex flex-col sm:flex-row gap-4 p-3 lg:p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                        >
                            <img
                                src={getMediaUrl(course.course?.image)}
                                alt={course.course?.name || "Course image"}
                                className="w-full sm:w-32 lg:w-40 h-32 sm:h-24 rounded-md object-cover flex-shrink-0 shadow-sm"
                            />

                            <div className="flex-1 min-w-0 space-y-2 lg:space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-foreground text-sm lg:text-base line-clamp-2">{course.course?.name}</h3>
                                        <p className="text-xs lg:text-sm text-muted-foreground flex items-center gap-1">
                                            <GraduationCap className="h-3 w-3" />
                                            Giảng viên: {course.course?.lecturer_name}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className={`${getStatusColor(course.status)} text-[10px] lg:text-xs px-2 py-0.5 w-fit h-fit whitespace-nowrap`}>
                                        {course.status_display}
                                    </Badge>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 lg:gap-6 text-[10px] lg:text-xs text-muted-foreground border-t border-muted pt-2">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3 lg:h-4 lg:w-4 text-primary" />
                                        <span>{course.created_at?.split('T')[0]}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="h-3 w-3 lg:h-4 lg:w-4 text-primary" />
                                        <span>{course.course?.total_student || 0} học viên</span>
                                    </div>
                                    <Badge variant="secondary" className="text-[10px] lg:text-xs font-normal">
                                        {course.course?.subject_name}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </> : <>
                <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
            </>}
        </Card>
    )
}
