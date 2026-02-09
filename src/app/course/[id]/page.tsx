
import CourseDetailPublic from "@/src/components/course/course.detail";


export default function CoursePage({ params }: { params: { id: string } }) {


    return (
        <div className="min-h-screen bg-background ">
            <CourseDetailPublic />
        </div>
    )
}