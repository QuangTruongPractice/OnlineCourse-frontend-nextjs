"use client"


import { ThumbsUp, ThumbsDown, MessageCircle, CheckCircle, Award } from "lucide-react"
import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"

interface AnswerListProps {
  questionId: string
}

interface Answer {
  id: string
  content: string
  author: {
    name: string
    avatar: string
    role: "student" | "instructor"
    reputation: number
  }
  votes: number
  timestamp: string
  isAccepted: boolean
  isVoted: "up" | "down" | null
  replies: Reply[]
}

interface Reply {
  id: string
  content: string
  author: {
    name: string
    avatar: string
    role: "student" | "instructor"
  }
  timestamp: string
}

const mockAnswers: Answer[] = [
  {
    id: "1",
    content: `Chào em! Đây là một câu hỏi rất hay về số phức.

Khi delta < 0, phương trình bậc hai vẫn có nghiệm, nhưng là nghiệm phức. Với phương trình x² + 2x + 5 = 0:

**Bước 1:** Tính delta
Δ = b² - 4ac = 4 - 4(1)(5) = -16

**Bước 2:** Tính nghiệm phức
x = (-b ± √Δ) / 2a = (-2 ± √(-16)) / 2 = (-2 ± 4i) / 2 = -1 ± 2i

Vậy nghiệm là: x₁ = -1 + 2i và x₂ = -1 - 2i

**Giải thích về số ảo i:**
- i = √(-1) là đơn vị ảo
- i² = -1
- Số phức có dạng a + bi (a là phần thực, bi là phần ảo)

Em có thể kiểm tra lại bằng cách thế nghiệm vào phương trình ban đầu.`,
    author: {
      name: "TS. Nguyễn Văn Minh",
      avatar: "/instructor-avatar.png",
      role: "instructor",
      reputation: 2450,
    },
    votes: 18,
    timestamp: "1 giờ trước",
    isAccepted: true,
    isVoted: null,
    replies: [
      {
        id: "r1",
        content: "Cảm ơn thầy! Em đã hiểu rồi ạ. Vậy có phải mọi phương trình bậc hai đều có nghiệm không thầy?",
        author: {
          name: "Nguyễn Văn A",
          avatar: "/male-student-avatar.png",
          role: "student",
        },
        timestamp: "45 phút trước",
      },
      {
        id: "r2",
        content: "Đúng rồi em! Trong tập số phức, mọi phương trình bậc hai đều có đúng 2 nghiệm (kể cả nghiệm kép).",
        author: {
          name: "TS. Nguyễn Văn Minh",
          avatar: "/instructor-avatar.png",
          role: "instructor",
        },
        timestamp: "30 phút trước",
      },
    ],
  },
  {
    id: "2",
    content: `Mình cũng từng gặp vấn đề này! Ngoài cách giải của thầy, mình muốn chia sẻ thêm một cách hiểu khác:

**Cách nhớ công thức:**
- Khi Δ > 0: 2 nghiệm thực phân biệt
- Khi Δ = 0: 1 nghiệm thực (nghiệm kép)  
- Khi Δ < 0: 2 nghiệm phức liên hợp

**Ví dụ thực tế:**
Số phức rất hữu ích trong kỹ thuật điện, xử lý tín hiệu. Đừng nghĩ nó chỉ là toán học thuần túy nhé!

**Tip:** Em có thể dùng máy tính Casio fx-570VN Plus để kiểm tra kết quả.`,
    author: {
      name: "Trần Minh Tuấn",
      avatar: "/male-student-avatar.png",
      role: "student",
      reputation: 890,
    },
    votes: 12,
    timestamp: "30 phút trước",
    isAccepted: false,
    isVoted: "up",
    replies: [],
  },
  {
    id: "3",
    content: `Để bổ sung thêm, em có thể tham khảo:

**Tài liệu:**
- SGK Toán 12 - Chương số phức
- Bài giảng video trên YouTube: "Số phức cơ bản"

**Bài tập tương tự:**
1. x² - 4x + 13 = 0
2. 2x² + x + 1 = 0
3. x² + x + 1 = 0

Làm thử và đăng kết quả lên đây nhé, mọi người sẽ giúp em kiểm tra!`,
    author: {
      name: "Lê Thị Hương",
      avatar: "/female-student-avatar.png",
      role: "student",
      reputation: 650,
    },
    votes: 8,
    timestamp: "15 phút trước",
    isAccepted: false,
    isVoted: null,
    replies: [],
  },
]

export function AnswerList({ questionId }: AnswerListProps) {
  const [answers, setAnswers] = useState<Answer[]>(mockAnswers)
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({})

  const toggleVote = (answerId: string, voteType: "up" | "down") => {
    setAnswers(
      answers.map((answer) => {
        if (answer.id === answerId) {
          const currentVote = answer.isVoted
          let newVotes = answer.votes
          let newVoteState: "up" | "down" | null = voteType

          // Remove previous vote
          if (currentVote === "up") newVotes -= 1
          if (currentVote === "down") newVotes += 1

          // Add new vote if different from current
          if (currentVote === voteType) {
            newVoteState = null
          } else {
            if (voteType === "up") newVotes += 1
            if (voteType === "down") newVotes -= 1
          }

          return {
            ...answer,
            votes: newVotes,
            isVoted: newVoteState,
          }
        }
        return answer
      }),
    )
  }

  const toggleReplies = (answerId: string) => {
    setShowReplies((prev) => ({
      ...prev,
      [answerId]: !prev[answerId],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{answers.length} câu trả lời</h2>
        <div className="text-sm text-muted-foreground">Sắp xếp theo: Hữu ích nhất</div>
      </div>

      <div className="space-y-6">
        {answers.map((answer) => (
          <Card key={answer.id} className={answer.isAccepted ? "border-green-200 bg-green-50/50" : ""}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Answer Header */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${answer.isVoted === "up" ? "text-green-600" : ""}`}
                      onClick={() => toggleVote(answer.id, "up")}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <span className="font-medium text-lg">{answer.votes}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${answer.isVoted === "down" ? "text-red-600" : ""}`}
                      onClick={() => toggleVote(answer.id, "down")}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                    {answer.isAccepted && <CheckCircle className="w-6 h-6 text-green-600 mt-2" />}
                  </div>

                  <div className="flex-1 space-y-4">
                    {/* Answer Content */}
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-foreground leading-relaxed">{answer.content}</div>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={answer.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {answer.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{answer.author.name}</span>
                            {answer.author.role === "instructor" && (
                              <Badge variant="secondary" className="text-xs">
                                Giảng viên
                              </Badge>
                            )}
                            {answer.isAccepted && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                <Award className="w-3 h-3 mr-1" />
                                Câu trả lời được chấp nhận
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {answer.author.reputation} điểm uy tín • {answer.timestamp}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {answer.replies.length > 0 && (
                          <Button variant="ghost" size="sm" onClick={() => toggleReplies(answer.id)}>
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {answer.replies.length} phản hồi
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          Trả lời
                        </Button>
                      </div>
                    </div>

                    {/* Replies */}
                    {showReplies[answer.id] && answer.replies.length > 0 && (
                      <div className="ml-4 pl-4 border-l-2 border-muted space-y-4">
                        {answer.replies.map((reply) => (
                          <div key={reply.id} className="space-y-2">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {reply.author.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">{reply.author.name}</span>
                                  {reply.author.role === "instructor" && (
                                    <Badge variant="secondary" className="text-xs">
                                      Giảng viên
                                    </Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                                </div>
                                <p className="text-sm text-foreground">{reply.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
