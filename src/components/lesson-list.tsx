"use client"

import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Play, Lock, CheckCircle, Clock, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

interface IProps {
  course: ICourseDetail,
  setUrl: (url: string) => void
}

export function LessonList({ course, setUrl }: IProps) {
  const [expandedChapters, setExpandedChapters] = useState<number[]>([1])

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId],
    )
  }
  function formatDuration(minutes: number) {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hrs > 0) {
      return `${hrs}h ${mins}p`
    }
    return `${mins} phút`
  }

  return (
    <Card className="lg:sticky lg:top-8 border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
      <CardHeader className="bg-slate-50 border-b border-slate-100 py-6">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          Nội dung khóa học
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {course.chapters && course.chapters.length > 0 ? (
            course.chapters.map((chapter) => (
              <div key={chapter.id} className="group">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-5 h-auto text-left hover:bg-slate-50 transition-colors"
                  onClick={() => toggleChapter(chapter.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`transition-transform duration-300 ${expandedChapters.includes(chapter.id) ? "rotate-180 text-blue-600" : "text-slate-400"}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{chapter.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {chapter.lessons.length} bài học • {chapter.lessons.reduce((acc, l) => acc + (l.duration || 0), 0)} phút
                      </div>
                    </div>
                  </div>
                </Button>

                {expandedChapters.includes(chapter.id) && (
                  <div className="bg-slate-50/50 pb-2">
                    {chapter.lessons.map((lesson) =>
                      lesson.is_published && (
                        <Button
                          key={lesson.id}
                          variant="ghost"
                          className="w-full justify-start p-4 pl-12 h-auto text-left hover:bg-blue-50 transition-all border-l-4 border-transparent hover:border-blue-600 group/lesson"
                          onClick={() => setUrl(lesson?.video_url)}
                        >
                          <div className="flex items-center gap-4 w-full">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover/lesson:text-blue-600 transition-colors">
                              <Play className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs sm:text-sm font-semibold text-slate-700 truncate group-hover/lesson:text-slate-900">{lesson.name}</div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatDuration(lesson.duration)}</span>
                              </div>
                            </div>
                          </div>
                        </Button>
                      )
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8 text-slate-300" />
              </div>
              <div>
                <div className="text-slate-900 font-bold">Nội dung đã khoá</div>
                <div className="text-slate-500 text-xs mt-1">Vui lòng đăng ký khoá học để xem bài học</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
