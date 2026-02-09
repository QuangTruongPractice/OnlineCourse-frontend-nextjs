"use client"

import { MessageCircle, Settings, LogOut, FilePlus } from "lucide-react"
import { Card, CardContent } from "../../ui/card"
import { Button } from "../../ui/button"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/src/store/useAuthStore"


export function ProfileActions() {
    const user = useAuthStore((state) => state.user)
    const router = useRouter()

    const goToChat = () => {
        router.push("/chat/1/")
    }

    const goToCreateCourse = () => {
        router.push("/course/create/")
    }

    const goToSetting = () => {
        router.push("/user/update-profile/")
    }

    return (
        <Card className="shadow-xl bg-white/80">
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 font-sans">Hành động</h3>
                <div className="flex flex-col gap-3">

                    {(user?.userRole?.toLowerCase() === "teacher" || user?.userRole === "Giảng viên") && (
                        <Button onClick={goToCreateCourse} variant="outline" className="font-manrope bg-transparent w-full justify-start text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                            <FilePlus className="w-4 h-4 mr-2" />
                            Tạo khóa học
                        </Button>
                    )}

                    <Button onClick={goToSetting} variant="outline" className="font-manrope bg-transparent w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
