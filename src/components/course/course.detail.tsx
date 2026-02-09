'use client'

import api, { authApis } from "@/src/utils/api"
import { CourseHeader } from "../course-header"
import { CourseInfo } from "../course-info"
import { LessonList } from "../lesson-list"
import { VideoPlayer } from "../video-player"
import { Button } from "../ui/button"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const CourseDetailPublic = () => {
    const params = useParams()
    const id = params.id as string

    const [course, setCourse] = useState<ICourseDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const [url, setUrl] = useState<string | null>(null)

    useEffect(() => {
        async function fetchCourse() {
            try {
                const token = localStorage.getItem('access_token')
                const res = token
                    ? await authApis(token).get(`/courses/${id}/detail/`)
                    : await api.get(`/courses/${id}/detail/`)
                setCourse(res.data)
                setUrl(res.data.video_url)
            } catch (error) {
                console.error("Error fetching course:", error)
            } finally {
                setLoading(false)
            }
        }
        if (id) {
            fetchCourse()
        }
    }, [id])


    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg">Đang tải khóa học...</p>
        </div>
    }

    if (!course) {
        return <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg">Khóa học không tồn tại hoặc đã bị xóa.</p>
        </div>
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <CourseHeader course={course} />
            <main className="container mx-auto px-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-10 lg:space-y-16">
                        <div className="space-y-6">
                            {url && <VideoPlayer url={url} showProgress={course.is_enrolled} />}
                        </div>

                        <div className="bg-white rounded-3xl p-1 shadow-2xl shadow-slate-200/50">
                            <CourseInfo course={course} />
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 h-fit space-y-8">
                        <LessonList course={course} setUrl={setUrl} />

                    </div>
                </div>
            </main>
        </div>
    )
}

export default CourseDetailPublic
