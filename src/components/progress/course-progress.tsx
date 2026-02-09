"use client"

import Link from "next/link"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { BookOpen, Clock } from "lucide-react"
import { getMediaUrl, formatDuration } from "../../utils/api"

interface CourseCardProps {
    course: ICourseDetail
    progress?: number
    isTeacher?: boolean
}

export function CourseCard({ course, progress = 0, isTeacher = false }: CourseCardProps) {
    const totalLessonsCount = course.lessons_count || 0

    return (
        <Link href={`/course/${course.id}/learn`} className="group">
            <Card className="w-full border-none shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform group-hover:-translate-y-1">
                <CardContent className="p-0">
                    <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100">
                        <img
                            src={getMediaUrl(course?.image || course?.thumbnail_url)}
                            alt={course.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                            <Badge className="bg-white/90 backdrop-blur-md text-blue-600 border-none font-black text-[10px] uppercase px-2 py-1">
                                Tiếp tục học
                            </Badge>
                        </div>
                    </div>

                    <div className="p-5 space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {course.name}
                            </h3>
                            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                                {course.description}
                            </p>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider">
                                <span className="text-slate-400">
                                    {isTeacher ? "Tổng số học sinh" : "Tiến độ"}
                                </span>
                                <span className="text-blue-600">
                                    {isTeacher ? course.students_count : `${Math.round(progress)}%`}
                                </span>
                            </div>
                            {!isTeacher && (
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>


                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                <BookOpen className="w-4 h-4 text-blue-500" />
                                <span>{totalLessonsCount} bài học</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span>{formatDuration(course.duration)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

