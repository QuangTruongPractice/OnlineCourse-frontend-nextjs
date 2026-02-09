import { Card } from "./ui/card"
import { Chapter, Lesson } from "@/src/types/course"
import { CheckCircle, Play } from "lucide-react"
import Link from "next/link"

interface CourseLessonsProps {
    courseId: number
    chapters: Chapter[]
    completedLessons: number[]
}

export function CourseLessons({ courseId, chapters, completedLessons }: CourseLessonsProps) {
    return (
        <div className="space-y-4">
            {chapters.map((chapter, chapterIndex) => (
                <Card key={chapter.id} className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                        Chương {chapterIndex + 1}: {chapter.name}
                    </h3>
                    {chapter.description && (
                        <p className="text-sm text-muted-foreground mb-4">{chapter.description}</p>
                    )}
                    <div className="space-y-2">
                        {chapter.lessons.map((lesson) => (
                            <Link
                                key={lesson.id}
                                href={`/course/${courseId}/learn/${lesson.id}`}
                                className="flex items-center justify-between p-2 hover:bg-accent rounded-lg group"
                            >
                                <div className="flex items-center gap-3">
                                    {completedLessons.includes(lesson.id) ? (
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                    ) : (
                                        <Play className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    )}
                                    <div>
                                        <div className="font-medium group-hover:text-primary transition-colors">
                                            {lesson.name}
                                        </div>
                                        {lesson.description && (
                                            <div className="text-sm text-muted-foreground">
                                                {lesson.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}
                                </div>
                            </Link>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    )
}
