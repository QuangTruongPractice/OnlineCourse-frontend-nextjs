"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { BookOpen, Users, BarChart3, Video, MessageSquare, Shield } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const features = [
    {
        icon: BookOpen,
        title: "Quản lý khóa học",
        description: "Tạo, chỉnh sửa và tổ chức khóa học một cách dễ dàng với giao diện trực quan.",
    },
    {
        icon: Users,
        title: "Quản lý học viên",
        description: "Theo dõi tiến độ học tập, quản lý thông tin và tương tác với học viên hiệu quả.",
    },
    {
        icon: Video,
        title: "Học trực tuyến",
        description: "Hỗ trợ video HD, livestream và các công cụ tương tác trong thời gian thực.",
    },
    {
        icon: BarChart3,
        title: "Báo cáo & Phân tích",
        description: "Thống kê chi tiết về hiệu suất học tập và engagement của học viên.",
    },
    {
        icon: MessageSquare,
        title: "Tương tác & Thảo luận",
        description: "Diễn đàn thảo luận, chat trực tiếp và hệ thống Q&A tích hợp.",
    },
    {
        icon: Shield,
        title: "Bảo mật cao",
        description: "Mã hóa dữ liệu, xác thực 2 lớp và tuân thủ các tiêu chuẩn bảo mật quốc tế.",
    },
]

export function FeaturesSection() {
    const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(features.length).fill(false))
    const cardRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = cardRefs.current.findIndex((ref) => ref === entry.target)
                        if (index !== -1) {
                            setVisibleCards((prev) => {
                                const newVisible = [...prev]
                                newVisible[index] = true
                                return newVisible
                            })
                        }
                    }
                })
            },
            { threshold: 0.1 },
        )

        cardRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        return () => observer.disconnect()
    }, [])

    return (
        <section id="features" className="py-20 bg-muted/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-pulse" />
                <div className="absolute bottom-20 right-10 w-24 h-24 bg-accent/5 rounded-full animate-bounce delay-1000" />
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="text-center space-y-4 mb-16 scroll-reveal">
                    <h2 className="text-3xl lg:text-4xl font-black text-balance animate-fade-in-up">
                        Tính năng{" "}
                        <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient">
                            vượt trội
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto animate-fade-in-up delay-300">
                        Khám phá những tính năng mạnh mẽ giúp bạn xây dựng và quản lý khóa học chuyên nghiệp
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            ref={(el) => { cardRefs.current[index] = el }}
                            className={`transition-all duration-700 ${visibleCards[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-500 card-hover group bg-card/50 backdrop-blur-sm hover:bg-card">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                                        <feature.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
