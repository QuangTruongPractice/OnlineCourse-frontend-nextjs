"use client"

import type React from "react"


import { X, Plus, Send } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

export function NewQuestionForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    subject: "",
    priority: "",
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subjects = [
    "Toán học",
    "Vật lý",
    "Hóa học",
    "Sinh học",
    "Văn học",
    "Tiếng Anh",
    "Lịch sử",
    "Địa lý",
    "Tin học",
    "Khác",
  ]

  const priorities = [
    { value: "low", label: "Thấp - Không gấp" },
    { value: "medium", label: "Trung bình - Bình thường" },
    { value: "high", label: "Cao - Cần sớm" },
    { value: "urgent", label: "Khẩn cấp - Rất gấp" },
  ]

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim() || !formData.subject || !formData.priority) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!")
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to forum or question detail
    alert("Câu hỏi đã được đăng thành công!")
    router.push("/forum")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin câu hỏi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-2">
            <Label htmlFor="title">
              Tiêu đề câu hỏi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ví dụ: Làm thế nào để giải phương trình bậc hai có delta âm?"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="text-base border border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              Nội dung chi tiết <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="
              Mô tả chi tiết vấn đề bạn gặp phải:
              • Bạn đã thử làm gì?
              • Kết quả mong đợi là gì?
              • Có thông tin bổ sung nào không?
              • Đính kèm hình ảnh nếu cần thiết
              Càng chi tiết, câu trả lời càng chính xác!"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              className="min-h-[200px] resize-none border border-gray-300"
            />
            <div className="text-sm text-muted-foreground text-right">{formData.content.length}/2000 ký tự</div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-gray-300">
            <h4 className="font-medium mb-2">💡 Mẹo để có câu trả lời tốt:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Tìm kiếm trước để tránh câu hỏi trùng lặp</li>
              <li>Viết tiêu đề ngắn gọn nhưng đầy đủ ý nghĩa</li>
              <li>Mô tả cụ thể vấn đề và những gì bạn đã thử</li>
              <li>Sử dụng thẻ phù hợp để dễ tìm kiếm</li>
              <li>Kiểm tra chính tả trước khi đăng</li>
            </ul>
          </div>


          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.title.trim() ||
                !formData.content.trim() ||
                !formData.subject ||
                !formData.priority
              }
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                "Đang đăng..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Đăng câu hỏi
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
