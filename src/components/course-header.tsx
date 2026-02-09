// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock, Award } from "lucide-react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/src/store/useAuthStore"
import { formatDuration } from "../utils/api"

interface IProps {
  course: ICourseDetail
}

export function CourseHeader({ course }: IProps) {
  const router = useRouter()

  const goToPayment = () => {
    const id = course.id
    router.push(`/course/${id}/register`)

  }
  return (
    <div className="bg-white border-b border-slate-100 shadow-sm overflow-hidden">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-6 flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
                Khóa học chất lượng cao
              </Badge>
              {course.lecturer.userRole && (
                <Badge variant="outline" className="border-blue-100 text-blue-600 px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
                  {course.lecturer.userRole}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {course.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-500 pt-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-blue-500">
                  <Users className="w-4 h-4" />
                </div>
                <span>{course.students_count?.toLocaleString('vi-VN')} học viên</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-blue-500">
                  <Clock className="w-4 h-4" />
                </div>
                <span>{formatDuration(course.duration)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 flex-shrink-0">
            <div className="flex flex-col gap-1 items-start sm:items-end lg:items-start xl:items-end mb-2 sm:mb-0 lg:mb-2 xl:mb-0">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Giá khóa học</span>
              <span className="text-3xl lg:text-4xl font-black text-blue-600 tracking-tighter">
                {new Intl.NumberFormat('vi-VN').format(parseFloat(course.price))}đ
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={course.is_enrolled ? () => router.push(`/course/${course.id}/learn`) : goToPayment}
                size="lg"
                className="w-full sm:w-auto lg:w-full xl:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black h-14 px-10 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-lg"
              >
                {course.is_enrolled ? "Vào học ngay" : "Đăng ký học ngay"}
              </Button>
              {course.lecturer?.id !== useAuthStore.getState().user?.id && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const currentUser = useAuthStore.getState().user
                    if (!currentUser) {
                      router.push('/auth/signin')
                      return
                    }

                    const teacher = course.lecturer
                    const ids = [currentUser.id, teacher.id].sort((a, b) => a - b)
                    const roomId = `chat_${ids[0]}_${ids[1]}`

                    const currentUserParam = encodeURIComponent(JSON.stringify({
                      id: currentUser.id,
                      firstName: currentUser.first_name,
                      lastName: currentUser.last_name,
                      type: currentUser.userRole?.toLowerCase() === 'teacher' ? 'teacher' : 'student'
                    }))

                    const targetUserParam = encodeURIComponent(JSON.stringify({
                      id: teacher.id,
                      firstName: teacher.first_name,
                      lastName: teacher.last_name,
                      type: 'teacher'
                    }))

                    router.push(`/chat?roomId=${roomId}&currentUser=${currentUserParam}&targetUser=${targetUserParam}`)
                  }}
                  className="w-full sm:w-auto lg:w-full xl:w-auto bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-100 font-bold h-14 px-10 rounded-2xl shadow-sm active:scale-95 transition-all"
                >
                  Nhắn tin cho Teacher
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
