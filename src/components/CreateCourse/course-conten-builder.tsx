"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Plus, Video, FileText, GripVertical, Edit, Trash2, Upload, Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface CourseContentBuilderProps {
    data: any
    onUpdate: (data: any) => void
}

interface Lesson {
    id: string
    name: string
    description?: string
    type: string
    video_url?: string
    duration?: number
    order: number
}

interface Chapter {
    id: string
    name: string
    description: string
    lessons: Lesson[]
    order: number
}

const infoLesson = [{
    field: "name",
    label: "Tên bài học",
    type: 'text'
}, {
    field: "description",
    label: "Mô tả",
    type: 'text'

}, {
    field: "type",
    label: "Thể loại",
    type: 'text'

}, {
    field: "duration",
    label: "Thời lượng",
    type: 'number'
}, {
    field: "video_url",
    label: "Đường dẫn video",
    type: 'text'
}]

export function CourseContentBuilder({ data, onUpdate }: CourseContentBuilderProps) {
    const [chapters, setChapters] = useState<Chapter[]>(data.chapters || [])
    const [newChapterTitle, setNewChapterTitle] = useState("")

    const [lesson, setLesson] = useState<any>({})

    const handleSetLesson = (field: string, value: string | number) => {
        setLesson({ ...lesson, [field]: value })
    }

    const addChapter = () => {
        if (newChapterTitle.trim()) {
            const newChapter: Chapter = {
                id: Date.now().toString(),
                name: newChapterTitle,
                description: "Mô tả chương",
                lessons: [],
                order: chapters.length + 1,
            }
            const updatedChapters = [...chapters, newChapter]
            setChapters(updatedChapters)
            onUpdate({ ...data, chapters: updatedChapters })
            setNewChapterTitle("")
        }
    }

    const addLesson = (chapterId: string) => {
        const updatedChapters = chapters.map((chapter) => {
            if (chapter.id === chapterId) {
                const newLesson: Lesson = {
                    id: Date.now().toString(),
                    name: lesson.name,
                    description: lesson.description || "Mô tả bài học",
                    type: lesson.type || "",
                    video_url: lesson.video_url || "",
                    duration: lesson.duration || "",
                    order: chapter.lessons.length + 1,
                }
                setLesson({})
                return {
                    ...chapter,
                    lessons: [...chapter.lessons, newLesson],
                }
            }
            return chapter
        })
        setChapters(updatedChapters)
        onUpdate({ ...data, chapters: updatedChapters })
    }

    const deleteChapter = (chapterId: string) => {
        const updateChapters = chapters.filter((chapter) => chapter.id !== chapterId)

        setChapters(updateChapters)
        onUpdate({ ...data, chapter: updateChapters })
    }

    const deleteLesson = (chapterId: string, lessonId: string) => {
        const updateChapters = chapters.map((chapter) => {
            if (chapter.id === chapterId) {
                const updateLessons = chapter.lessons.filter((lesson) => lesson.id !== lessonId)
                return {
                    ...chapter,
                    lessons: updateLessons
                }
            }
            return chapter
        })
        setChapters(updateChapters)
        onUpdate(updateChapters)
    }

    const getTotalLessons = () => {
        return chapters.reduce((total, chapter) => total + chapter.lessons.length, 0)
    }

    const getTotalDuration = () => {
        let totalMinutes = 0
        chapters.forEach((chapter) => {
            chapter.lessons.forEach((lesson) => {
                if (lesson.duration) {
                    totalMinutes += lesson.duration || 0
                }
            })
        })
        return Math.round(totalMinutes / 60) || 0
    }

    return (
        <div className="space-y-6">
            {/* Course Structure Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Cấu trúc khóa học
                    </CardTitle>
                    <CardDescription>Tổ chức nội dung khóa học thành các chương và bài học</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold text-primary">{chapters.length}</div>
                            <div className="text-sm text-muted-foreground">Chương</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold text-secondary">{getTotalLessons()}</div>
                            <div className="text-sm text-muted-foreground">Bài học</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold text-accent">~{getTotalDuration()}h</div>
                            <div className="text-sm text-muted-foreground">Thời lượng</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add New Chapter */}
            <Card>
                <CardHeader>
                    <CardTitle>Thêm chương mới</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Input
                            placeholder="Tên chương (ví dụ: Giới thiệu cơ bản)"
                            value={newChapterTitle}
                            onChange={(e) => setNewChapterTitle(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addChapter()}
                        />
                        <Button onClick={addChapter} disabled={!newChapterTitle.trim()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm chương
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Chapters List */}
            <div className="space-y-4">
                {chapters.map((chapter, chapterIndex) => (
                    <Card key={chapter.id} className="border-l-4 border-l-primary">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                                    <div>
                                        <CardTitle className="text-lg">
                                            Chương {chapterIndex + 1}: {chapter.name}
                                        </CardTitle>
                                        <CardDescription>{chapter.lessons.length} bài học</CardDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm"
                                        onClick={() => deleteChapter(chapter.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Chapter Lessons */}
                            {chapter.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                    <div className="p-2 rounded bg-blue-100 text-blue-700">
                                        <Video className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                Bài {lessonIndex + 1}: {lesson.name}
                                            </span>
                                            {lesson.type && <Badge variant="outline" className="text-xs">
                                                {lesson.type}
                                            </Badge>}
                                            {lesson.duration && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {lesson.duration} phút
                                                </Badge>
                                            )}
                                        </div>
                                        {lesson.description && <p className="text-sm text-muted-foreground">{lesson.description}</p>}
                                        {lesson.video_url && (
                                            <p className="text-xs text-muted-foreground mt-1">Video: {lesson.video_url}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm"
                                            onClick={() => deleteLesson(chapter.id, lesson.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 bg-primary/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1 mx-4">
                                        <div className="p-2 rounded-full bg-primary/10">
                                            <Plus className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            {infoLesson.map((item, index) => (
                                                <Input
                                                    key={index}
                                                    className="w-full"
                                                    placeholder={item.label}
                                                    type={item.type}
                                                    value={lesson[item.field] || ""}
                                                    onChange={(e) => handleSetLesson(item.field, item.field === "duration" ? Number.parseInt(e.target.value) : e.target.value)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <Button onClick={() => addLesson(chapter.id)} disabled={!lesson?.name?.trim()}
                                        className="bg-primary hover:bg-primary/90" size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Thêm bài học
                                    </Button>
                                </div>
                            </div>
                            <Separator />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Resource Library
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Thư viện tài nguyên
                    </CardTitle>
                    <CardDescription>Tải lên và quản lý các file video cho khóa học</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">Kéo thả file video vào đây hoặc click để chọn</p>
                        <p className="text-xs text-muted-foreground">Hỗ trợ video (MP4, MOV, AVI) tối đa 500MB mỗi file</p>
                        <Button variant="outline" className="mt-4 bg-transparent">
                            Chọn file video
                        </Button>
                    </div>
                </CardContent>
            </Card> */}
        </div>
    )
}
