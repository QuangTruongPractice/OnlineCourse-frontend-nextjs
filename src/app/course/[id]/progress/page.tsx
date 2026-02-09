import { CourseProgressDashboard } from "@/src/components/progress/courses-progress-dashboard";

const Progress = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-8">
                    <CourseProgressDashboard />
                </div>
            </div>
        </div>
    )
}

export default Progress;