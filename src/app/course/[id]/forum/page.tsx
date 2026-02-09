"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ForumLayout } from "@/src/components/forum/forum-layout"
import { authApis, endpoints } from "@/src/utils/api"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { ArrowLeft, MessageSquare } from "lucide-react"

export default function CourseForumPage() {
    const params = useParams()
    const router = useRouter()
    const courseId = params.id as string


    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Enhanced Header */}
            <div className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.back()}
                                className="hover:bg-slate-100 text-slate-600 font-bold rounded-xl h-10 px-4 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Quay lại</span>
                            </Button>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-lg lg:text-2xl font-black text-slate-900 tracking-tight">Diễn đàn thảo luận</h1>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1.5">Cộng đồng học tập</Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forum Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ForumLayout
                    courseId={courseId}
                />
            </div>
        </div>
    )
}
