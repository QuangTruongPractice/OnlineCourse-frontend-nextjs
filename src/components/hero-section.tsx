
import { Play, Users, BookOpen, Award } from "lucide-react"
import { Button } from "./ui/button"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 to-accent/5 py-12 lg:py-20 rounded-xl border-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Nền tảng quản lý
              <span className="text-primary"> khóa học </span>
              hàng đầu
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Khám phá hàng nghìn khóa học chất lượng cao từ các chuyên gia hàng đầu. Học tập linh hoạt, tiến bộ nhanh
              chóng với công nghệ hiện đại.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-8 pt-4 lg:pt-8 place-items-center lg:place-items-start">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-1 lg:mb-2">
                  <Users className="h-5 w-5 lg:h-6 lg:w-6 text-primary mr-2" />
                  <span className="text-xl lg:text-2xl font-bold text-primary">50K+</span>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground uppercase tracking-wider">Học viên</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-1 lg:mb-2">
                  <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 text-primary mr-2" />
                  <span className="text-xl lg:text-2xl font-bold text-primary">1000+</span>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground uppercase tracking-wider">Khóa học</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative mt-8 lg:mt-0">
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl opacity-50 block md:hidden"></div>
            <img
              src="/online-learning-dashboard.png"
              alt="Nền tảng học trực tuyến"
              className="rounded-lg shadow-2xl relative z-10 w-full max-w-md mx-auto lg:max-w-none"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
