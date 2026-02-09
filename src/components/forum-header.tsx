"use client"


import { Search, Plus, TrendingUp } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export function ForumHeader() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-serif text-foreground">Diễn đàn Hỏi Đáp</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Nơi học sinh và giáo viên cùng nhau chia sẻ kiến thức, giải đáp thắc mắc và hỗ trợ học tập
        </p>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Tìm kiếm câu hỏi, từ khóa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <TrendingUp className="w-4 h-4" />
            Xu hướng
          </Button>
          <Link href="/forum/new">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Đặt câu hỏi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
