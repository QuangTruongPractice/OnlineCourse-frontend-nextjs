"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, ThumbsUp, Reply, Send, Pin } from "lucide-react"

interface Discussion {
  id: string
  author: {
    name: string
    avatar: string
    role: "student" | "instructor"
  }
  content: string
  timestamp: string
  likes: number
  replies: number
  isPinned?: boolean
  isLiked?: boolean
}

export function DiscussionForum() {
  const [newMessage, setNewMessage] = useState("")
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: "1",
      author: {
        name: "Nguyễn Văn A",
        avatar: "/instructor-avatar.png",
        role: "instructor",
      },
      content:
        "Chào mừng các bạn đến với khóa học React.js! Nếu có bất kỳ câu hỏi nào trong quá trình học, đừng ngần ngại chia sẻ tại đây. Tôi sẽ cố gắng trả lời sớm nhất có thể.",
      timestamp: "2 giờ trước",
      likes: 24,
      replies: 8,
      isPinned: true,
    },
    {
      id: "2",
      author: {
        name: "Trần Thị B",
        avatar: "/female-student-avatar.png",
        role: "student",
      },
      content:
        "Mình có thắc mắc về useState Hook. Khi nào thì nên sử dụng useState và khi nào nên sử dụng useReducer ạ?",
      timestamp: "1 giờ trước",
      likes: 12,
      replies: 3,
      isLiked: true,
    },
    {
      id: "3",
      author: {
        name: "Lê Văn C",
        avatar: "/male-student-avatar.png",
        role: "student",
      },
      content: "Bài học về JSX rất hay! Mình đã hiểu rõ hơn về cách React render elements. Cảm ơn thầy!",
      timestamp: "45 phút trước",
      likes: 8,
      replies: 1,
    },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const newDiscussion: Discussion = {
      id: Date.now().toString(),
      author: {
        name: "Bạn",
        avatar: "/current-user-avatar.png",
        role: "student",
      },
      content: newMessage,
      timestamp: "Vừa xong",
      likes: 0,
      replies: 0,
    }

    setDiscussions([newDiscussion, ...discussions])
    setNewMessage("")
  }

  const toggleLike = (id: string) => {
    setDiscussions(
      discussions.map((discussion) =>
        discussion.id === id
          ? {
              ...discussion,
              isLiked: !discussion.isLiked,
              likes: discussion.isLiked ? discussion.likes - 1 : discussion.likes + 1,
            }
          : discussion,
      ),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Thảo luận
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Message Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Chia sẻ câu hỏi hoặc ý kiến của bạn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Gửi
            </Button>
          </div>
        </form>

        {/* Discussion List */}
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div key={discussion.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {discussion.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{discussion.author.name}</span>
                    {discussion.author.role === "instructor" && (
                      <Badge variant="secondary" className="text-xs">
                        Giảng viên
                      </Badge>
                    )}
                    {discussion.isPinned && <Pin className="w-4 h-4 text-primary" />}
                    <span className="text-sm text-muted-foreground">{discussion.timestamp}</span>
                  </div>

                  <p className="text-sm leading-relaxed">{discussion.content}</p>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-2 ${discussion.isLiked ? "text-primary" : ""}`}
                      onClick={() => toggleLike(discussion.id)}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {discussion.likes}
                    </Button>

                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Reply className="w-4 h-4 mr-1" />
                      Trả lời ({discussion.replies})
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
