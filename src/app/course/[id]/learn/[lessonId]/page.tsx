
'use client'

import { notFound } from "next/navigation"
import { Chapter, ICourseDetail, Lesson } from "@/src/types/course"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"

async function getCourseDetail(id: string): Promise<ICourseDetail> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}/`)
    if (!res.ok) {
        throw new Error("Failed to fetch course")
    }
    return res.json()
}

async function getLessonDetail(id: string): Promise<Lesson> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${id}/`)
    if (!res.ok) {
        throw new Error("Failed to fetch lesson")
    }
    return res.json()
}

function findAdjacentLessons(chapters: Chapter[], currentLessonId: number) {
    let previousLesson: Lesson | null = null
    let nextLesson: Lesson | null = null
    let found = false

    for (const chapter of chapters) {
        for (let i = 0; i < chapter.lessons.length; i++) {
            if (found && i === 0) {
                nextLesson = chapter.lessons[i]
                break
            }
            if (chapter.lessons[i].id === currentLessonId) {
                found = true
                if (i > 0) {
                    previousLesson = chapter.lessons[i - 1]
                } else if (chapters.indexOf(chapter) > 0) {
                    const prevChapter = chapters[chapters.indexOf(chapter) - 1]
                    previousLesson = prevChapter.lessons[prevChapter.lessons.length - 1]
                }
                if (i < chapter.lessons.length - 1) {
                    nextLesson = chapter.lessons[i + 1]
                } else if (chapters.indexOf(chapter) < chapters.length - 1) {
                    const nextChapter = chapters[chapters.indexOf(chapter) + 1]
                    nextLesson = nextChapter.lessons[0]
                }
                break
            }
            if (!found && i === chapter.lessons.length - 1) {
                previousLesson = chapter.lessons[i]
            }
        }
        if (found && nextLesson) break
    }

    return { previousLesson, nextLesson }
}

interface CourseLessonPageProps {
    params: {
        courseId: string
        lessonId: string
    }
}

export default async function CourseLessonPage({
    params,
}: CourseLessonPageProps) {
    let course: ICourseDetail
    let lesson: Lesson

    try {
        [course, lesson] = await Promise.all([
            getCourseDetail(params.courseId),
            getLessonDetail(params.lessonId),
        ])
    } catch (error) {
        notFound()
    }

    const { previousLesson, nextLesson } = findAdjacentLessons(
        course.chapters,
        parseInt(params.lessonId)
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                        src={lesson.video_url}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                <div>
                    <h1 className="text-2xl font-bold">{lesson.name}</h1>
                    <p className="mt-2 text-muted-foreground">{lesson.description}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                    {previousLesson ? (
                        <Button variant="outline" asChild>
                            <Link
                                href={`/course/${course.id}/learn/${previousLesson.id}`}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                {previousLesson.name}
                            </Link>
                        </Button>
                    ) : (
                        <div />
                    )}
                    {nextLesson ? (
                        <Button asChild>
                            <Link
                                href={`/course/${course.id}/learn/${nextLesson.id}`}
                                className="flex items-center gap-2"
                            >
                                {nextLesson.name}
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link href={`/course/${course.id}/learn`}>
                                Hoàn thành khóa học
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
