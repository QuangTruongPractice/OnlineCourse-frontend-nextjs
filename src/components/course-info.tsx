'use client'

import { MessageCircle, BookOpen, Users, Clock, Target, Star, User, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/src/store/useAuthStore"
import { Button } from "./ui/button"

import { getMediaUrl } from "@/src/utils/api"

interface IProps {
  course: ICourseDetail
}

export function CourseInfo({ course }: IProps) {
  const router = useRouter()
  const currentUserStore = useAuthStore((state) => state.user)

  const totalLessons = (course: ICourseDetail) => {
    return course.chapters.reduce(
      (count, chapter) => count + chapter.lessons.length,
      0
    )
  }

  const currentUser = currentUserStore ? {
    id: currentUserStore.id,
    firstName: currentUserStore.first_name,
    lastName: currentUserStore.last_name,
    type: currentUserStore.type || "student" as const
  } : null;

  const targetUser = {
    id: course.lecturer.id,
    firstName: course.lecturer.first_name,
    lastName: course.lecturer.last_name,
    type: "teacher" as const
  };

  const goToChat = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!currentUser) {
      alert("Vui lòng đăng nhập để nhắn tin với Teacher!")
      router.push("/auth/signin")
      return
    }

    if (currentUser.id === targetUser.id) {
      alert("Bạn không thể nhắn tin cho chính mình!")
      return
    }

    const roomId = [currentUser.id, targetUser.id]
      .sort((a, b) => a - b)
      .join("-")

    const query = new URLSearchParams({
      roomId,
      currentUser: JSON.stringify(currentUser),
      targetUser: JSON.stringify(targetUser),
    }).toString()

    router.push(`/chat?${query}`)
  }

  return (
    <div className="space-y-8">
      {/* Course Overview */}
      <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl font-black text-slate-800">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Tổng quan khóa học
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-blue-50/50 rounded-2xl border border-blue-100 group hover:bg-blue-50 transition-colors duration-300">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="font-extrabold text-slate-900 text-lg">
                {Math.floor(course.duration / 60)} phút
              </div>
              <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">Video HD</div>
            </div>

            <div className="text-center p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 group hover:bg-indigo-50 transition-colors duration-300">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="font-extrabold text-slate-900 text-lg">
                {totalLessons(course)} bài
              </div>
              <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">Bố cục tốt</div>
            </div>

            <div className="text-center p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 group hover:bg-emerald-50 transition-colors duration-300">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="font-extrabold text-slate-900 text-lg">
                {course.students_count?.toLocaleString('vi-VN')}
              </div>
              <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1">Học viên</div>
            </div>

            <button
              onClick={() => router.push(`/course/${course.id}/forum`)}
              className="text-center p-6 bg-amber-50/50 rounded-2xl border border-amber-100 group hover:bg-amber-50 transition-all duration-300 hover:shadow-lg cursor-pointer"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-amber-600" />
              </div>
              <div className="font-extrabold text-slate-900 text-lg">
                Thảo luận
              </div>
              <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mt-1">Diễn đàn</div>
            </button>
          </div>
        </CardContent>
      </Card>


      {/* What You'll Learn & Requirements in a grid on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-lg shadow-slate-200/50 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-emerald-700">
              <Target className="w-5 h-5" />
              Bạn sẽ học được gì
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none prose-slate">
            <div dangerouslySetInnerHTML={{ __html: course.learning_outcomes }} className="text-slate-600 leading-relaxed" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg shadow-slate-200/50 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-amber-700">Yêu cầu tham gia</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none prose-slate">
            <div dangerouslySetInnerHTML={{ __html: course.requirements }} className="text-slate-600 leading-relaxed" />
          </CardContent>
        </Card>
      </div>

      {/* Instructor Section */}
      <Card className="border-none shadow-2xl shadow-blue-500/5 bg-gradient-to-br from-white to-slate-50/50 rounded-2xl overflow-hidden p-1">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8 text-center sm:text-left">
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border-4 border-white relative shadow-inner">
                <AvatarImage src={getMediaUrl(course.lecturer.avatar)} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-3xl font-black uppercase">
                  {(course.lecturer.first_name?.[0] || '') + (course.lecturer.last_name?.[0] || '') || <User className="size-1/2" />}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1 uppercase tracking-tight">
                  {course.lecturer.first_name} {course.lecturer.last_name}
                </h3>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg">
                  {course.lecturer.userRole || 'Teacher'}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> 4.9 Đánh giá</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-blue-500" /> {(course.lecturer as any).courses_count || 12} Khóa học</span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-emerald-500" /> {course.students_count?.toLocaleString() || '1,200'} Học viên</span>
              </div>

              <p className="text-slate-600 leading-relaxed text-sm lg:text-base italic font-medium">
                "{course.lecturer.introduce || 'Giảng viên dày dặn kinh nghiệm, chuyên đào tạo và phát triển các giải pháp phần mềm hiện đại cho doanh nghiệp.'}"
              </p>

              <div className="pt-2 max-w-xs mx-auto sm:mx-0">
                <Button
                  onClick={goToChat}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-black rounded-xl h-12 lg:h-14 transition-all active:scale-95 translate-y-0 hover:-translate-y-1"
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Kết nối với Teacher
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
