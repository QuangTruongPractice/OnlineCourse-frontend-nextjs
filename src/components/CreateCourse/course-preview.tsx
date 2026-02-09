"use client"

import { Eye, Play, FileText, HelpCircle, Globe, Shield, Calendar, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { useEffect, useState } from "react"
import api, { endpoints } from "@/src/utils/api"

interface CoursePreviewProps {
    data: any
    onUpdate: (data: any) => void
}

interface Category {
    id: number;
    name: string;
}

export function CoursePreview({ data, onUpdate }: CoursePreviewProps) {
    const totalLessons = data.chapters?.reduce((total: number, chapter: any) => total + chapter.lessons.length, 0) || 0
    const [categories, setCategories] = useState<Category[]>([])
    const getTotalDuration = () => {
        if (data.chapters) {
            let totalMinutes = 0
            data.chapters.forEach((chapter: any) => {
                chapter.lessons.forEach((lesson: any) => {
                    if (lesson.duration) {
                        totalMinutes += Number.parseInt(lesson.duration) || 0
                    }
                })
            })
            return Math.round(totalMinutes / 60) || 0
        }
        return 0
    }

    const findCategory = (catId: Number) => {
        const item = categories.find(cat => cat.id === catId)
        return item?.name
    }

    const loadCatrgories = async () => {
        try {
            const res = await api.get(endpoints['categories'])
            setCategories(res.data)
        }
        catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        loadCatrgories();
    }, [])


    return (
        <div className="space-y-6">
            {/* Preview Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Xem trước khóa học
                    </CardTitle>
                    <CardDescription>Đây là cách khóa học của bạn sẽ hiển thị với học viên</CardDescription>
                </CardHeader>
            </Card>
            {data.image && <div className="h-48">
                <img
                    src={URL.createObjectURL(data.image || "")}
                    alt="preview"
                    className="mx-auto w-full h-48 object-cover mb-4 rounded"
                />
            </div>}

            {/* Course Preview Card */}
            <Card className="overflow-hidden">
                {/* Course Header */}
                <div className="pl-6">
                    <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">
                        {data.name || "Tên khóa học"}
                    </h1>
                    <p className="mt-1">
                        {findCategory(Number.parseInt(data.category_id)) || "Danh mục"} • {data.level || "Cấp độ"}
                    </p>
                </div>


                <CardContent className="p-6">
                    {/* Course Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{data.chapters?.length || 0}</div>
                            <div className="text-sm text-muted-foreground">Chương</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-secondary">{totalLessons}</div>
                            <div className="text-sm text-muted-foreground">Bài học</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-accent">~{getTotalDuration()}h</div>
                            <div className="text-sm text-muted-foreground">Thời lượng</div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Giá cả</span>
                        </div>
                        <div className="pl-6">
                            <Badge variant={data.price === "0" ? "secondary" : "default"}>
                                {data.pricing_type === "0"
                                    ? "Miễn phí"
                                    : "Đăng ký"}
                            </Badge>
                        </div>
                    </div>

                    {/* Course Description */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Mô tả khóa học</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {data.description || "Mô tả khóa học sẽ hiển thị ở đây..."}
                        </p>
                    </div>

                    {/* Course Content */}
                    {data.sections && data.sections.length > 0 && (
                        <>
                            <Separator className="my-6" />
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Nội dung khóa học</h3>
                                <div className="space-y-3">
                                    {data.sections.map((section: any, index: number) => (
                                        <Card key={section.id} className="border-l-4 border-l-primary/30">
                                            <CardContent className="p-4">
                                                <h4 className="font-medium mb-2">
                                                    Chương {index + 1}: {section.title}
                                                </h4>
                                                <div className="space-y-2">
                                                    {section.items.map((item: any) => {
                                                        const Icon = item.type === "video" ? Play : item.type === "document" ? FileText : HelpCircle
                                                        return (
                                                            <div key={item.id} className="flex items-center gap-3 text-sm text-muted-foreground">
                                                                <Icon className="h-4 w-4" />
                                                                <span>{item.title}</span>
                                                                {item.duration && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {item.duration}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
