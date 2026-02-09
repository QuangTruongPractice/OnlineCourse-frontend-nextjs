import { CourseCreationWizard } from "@/src/components/CreateCourse/course-creation-wizard";

export default function CourseCreationPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-8 max-w-6xl">
                <CourseCreationWizard />
            </div>
        </div>
    )
}
