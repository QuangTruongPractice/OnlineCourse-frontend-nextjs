"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Eye, EyeOff, Camera, Save, X, User, Mail, Phone, Lock, ChevronDown, ChevronUp, Info, Loader2, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import api, { authApis, endpoints, getMediaUrl } from "@/src/utils/api"
import qs from 'qs';
import { useAuthStore } from "@/src/store/useAuthStore"

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const infoProfile = [{
  field: 'username',
  label: 'Tên người dùng',
  icon: <User className="h-4 w-4" />
}, {
  field: 'email',
  label: 'Địa chỉ email',
  icon: <Mail className="h-4 w-4" />
}, {
  field: 'phone',
  label: 'Số điện thoại',
  icon: <Phone className="h-4 w-4" />
}, {
  field: 'address',
  label: 'Địa chỉ',
  icon: <MapPin className="h-4 w-4" />
}, {
  field: 'introduce',
  label: 'Giới thiệu bản thân',
  icon: <Info className="h-4 w-4" />
}]

const infoPassword = [{
  field: 'currentPassword',
  label: 'Mật khẩu hiện tại',
  show: 'current'
}, {
  field: 'newPassword',
  label: 'Mật khẩu mới',
  show: 'new'
}, {
  field: 'confirmPassword',
  label: 'Xác nhận mật khẩu mới',
  show: 'confirm'
}]

export function UpdateProfile() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [profileUpdate, setProfileUpdate] = useState<any | null>(user)
  const [reviewAvtar, setReviewAvatar] = useState<string | null>(null)
  const [msgPassword, setMsgPassword] = useState<string | null>(null)
  const [msgProfile, setMsgProfile] = useState<string | null>(null)

  useEffect(() => {
    if (user && !profileUpdate) {
      setProfileUpdate(user)
    }
  }, [user, profileUpdate])

  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [wantToChangePassword, setWantToChangePassword] = useState(false)

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleProfileChange = (field: string, value: string | File) => {
    setProfileUpdate((prev: any) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const resetPasswordData = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setMsgPassword(null)
  }

  const togglePasswordChange = () => {
    const newState = !wantToChangePassword
    setWantToChangePassword(newState)
    if (!newState) {
      resetPasswordData()
    }
  }

  const validatePassword = () => {
    if (!wantToChangePassword) {
      return true
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    for (let i of infoPassword) {
      if (passwordData[i.field as keyof PasswordData] === '') {
        setMsgPassword("Vui lòng nhập " + i.label + "!")
        return false
      }
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMsgPassword("Mật khẩu xác nhận không khớp.")
      return false
    }

    if (!(regex.test(passwordData.newPassword))) {
      setMsgPassword("Mật khẩu chưa đáp ứng các yêu cầu bên dưới!")
      return false
    }

    setMsgPassword('')
    return true
  }

  const validateCurrentPassword = async () => {
    if (!wantToChangePassword) {
      return true
    }

    try {
      const loginRes = await api.post(endpoints['token'],
        qs.stringify({
          grant_type: 'password',
          username: user.username,
          password: passwordData.currentPassword,
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      return loginRes.status === 200
    } catch (error) {
      setMsgPassword("Mật khẩu hiện tại không đúng!")
      return false
    }
  }

  const handleSave = async () => {
    if (!validatePassword()) return

    if (!profileUpdate) {
      setMsgProfile("Không tìm thấy thông tin người dùng để cập nhật.")
      return
    }

    try {
      setLoading(true)
      setMsgPassword('')
      setMsgProfile('')

      if (wantToChangePassword) {
        const isValidPassword = await validateCurrentPassword()
        if (!isValidPassword) {
          setLoading(false)
          return
        }
      }

      const token = localStorage.getItem('access_token') ?? ''
      const formData = new FormData();

      // Only append fields that exist to avoid sending empty strings for required fields
      if (profileUpdate.first_name) formData.append("first_name", profileUpdate.first_name);
      if (profileUpdate.last_name) formData.append("last_name", profileUpdate.last_name);
      if (profileUpdate.username) formData.append("username", profileUpdate.username);
      if (profileUpdate.email) formData.append("email", profileUpdate.email);
      if (profileUpdate.phone !== undefined && profileUpdate.phone !== null) formData.append("phone", profileUpdate.phone);
      if (profileUpdate.address !== undefined && profileUpdate.address !== null) formData.append("address", profileUpdate.address);
      if (profileUpdate.introduce !== undefined && profileUpdate.introduce !== null) formData.append("introduce", profileUpdate.introduce);

      if (profileUpdate.avatar instanceof File) {
        formData.append("avatar", profileUpdate.avatar);
      }

      if (wantToChangePassword && passwordData.newPassword) {
        formData.append("password", passwordData.newPassword);
      }

      console.log("Submitting Profile Update...");

      const res = await authApis(token).patch(
        endpoints["curent_user"],
        formData
      );

      console.log("update profile res:", res.data)
      updateUser(res.data)

      if (wantToChangePassword) {
        setMsgPassword("Cập nhật thông tin và mật khẩu thành công!")
        resetPasswordData()
        setWantToChangePassword(false)
      } else {
        setMsgProfile("Cập nhật thông tin thành công!")
      }

      // Success redirect
      setTimeout(() => {
        router.push("/user/profile/")
      }, 1500)

    } catch (e: any) {
      console.error("error update profile:", e)
      const errorData = e.response?.data
      let errorMessage = "Có lỗi xảy ra khi cập nhật thông tin!"

      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData
        } else if (Array.isArray(errorData)) {
          errorMessage = errorData[0]
        } else if (typeof errorData === 'object') {
          // Extract specific field errors
          const fieldErrors = Object.entries(errorData)
            .map(([field, errors]) => {
              const errorText = Array.isArray(errors) ? errors[0] : errors
              return `${field}: ${errorText}`
            })
            .join(" | ")
          if (fieldErrors) errorMessage = fieldErrors
        }
      }

      setMsgProfile(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/user/profile/")
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReviewAvatar(URL.createObjectURL(file))
      handleProfileChange('avatar', file)
    }
  }

  const handlePick = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    console.log(passwordData)
  }, [passwordData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="space-y-8">
          {msgProfile && (
            <div className={`p-4 rounded-xl text-center font-medium ${msgProfile.includes('thành công')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
              {msgProfile}
            </div>
          )}

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Ảnh đại diện</CardTitle>
                  <CardDescription className="text-base">Tải lên ảnh đại diện để cá nhân hóa tài khoản</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8 text-center sm:text-left">
                <div className="relative group">
                  <div className="relative">
                    <Avatar className="h-28 w-28 lg:h-32 lg:w-32 ring-4 ring-white shadow-2xl">
                      <AvatarImage src={reviewAvtar || getMediaUrl(profileUpdate?.avatar)} alt="Avatar" />
                      <AvatarFallback className="text-xl lg:text-2xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        {user?.first_name}
                        {user?.last_name}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Camera className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="cursor-pointer absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 h-10 w-10 lg:h-12 lg:w-12 rounded-full p-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                    onClick={handlePick}
                  >
                    <Camera className="h-4 w-4 lg:h-5 lg:w-5" />
                  </Button>
                </div>
                <div className="flex-1 space-y-3 w-full">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 italic">
                    <h4 className="font-semibold text-gray-900 mb-2">Yêu cầu ảnh đại diện</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Định dạng: JPG, PNG, GIF</li>
                      <li>• Khuyến nghị: 400x400px</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
                  <CardDescription className="text-sm lg:text-base text-muted-foreground">Cập nhật thông tin cá nhân của bạn</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                    Tên
                  </Label>
                  <Input
                    id="firstName"
                    value={profileUpdate?.first_name}
                    onChange={(e) => handleProfileChange("first_name", e.target.value)}
                    placeholder="Nhập tên"
                    className="h-12 border-2 border-gray-100 hover:border-blue-200 focus:border-blue-500 rounded-xl transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                    Họ
                  </Label>
                  <Input
                    id="lastName"
                    value={profileUpdate?.last_name}
                    onChange={(e) => handleProfileChange("last_name", e.target.value)}
                    placeholder="Nhập họ"
                    className="h-12 border-2 border-gray-100 hover:border-blue-200 focus:border-blue-500 rounded-xl transition-all"
                  />
                </div>
              </div>

              {infoProfile.map((item) => (
                <div key={item.field} className="space-y-3">
                  <Label htmlFor={item.field} className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </Label>
                  {item.field === 'introduce' ?
                    <textarea
                      id={item.field}
                      value={profileUpdate?.[item.field]}
                      onChange={(e) => handleProfileChange(item.field, e.target.value)}
                      placeholder={item.label}
                      className="min-h-[120px] p-3 w-full border-2 border-gray-100 hover:border-blue-200 focus:border-blue-500 rounded-xl transition-all font-sans"
                    />
                    :
                    <Input
                      id={item.field}
                      value={profileUpdate?.[item.field]}
                      onChange={(e) => handleProfileChange(item.field, e.target.value)}
                      placeholder={item.label}
                      className="h-12 border-2 border-gray-100 hover:border-blue-200 focus:border-blue-500 rounded-xl transition-all"
                    />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader
              className="pb-6 cursor-pointer"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg lg:text-xl truncate">Bảo mật tài khoản</CardTitle>
                    <CardDescription className="text-xs lg:text-sm truncate">
                      {wantToChangePassword ? "Đang thay đổi mật khẩu" : "Nhấp để đổi mật khẩu"}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {wantToChangePassword && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePasswordChange()
                      }}
                      className="h-8 text-[10px] lg:text-xs"
                    >
                      Hủy
                    </Button>
                  )}
                  {showPasswordSection ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              {msgPassword && (
                <div className={`mt-3 p-3 rounded-lg text-sm text-center ${msgPassword.includes('thành công') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {msgPassword}
                </div>
              )}
            </CardHeader>

            {showPasswordSection && (
              <CardContent className="space-y-6">
                {!wantToChangePassword ? (
                  <div className="text-center py-6">
                    <Lock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <Button
                      onClick={togglePasswordChange}
                      className="bg-primary hover:bg-primary/90 rounded-full px-8"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  </div>
                ) : (
                  <>
                    {infoPassword.map((item) => (
                      <div key={item.field} className="space-y-3">
                        <Label htmlFor={item.field} className="text-sm font-semibold text-gray-700">
                          {item.label}
                        </Label>
                        <div className="relative">
                          <Input
                            id={item.field}
                            type={showPasswords[item.show as keyof typeof showPasswords] ? "text" : "password"}
                            value={passwordData[item.field as keyof PasswordData]}
                            onChange={(e) => handlePasswordChange(item.field as keyof PasswordData, e.target.value)}
                            placeholder={item.label}
                            className="h-12 border-2 border-gray-100 hover:border-blue-200 focus:border-blue-500 rounded-xl transition-all pr-12"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => togglePasswordVisibility(item.show as keyof typeof showPasswords)}
                          >
                            {showPasswords[item.show as keyof typeof showPasswords] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            )}
          </Card>
        </div>

        {/* Action Buttons - Sticky on mobile, fixed on desktop */}
        <div className="mt-12 mb-20 lg:mb-0 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto min-w-[140px] h-12 bg-white border-2 border-gray-200 hover:bg-gray-50 shadow-md rounded-xl text-gray-600 font-medium"
          >
            <X className="h-5 w-5 mr-2" />
            Hủy thay đổi
          </Button>
          <Button
            disabled={loading}
            onClick={handleSave}
            className="w-full sm:w-auto min-w-[200px] h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl text-white font-bold"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Lưu thông tin
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
