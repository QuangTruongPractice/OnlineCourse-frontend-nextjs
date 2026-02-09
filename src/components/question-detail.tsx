"use client"


import {
  ThumbsUp,
  MessageCircle,
  Eye,
  Clock,
  Pin,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Share2,
  Bookmark,
} from "lucide-react"
import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"

interface QuestionDetailProps {
  questionId: string
}

const mockQuestion = {
  id: "1",
  title: "Làm thế nào để giải phương trình bậc hai có delta âm?",
  content: `Em đang gặp khó khăn với việc giải phương trình bậc hai khi delta < 0. Thầy cô có thể giải thích về số phức không ạ?

    Cụ thể em đang làm bài tập: x² + 2x + 5 = 0

    Em tính được delta = 4 - 20 = -16 < 0, nhưng không biết làm tiếp như thế nào. Em có nghe nói về số ảo i nhưng chưa hiểu rõ.

    Mong thầy cô giải thích chi tiết giúp em. Em cảm ơn ạ!`,
  author: {
    name: "Nguyễn Văn A",
    avatar: "/male-student-avatar.png",
    role: "student" as const,
  },
  subject: "Toán học",
  priority: "high" as const,
  votes: 24,
  answers: 3,
  views: 156,
  timestamp: "2 giờ trước",
  isPinned: true,
  isAnswered: true,
  tags: ["phương trình", "số phức", "đại số"],
  isVoted: false,
  isBookmarked: false,
}

const priorityConfig = {
  urgent: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Khẩn cấp" },
  high: { color: "bg-orange-100 text-orange-800", icon: ArrowUp, label: "Cao" },
  medium: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Trung bình" },
  low: { color: "bg-green-100 text-green-800", icon: ArrowDown, label: "Thấp" },
}

export function QuestionDetail({ questionId }: QuestionDetailProps) {
  const [question, setQuestion] = useState(mockQuestion)

  const toggleVote = () => {
    setQuestion((prev) => ({
      ...prev,
      isVoted: !prev.isVoted,
      votes: prev.isVoted ? prev.votes - 1 : prev.votes + 1,
    }))
  }

  const toggleBookmark = () => {
    setQuestion((prev) => ({
      ...prev,
      isBookmarked: !prev.isBookmarked,
    }))
  }

  const PriorityIcon = priorityConfig[question.priority].icon

  return (
    <Card>
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Question Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold flex-1">{question.title}</h1>
              {question.isPinned && <Pin className="w-5 h-5 text-accent" />}
              {question.isAnswered && <CheckCircle className="w-5 h-5 text-green-600" />}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{question.subject}</Badge>
              <Badge className={priorityConfig[question.priority].color}>
                <PriorityIcon className="w-3 h-3 mr-1" />
                {priorityConfig[question.priority].label}
              </Badge>
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Question Content */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">{question.content}</div>
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Avatar className="w-12 h-12">
              <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {question.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{question.author.name}</span>
                {/* {question.author.role === "instructor" && (
                  <Badge variant="secondary" className="text-xs">
                    Giảng viên
                  </Badge>
                )} */}
              </div>
              <div className="text-sm text-muted-foreground">Đăng {question.timestamp}</div>
            </div>
          </div>

          {/* Question Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`h-9 ${question.isVoted ? "text-accent" : ""}`}
                onClick={toggleVote}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                {question.votes} hữu ích
              </Button>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                {question.answers} trả lời
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                {question.views} lượt xem
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={question.isBookmarked ? "text-accent" : ""}
                onClick={toggleBookmark}
              >
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
