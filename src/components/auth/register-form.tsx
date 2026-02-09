"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, User, Lock, Phone, AlertCircle, Loader2 } from "lucide-react"

import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import api from "@/src/utils/api"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export function RegisterForm() {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter()

    const [userRole, setUserRole] = useState<"student" | "teacher">("student")
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
    })

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
        first_name: "",
        last_name: "",
    })

    const validateField = (name: string, value: string) => {
        let error = ""
        switch (name) {
            case "first_name":
            case "last_name":
                if (!value.trim()) {
                    error = name === "first_name" ? "Vui lòng nhập họ" : "Vui lòng nhập tên"
                } else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(value)) {
                    error = "Chỉ được nhập chữ cái và khoảng trắng"
                }
                break
            case "username":
                if (value.length < 3) {
                    error = "Tên đăng nhập phải có ít nhất 3 ký tự"
                }
                break
            case "email":
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = "Email không hợp lệ"
                }
                break
            case "phone":
                if (!/^[0-9]{10}$/.test(value)) {
                    error = "Số điện thoại phải có 10 chữ số"
                }
                break
            case "password":
                if (value.length < 6) {
                    error = "Mật khẩu phải có ít nhất 6 ký tự"
                } else if (!/[A-Z]/.test(value)) {
                    error = "Mật khẩu phải chứa ít nhất 1 chữ hoa"
                } else if (!/[a-z]/.test(value)) {
                    error = "Mật khẩu phải chứa ít nhất 1 chữ thường"
                } else if (!/[0-9]/.test(value)) {
                    error = "Mật khẩu phải chứa ít nhất 1 số"
                }
                break
            case "confirm_password":
                if (value !== formData.password) {
                    error = "Mật khẩu xác nhận không khớp"
                }
                break
        }
        return error
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        const error = validateField(name, value)
        setErrors(prev => ({
            ...prev,
            [name]: error
        }))

        // Update confirm password error when password changes
        if (name === "password" && formData.confirm_password) {
            const confirmError = value !== formData.confirm_password ? "Mật khẩu xác nhận không khớp" : ""
            setErrors(prev => ({
                ...prev,
                confirm_password: confirmError
            }))
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate all fields
        let hasErrors = false
        const newErrors = {
            first_name: validateField("first_name", formData.first_name),
            last_name: validateField("last_name", formData.last_name),
            username: validateField("username", formData.username),
            email: validateField("email", formData.email),
            phone: validateField("phone", formData.phone),
            password: validateField("password", formData.password),
            confirm_password: validateField("confirm_password", formData.confirm_password)
        }

        setErrors(newErrors)

        if (Object.values(newErrors).some(error => error !== "")) {
            toast({
                title: "Lỗi",
                description: "Vui lòng kiểm tra lại thông tin đăng ký",
                variant: "destructive"
            })
            return
        }

        try {
            setLoading(true)
            const response = await api.post(`/users/register-${userRole}/`, {
                first_name: formData.first_name,
                last_name: formData.last_name,
                username: formData.username,
                password: formData.password,
                confirm_password: formData.confirm_password,
                email: formData.email,
                phone: formData.phone
            })

            if (response.status === 201) {
                toast({
                    title: "Thành công",
                    description: userRole === "student"
                        ? "Đăng ký tài khoản học viên thành công"
                        : "Đăng ký tài khoản giảng viên thành công"
                })
                router.push('/auth/signin')
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Có lỗi xảy ra khi đăng ký"
            toast({
                title: "Lỗi",
                description: message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="text-center space-y-4 pb-6 lg:pb-8 pt-6 lg:pt-10">
                <div className="mx-auto w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300 shadow-xl">
                    <User className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div className="space-y-2 px-4">
                    <CardTitle className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900">
                        Tạo tài khoản mới
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm lg:text-base">
                        Đăng ký để bắt đầu hành trình học tập của bạn
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 px-6 lg:px-10 pb-10">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Role selection */}
                    <div className="grid grid-cols-2 gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <button
                            type="button"
                            onClick={() => setUserRole("student")}
                            className={`flex flex-col items-center justify-center p-3 lg:p-4 rounded-lg border-2 transition-all duration-300 ${userRole === "student"
                                ? "border-blue-500 bg-white text-blue-700 shadow-md transform scale-[1.02]"
                                : "border-transparent text-gray-500 hover:text-blue-600"
                                }`}
                        >
                            <span className="text-2xl mb-1 lg:mb-2">👨‍🎓</span>
                            <span className="text-xs lg:text-sm font-bold uppercase tracking-wider">Học viên</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserRole("teacher")}
                            className={`flex flex-col items-center justify-center p-3 lg:p-4 rounded-lg border-2 transition-all duration-300 ${userRole === "teacher"
                                ? "border-blue-500 bg-white text-blue-700 shadow-md transform scale-[1.02]"
                                : "border-transparent text-gray-500 hover:text-blue-600"
                                }`}
                        >
                            <span className="text-2xl mb-1 lg:mb-2">👩‍🏫</span>
                            <span className="text-xs lg:text-sm font-bold uppercase tracking-wider">Giảng viên</span>
                        </button>
                    </div>

                    {/* Name fields - Side by side on larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name" className="text-sm font-semibold text-gray-700 ml-1">Họ</Label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors w-4 h-4" />
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    placeholder="Vd: Nguyễn"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className={`pl-10 h-12 bg-white/50 border-gray-100 focus:border-blue-500 rounded-xl transition-all ${errors.first_name ? 'border-red-500' : ''}`}
                                    required
                                />
                            </div>
                            {errors.first_name && (
                                <p className="text-[10px] text-red-500 ml-1 mt-1 leading-tight flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.first_name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name" className="text-sm font-semibold text-gray-700 ml-1">Tên</Label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors w-4 h-4" />
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    placeholder="Vd: An"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className={`pl-10 h-12 bg-white/50 border-gray-100 focus:border-blue-500 rounded-xl transition-all ${errors.last_name ? 'border-red-500' : ''}`}
                                    required
                                />
                            </div>
                            {errors.last_name && (
                                <p className="text-[10px] text-red-500 ml-1 mt-1 leading-tight flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.last_name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Username field */}
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-semibold text-gray-700 ml-1">Tên đăng nhập</Label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors w-4 h-4" />
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Tên tài khoản của bạn"
                                value={formData.username}
                                onChange={handleChange}
                                className={`pl-10 h-12 bg-white/50 border-gray-200 focus:border-blue-500 rounded-xl transition-all ${errors.username ? 'border-red-500' : ''}`}
                                required
                            />
                        </div>
                        {errors.username && (
                            <p className="text-[10px] text-red-500 ml-1 mt-1 leading-tight flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3" /> {errors.username}
                            </p>
                        )}
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors w-4 h-4" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`pl-10 h-12 bg-white/50 border-gray-200 focus:border-blue-500 rounded-xl transition-all ${errors.email ? 'border-red-500' : ''}`}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 ml-1">Số điện thoại</Label>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors w-4 h-4" />
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="0xxxxxxxxx"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`pl-10 h-12 bg-white/50 border-gray-200 focus:border-blue-500 rounded-xl transition-all ${errors.phone ? 'border-red-500' : ''}`}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-gray-700 ml-1">Mật khẩu</Label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors w-4 h-4" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`pl-10 pr-10 h-12 bg-white/50 border-gray-200 focus:border-blue-500 rounded-xl transition-all ${errors.password ? 'border-red-500' : ''}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password" className="text-sm font-semibold text-gray-700 ml-1">Xác nhận</Label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors w-4 h-4" />
                                <Input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="********"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    className={`pl-10 pr-10 h-12 bg-white/50 border-gray-200 focus:border-blue-500 rounded-xl transition-all ${errors.confirm_password ? 'border-red-500' : ''}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Password requirements chip */}
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-4">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Lưu ý bảo mật:</h4>
                            <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                                Mật khẩu của bạn nên chứa ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường và 1 số để đảm bảo an toàn tối đa cho tài khoản.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 text-lg rounded-xl transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                        disabled={loading || Object.values(errors).some(error => error !== "")}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>Đang đăng ký học...</span>
                            </div>
                        ) : "Đăng ký ngay"}
                    </Button>
                </form>

                <div className="pt-6 text-center border-t border-gray-100 mt-2">
                    <p className="text-sm font-medium text-gray-500">
                        Đã có tài khoản?{" "}
                        <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800 transition-colors font-bold underline-offset-4 hover:underline">
                            Quay lại đăng nhập
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
