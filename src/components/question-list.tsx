"use client"

import { ThumbsUp, MessageCircle, Eye, Clock, Pin, CheckCircle, AlertCircle, ArrowUp, ArrowDown } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"

interface Question {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    role: "student" | "instructor"
  }
  subject: string
  priority: "low" | "medium" | "high" | "urgent"
  votes: number
  answers: number
  views: number
  timestamp: string
  isPinned?: boolean
  isAnswered?: boolean
  isVoted?: boolean
  tags: string[]
}

const mockQuestions: Question[] = [
  {
    id: "1",
    title: "Làm thế nào để giải phương trình bậc hai có delta âm?",
    content:
      "Em đang gặp khó khăn với việc giải phương trình bậc hai khi delta < 0. Thầy cô có thể giải thích về số phức không ạ?",
    author: {
      name: "Nguyễn Văn A",
      avatar: "/male-student-avatar.png",
      role: "student",
    },
    subject: "Toán học",
    priority: "high",
    votes: 24,
    answers: 3,
    views: 156,
    timestamp: "2 giờ trước",
    isPinned: true,
    isAnswered: true,
    tags: ["phương trình", "số phức", "đại số"],
  },
  {
    id: "2",
    title: "Sự khác biệt giữa mitosis và meiosis là gì?",
    content: "Em cần hiểu rõ hơn về quá trình phân bào mitosis và meiosis. Hai quá trình này khác nhau như thế nào?",
    author: {
      name: "Trần Thị B",
      avatar: "/female-student-avatar.png",
      role: "student",
    },
    subject: "Sinh học",
    priority: "medium",
    votes: 18,
    answers: 2,
    views: 89,
    timestamp: "4 giờ trước",
    isAnswered: false,
    tags: ["tế bào", "phân bào", "di truyền"],
  },
  {
    id: "3",
    title: "Cách tính pH của dung dịch đệm",
    content: "Em cần hướng dẫn chi tiết về cách tính pH của các dung dịch đệm, đặc biệt là hệ đệm acetate.",
    author: {
      name: "Lê Văn C",
      avatar: "/male-student-avatar.png",
      role: "student",
    },
    subject: "Hóa học",
    priority: "urgent",
    votes: 31,
    answers: 5,
    views: 234,
    timestamp: "1 ngày trước",
    isAnswered: true,
    isVoted: true,
    tags: ["pH", "dung dịch đệm", "acid-base"],
  },
]

const priorityConfig = {
  urgent: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Khẩn cấp" },
  high: { color: "bg-orange-100 text-orange-800", icon: ArrowUp, label: "Cao" },
  medium: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Trung bình" },
  low: { color: "bg-green-100 text-green-800", icon: ArrowDown, label: "Thấp" },
}

export function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions)
  const [sortBy, setSortBy] = useState<"newest" | "votes" | "answers">("newest")

  const toggleVote = (id: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
            ...q,
            isVoted: !q.isVoted,
            votes: q.isVoted ? q.votes - 1 : q.votes + 1,
          }
          : q,
      ),
    )
  }

  const sortedQuestions = [...questions].sort((a, b) => {
    switch (sortBy) {
      case "votes":
        return b.votes - a.votes
      case "answers":
        return b.answers - a.answers
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
  })

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Câu hỏi gần đây</h2>
        <div className="flex gap-2">
          <Button variant={sortBy === "newest" ? "default" : "outline"} size="sm" onClick={() => setSortBy("newest")}>
            Mới nhất
          </Button>
          <Button variant={sortBy === "votes" ? "default" : "outline"} size="sm" onClick={() => setSortBy("votes")}>
            Nhiều vote
          </Button>
          <Button variant={sortBy === "answers" ? "default" : "outline"} size="sm" onClick={() => setSortBy("answers")}>
            Nhiều trả lời
          </Button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {sortedQuestions.map((question) => {
          const PriorityIcon = priorityConfig[question.priority].icon

          return (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Question Header */}
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {question.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold hover:text-accent cursor-pointer">{question.title}</h3>
                        {question.isPinned && <Pin className="w-4 h-4 text-accent" />}
                        {question.isAnswered && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </div>

                      <p className="text-muted-foreground text-sm line-clamp-2">{question.content}</p>

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

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{question.author.name}</span>
                        <span>•</span>
                        <span>{question.timestamp}</span>
                        {question.author.role === "instructor" && (
                          <>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs">
                              Giảng viên
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Question Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 ${question.isVoted ? "text-accent" : ""}`}
                        onClick={() => toggleVote(question.id)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {question.votes}
                      </Button>

                      <Button variant="ghost" size="sm" className="h-8">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {question.answers} trả lời
                      </Button>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        {question.views}
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      <Link href={`/forum/${question.id}`}>Xem chi tiết</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
