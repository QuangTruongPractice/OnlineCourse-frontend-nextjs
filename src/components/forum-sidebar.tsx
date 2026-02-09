"use client"


import { BookOpen, Users, Award, Filter } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

const subjects = [
  { name: "Toán học", count: 245, color: "bg-blue-100 text-blue-800" },
  { name: "Vật lý", count: 189, color: "bg-green-100 text-green-800" },
  { name: "Hóa học", count: 156, color: "bg-purple-100 text-purple-800" },
  { name: "Sinh học", count: 134, color: "bg-pink-100 text-pink-800" },
  { name: "Văn học", count: 98, color: "bg-yellow-100 text-yellow-800" },
  { name: "Lịch sử", count: 87, color: "bg-indigo-100 text-indigo-800" },
  { name: "Địa lý", count: 76, color: "bg-red-100 text-red-800" },
  { name: "Tiếng Anh", count: 203, color: "bg-orange-100 text-orange-800" },
]

const priorities = [
  { name: "Khẩn cấp", count: 12, color: "bg-red-100 text-red-800" },
  { name: "Cao", count: 34, color: "bg-orange-100 text-orange-800" },
  { name: "Trung bình", count: 156, color: "bg-yellow-100 text-yellow-800" },
  { name: "Thấp", count: 89, color: "bg-green-100 text-green-800" },
]

export function ForumSidebar() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]))
  }

  const togglePriority = (priority: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority],
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" />
            Thống kê
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tổng câu hỏi</span>
            <Badge variant="secondary">1,234</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Đã trả lời</span>
            <Badge variant="secondary">987</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Chưa trả lời</span>
            <Badge variant="destructive">247</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Subject Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5" />
            Môn học
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedSubjects.includes(subject.name) ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                }`}
              onClick={() => toggleSubject(subject.name)}
            >
              <span className="text-sm font-medium">{subject.name}</span>
              <Badge className={subject.color}>{subject.count}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Priority Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            Độ ưu tiên
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {priorities.map((priority) => (
            <div
              key={priority.name}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedPriorities.includes(priority.name) ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                }`}
              onClick={() => togglePriority(priority.name)}
            >
              <span className="text-sm font-medium">{priority.name}</span>
              <Badge className={priority.color}>{priority.count}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="w-5 h-5" />
            Người đóng góp hàng đầu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "GS. Nguyễn Văn A", points: 2450, role: "Giảng viên" },
            { name: "TS. Trần Thị B", points: 1890, role: "Giảng viên" },
            { name: "Lê Văn C", points: 1234, role: "Học sinh" },
          ].map((contributor, index) => (
            <div key={contributor.name} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0
                  ? "bg-yellow-100 text-yellow-800"
                  : index === 1
                    ? "bg-gray-100 text-gray-800"
                    : "bg-orange-100 text-orange-800"
                  }`}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{contributor.name}</p>
                <p className="text-xs text-muted-foreground">{contributor.points} điểm</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {contributor.role}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
