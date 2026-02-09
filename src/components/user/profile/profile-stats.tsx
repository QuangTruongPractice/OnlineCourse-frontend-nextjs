import { BookOpen } from "lucide-react"
import { Card, CardContent } from "../../ui/card"
import { useEffect, useState } from "react"
import { authApis, endpoints } from "@/src/utils/api"

export function ProfileStats() {
    const [conut, setCount] = useState(0)

    const loadCourseComplete = async () => {
        try {
            const token = localStorage.getItem('access_token')
            if (!token) return
            const res = await authApis(token).get(endpoints['courseComplete'])
            setCount(res.data.count_course_complete)
        } catch (e) {
            console.log("err loadCourseComplete", e)
        }
    }

    useEffect(() => {
        loadCourseComplete()
    }, [])

    return (
        <Card className="shadow-xl bg-white/80">
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 font-sans">Thống kê học tập</h3>
                <div className="space-y-4">
                    <div
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BookOpen className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground font-manrope">Khóa học đã hoàn thành</div>
                                <div className="text-lg font-bold text-foreground font-sans">{conut}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
