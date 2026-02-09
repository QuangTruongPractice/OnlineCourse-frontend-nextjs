"use client"

import { CheckCircle, Clock, Globe, Zap } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const benefits = [
    {
        icon: Clock,
        title: "Tiết kiệm thời gian",
        description: "Tự động hóa các tác vụ quản lý, giảm 80% thời gian làm việc thủ công.",
    },
    {
        icon: Globe,
        title: "Truy cập mọi lúc mọi nơi",
        description: "Học và dạy từ bất kỳ thiết bị nào, mọi lúc mọi nơi với kết nối internet.",
    },
    {
        icon: Zap,
        title: "Hiệu suất cao",
        description: "Tăng 3x hiệu quả học tập với AI hỗ trợ và phân tích thông minh.",
    },
    {
        icon: CheckCircle,
        title: "Dễ sử dụng",
        description: "Giao diện thân thiện, không cần kiến thức kỹ thuật để bắt đầu.",
    },
]

export function BenefitsSection() {
    const [isVisible, setIsVisible] =  useState(false)
    const [visibleBenefits, setVisibleBenefits] = useState<boolean[]>(new Array(benefits.length).fill(false))
    const sectionRef = useRef<HTMLElement>(null)
    const benefitRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.target === sectionRef.current && entry.isIntersecting) {
                        setIsVisible(true)
                    }

                    const benefitIndex = benefitRefs.current.findIndex((ref) => ref === entry.target)
                    if (benefitIndex !== -1 && entry.isIntersecting) {
                        setVisibleBenefits((prev) => {
                            const newVisible = [...prev]
                            newVisible[benefitIndex] = true
                            return newVisible
                        })
                    }
                })
            },
            { threshold: 0.1 },
        )

        if (sectionRef.current) observer.observe(sectionRef.current)
        benefitRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        return () => observer.disconnect()
    }, [])

    return (
        <section ref={sectionRef} id="benefits" className="py-20 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-0 w-64 h-64 bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-gradient-to-l from-accent/5 to-transparent rounded-full blur-2xl animate-bounce delay-1000" />
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div
                        className={`space-y-8 transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl lg:text-4xl font-black text-balance animate-fade-in-up">
                                Tại sao chọn{" "}
                                <span className="text-primary bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                                    EduManage?
                                </span>
                            </h2>
                            <p className="text-lg text-muted-foreground text-pretty animate-fade-in-up delay-300">
                                Hơn 10,000 giảng viên và tổ chức giáo dục đã tin tưởng sử dụng nền tảng của chúng tôi
                            </p>
                        </div>

                        <div className="space-y-6">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    ref={(el) => { benefitRefs.current[index] = el }}
                                    className={`flex items-start space-x-4 group transition-all duration-700 ${visibleBenefits[index] ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                                        }`}
                                    style={{ transitionDelay: `${index * 150}ms` }}
                                >
                                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                                        <benefit.icon className="h-6 w-6 text-accent group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <div className="space-y-1 group-hover:translate-x-2 transition-transform duration-300">
                                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className={`relative transition-all duration-1000 delay-500 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
                    >
                        <div className="aspect-[4/3] bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl">
                            <img
                                src="/students-learning-online-with-laptops-and-tablets.jpg"
                                alt="Học viên học trực tuyến"
                                className="w-full h-full object-cover rounded-2xl shadow-xl hover:shadow-3xl transition-all duration-500"
                            />
                        </div>
                        <div className="absolute -top-6 -right-6 bg-card border rounded-2xl p-4 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-float">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary animate-pulse">98%</p>
                                <p className="text-xs text-muted-foreground">Hài lòng</p>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -left-4 bg-primary/10 rounded-full p-3 animate-bounce delay-500">
                            <CheckCircle className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
