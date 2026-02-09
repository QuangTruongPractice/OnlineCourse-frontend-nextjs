// app/login/page.tsx (Next.js 13+ App Router)
// Nếu bạn dùng Next.js 12 thì đặt ở pages/login.tsx

"use client";

import api, { authApis, endpoints } from "@/src/utils/api";
import { useState } from "react";
import qs from 'qs';
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react'
import { Loader2 } from "lucide-react";

import { useAuthStore } from "@/src/store/useAuthStore";

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const login = useAuthStore((state) => state.login)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            const res = await api.post(endpoints['token'],
                qs.stringify({
                    grant_type: 'password',
                    username,
                    password,
                    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                    client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            if (res.status === 200) {
                const token = res.data.access_token
                const userRes = await authApis(token).get(endpoints['curent_user'])

                login(userRes.data, token)
                router.push('/')
            }
        } catch (e) {
            console.log("error get token:", e)
            toast({
                title: "Thông báo",
                description: "Tên đăng nhập hoặc mật khẩu không đúng",
                variant: 'destructive'
            })
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 lg:p-8 bg-slate-50">
            <div className="flex flex-col lg:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-[1000px] border-none">

                {/* Left Side: Image/Illustration - Hidden on mobile, shown on large screens */}
                <div className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center p-12">
                    <div className="text-center space-y-6">
                        <img
                            src="https://res.cloudinary.com/dxw8gtpd8/image/upload/v1758656813/9423.jpg_wh860_wm4pxq.jpg"
                            alt="school-system"
                            className="w-full max-w-sm rounded-2xl shadow-lg mix-blend-luminosity opacity-90"
                        />
                        <div className="text-white space-y-2">
                            <h3 className="text-2xl font-bold">Chào mừng trở lại!</h3>
                            <p className="text-blue-100 italic">Tiếp tục hành trình chinh phục kiến thức cùng EduManageTTT</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                            Đăng nhập
                        </h2>
                        <p className="text-muted-foreground">Hệ thống quản lý khóa học EduManageTTT</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Tên đăng nhập</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50/50"
                                placeholder="Nhập tên đăng nhập"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Mật khẩu</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50/50"
                                placeholder="Nhập mật khẩu"
                                required
                            />
                            <div className="flex justify-end pt-1">
                                <a href="#" className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                    Quên mật khẩu?
                                </a>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Đang đăng nhập...
                                    </>
                                ) : (
                                    "Đăng nhập ngay"
                                )}
                            </button>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-muted-foreground">Hoặc tiếp tục với</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 border-2 border-gray-100 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-200 active:scale-[0.98] transition-all font-medium text-gray-700"
                                onClick={() => signIn('google', { callbackUrl: '/' })}
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
                                Google
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center sm:text-left text-sm text-gray-600">
                        Chưa có tài khoản?{" "}
                        <button className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                            onClick={() => router.push('/auth/register')}
                        >
                            Đăng ký tài khoản mới
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
