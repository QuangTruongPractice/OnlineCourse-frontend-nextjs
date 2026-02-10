"use client"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

export function CTASection() {

    const router = useRouter()

    const handleGetStarted = () => {
        router.push('/course/search')
    }
    return (
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl lg:text-5xl font-black text-balance">
                            Sẵn sàng bắt đầu hành trình
                            <span className="text-primary block">giáo dục số?</span>
                        </h2>
                        <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                            Tham gia cùng hàng nghìn giảng viên và học viên đang sử dụng EduManage để tạo ra trải nghiệm học tập tuyệt
                            vời
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={handleGetStarted} size="lg" className="text-base px-8">
                            Bắt đầu ngay
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Hỗ trợ 24/7</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Không ràng buộc hợp đồng</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
