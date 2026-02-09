'use client'
import { ICourse } from "@/src/types/course"
import { Card } from "./ui/card"
import Link from "next/link"

interface RelatedCoursesProps {
    courses: ICourse[]
}

export function RelatedCourses({ courses }: RelatedCoursesProps) {
    if (!courses.length) return null

    return (
        <div className="sticky top-4">
            <h3 className="text-xl font-bold mb-4">Khóa học liên quan</h3>
            <div className="space-y-4">
                {courses.map(course => (
                    <Link key={course.id} href={`/course/${course.id}`}>
                        <Card className="hover:bg-accent transition-colors">
                            <div className="p-4">
                                <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                                    <img
                                        src={course.image || "/placeholder.jpg"}
                                        alt={course.name}
                                        className="object-cover"
                                    />
                                </div>

                                <h4 className="font-medium mb-2 line-clamp-2">{course.name}</h4>

                                <div className="text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2 mb-1">
                                        <img
                                            src={course.lecturer.avatar || "/placeholder-user.jpg"}
                                            alt={`${course.lecturer.first_name} ${course.lecturer.last_name}`}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span>{course.lecturer.first_name} {course.lecturer.last_name}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            {course.rating && (
                                                <>
                                                    <span>⭐</span>
                                                    <span>{course.rating.toFixed(1)}</span>
                                                </>
                                            )}
                                        </div>
                                        <span className="font-medium">{parseInt(course.price).toLocaleString()}đ</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
