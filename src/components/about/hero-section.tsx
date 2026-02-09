"use client"

import { Button } from "../ui/button"
import { ArrowRight, Play, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function HeroSection() {
    const [isVisible, setIsVisible] = useState(false)
    const router = useRouter()

    const goToLogin = () => {
        router.push("user/login/")
    }

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <section className="relative py-20 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

            <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-bounce delay-1000" />
            <div className="absolute top-40 right-20 w-16 h-16 bg-accent/10 rounded-full animate-pulse delay-500" />
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary/5 rounded-full animate-ping delay-2000" />

            <div className="container mx-auto px-4 relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div
                        className={`space-y-8 transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
                    >
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-6xl font-black text-balance leading-tight animate-fade-in-up">
                                Quản lý khóa học
                                <span className="text-primary block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse">
                                    thông minh
                                </span>
                                cho thời đại số
                            </h1>
                            <p
                                className={`text-lg text-muted-foreground text-pretty max-w-lg transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
                            >
                                Nền tảng quản lý khóa học trực tuyến hiện đại, giúp giảng viên và học viên kết nối, học tập hiệu quả với
                                công nghệ tiên tiến.
                            </p>
                        </div>

                        <div
                            className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
                        >
                            <Button
                                onClick={goToLogin}
                                size="lg"
                                className="text-base group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                            >
                                Bắt đầu ngay
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                        </div>

                        <div
                            className={`flex items-center space-x-8 text-sm text-muted-foreground transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
                        >
                            <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-500" />
                                <span>Không cần thẻ tín dụng</span>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`relative transition-all duration-1000 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
                    >
                        <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl">
                            <img
                                src="/modern-online-learning-dashboard-interface.png"
                                alt="Giao diện quản lý khóa học"
                                className="w-full h-full object-cover rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-card border rounded-2xl p-4 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-float">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                                    <BookOpen className="h-6 w-6 text-primary animate-pulse" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">1,000+ khóa học</p>
                                    <p className="text-xs text-muted-foreground">Đang hoạt động</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
