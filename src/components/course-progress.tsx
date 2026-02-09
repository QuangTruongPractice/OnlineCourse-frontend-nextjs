import { Progress } from "./ui/progress"
import { ICourseDetail } from "@/src/types/course"

interface CourseProgressProps {
    course: ICourseDetail
    progress: number
}

export function CourseProgress({ course, progress }: CourseProgressProps) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold">Tiến độ học tập</h3>
                    <p className="text-sm text-muted-foreground">
                        Bạn đã hoàn thành {progress}% khóa học
                    </p>
                </div>
            </div>
            <Progress value={progress} className="h-2" />
        </div>
    )
}
