

import { RegisterForm } from "@/src/components/auth/register-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Đăng ký | EduManageTTT",
    description: "Tạo tài khoản mới để bắt đầu hành trình học tập của bạn.",
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <RegisterForm />
            </div>
        </div>
    )
}
