"use client"

import type React from "react"


import { Bold, Italic, Link, Code, List, ImageIcon } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Textarea } from "./ui/textarea"

interface AnswerFormProps {
  questionId: string
}

export function AnswerForm({ questionId }: AnswerFormProps) {
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    setAnswer("")
    setIsSubmitting(false)

    // Show success message (in real app, would update the answer list)
    alert("Câu trả lời đã được đăng thành công!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Viết câu trả lời của bạn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current User Info */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/current-user-avatar.png" />
            <AvatarFallback>BN</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Bạn</span>
              <Badge variant="outline" className="text-xs">
                Học sinh
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">450 điểm uy tín</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 p-2 border rounded-lg bg-muted/30">
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bold className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Italic className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Link className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Code className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <List className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ImageIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* Answer Input */}
          <Textarea
            placeholder="Viết câu trả lời chi tiết của bạn... 
              Gợi ý:
              • Giải thích từng bước một cách rõ ràng
              • Đưa ra ví dụ cụ thể nếu có thể
              • Tham khảo tài liệu đáng tin cậy
              • Sử dụng định dạng để làm nổi bật các điểm quan trọng"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="min-h-[200px] resize-none"
          />

          {/* Guidelines */}
          <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
            <strong>Hướng dẫn viết câu trả lời tốt:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Trả lời trực tiếp vào vấn đề được hỏi</li>
              <li>Cung cấp giải thích chi tiết và dễ hiểu</li>
              <li>Sử dụng ví dụ minh họa khi có thể</li>
              <li>Kiểm tra lại thông tin trước khi đăng</li>
              <li>Tôn trọng và lịch sự với người hỏi</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{answer.length}/2000 ký tự</div>
            <div className="flex gap-2">
              <Button type="button" variant="outline">
                Xem trước
              </Button>
              <Button type="submit" disabled={!answer.trim() || isSubmitting} className="min-w-[120px]">
                {isSubmitting ? (
                  "Đang đăng..."
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Đăng câu trả lời
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
