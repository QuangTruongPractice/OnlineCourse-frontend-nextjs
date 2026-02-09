import { BookOpen, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8 text-center sm:text-left">
          {/* Logo and description */}
          <div className="space-y-4 max-w-xs mx-auto sm:mx-0">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <BookOpen className="h-8 w-8 text-white" />
              <span className="text-xl font-bold italic tracking-tight">EduManageTTT</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed text-sm">
              Nền tảng quản lý khóa học trực tuyến hàng đầu, mang đến trải nghiệm học tập tốt nhất cho mọi người.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b border-white/10 pb-2 inline-block">Đội ngũ phát triển</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Phạm Quốc Thái</li>
              <li>Trần Quang Trường</li>
              <li>Huỳnh Ngọc Trương</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b border-white/10 pb-2 inline-block">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Email: info@edumanagettt.vn</li>
              <li>Điện thoại: (84) 123 456 789</li>
              <li>Địa chỉ: Quận 1, TP.HCM</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} EduManageTTT. All rights reserved.
        </div>
      </div>
    </footer>

  )
}
