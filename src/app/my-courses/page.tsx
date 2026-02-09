"use client"

import { EnrolledCourses } from "../../components/progress/enrolled-courses"
import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { Suspense } from "react"

export default function MyCoursesPage() {
    return (

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<div>Đang tải danh sách khóa học...</div>}>
                <EnrolledCourses />
            </Suspense>
        </main>

    )
}
