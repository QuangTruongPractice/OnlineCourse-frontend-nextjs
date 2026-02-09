"use client"

import { Card, CardContent } from "../ui/card"
import { Star } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const testimonials = [
    {
        name: "Nguyễn Thị Mai",
        role: "Giảng viên Đại học",
        content:
            "EduManage đã thay đổi hoàn toàn cách tôi quản lý khóa học. Giao diện trực quan và tính năng phong phú giúp tôi tiết kiệm rất nhiều thời gian.",
        rating: 5,
    },
    {
        name: "Trần Văn Hùng",
        role: "Giám đốc Trung tâm đào tạo",
        content:
            "Từ khi sử dụng EduManage, số lượng học viên của chúng tôi tăng 200%. Hệ thống báo cáo chi tiết giúp chúng tôi hiểu rõ hơn về nhu cầu học tập.",
        rating: 5,
    },
    {
        name: "Lê Thị Hoa",
        role: "Học viên",
        content:
            "Tôi yêu thích cách học trực tuyến trên EduManage. Video chất lượng cao, tương tác tốt với giảng viên và bạn học làm tôi học hiệu quả hơn.",
        rating: 5,
    },
]

export function TestimonialsSection() {
    const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(testimonials.length).fill(false))
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
        <section id="testimonials" className="py-20 bg-muted/30 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-10 right-1/4 w-20 h-20 bg-primary/10 rounded-full animate-ping delay-1000" />
                <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-accent/10 rounded-full animate-bounce delay-2000" />
                <div className="absolute top-1/2 left-10 w-12 h-12 bg-primary/5 rounded-full animate-pulse delay-500" />
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl lg:text-4xl font-black text-balance animate-fade-in-up">
                        Khách hàng{" "}
                        <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient">
                            nói gì
                        </span>{" "}
                        về chúng tôi
                    </h2>
                    <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto animate-fade-in-up delay-300">
                        Hàng nghìn người dùng đã chia sẻ trải nghiệm tích cực với EduManage
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            ref={(el) => { cardRefs.current[index] = el }}
                            className={`transition-all duration-700 ${visibleCards[index] ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                                }`}
                            style={{ transitionDelay: `${index * 200}ms` }}
                        >
                            <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-500 card-hover group bg-card/80 backdrop-blur-sm hover:bg-card">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center space-x-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-4 w-4 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300"
                                                style={{ transitionDelay: `${i * 50}ms` }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="pt-4 border-t group-hover:border-primary/20 transition-colors duration-300">
                                        <p className="font-semibold group-hover:text-primary transition-colors duration-300">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
