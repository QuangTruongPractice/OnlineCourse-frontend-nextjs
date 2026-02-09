"use client"

import { MapPin, Calendar, Mail, Phone, GraduationCap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Badge } from "../../ui/badge"
import { useAuthStore } from "@/src/store/useAuthStore"
import { getMediaUrl } from "../../../utils/api"


export function ProfileHeader() {
    const user = useAuthStore((state) => state.user)

    return (

        <div className="rounded-xl p-5 lg:p-8 shadow-xl bg-white/80 border">
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 items-center sm:items-start text-center sm:text-left">
                {/* Avatar Section */}
                <div className="flex-shrink-0 relative">
                    <Avatar className="w-32 h-32 lg:w-40 lg:h-40 border-4 border-primary/20 shadow-lg">
                        <AvatarImage src={getMediaUrl(user?.avatar)} alt="Profile picture" />
                        <AvatarFallback className="text-2xl lg:text-3xl font-bold bg-primary text-primary-foreground">
                            {((user?.last_name || '') + (user?.first_name || ''))
                                .split("")
                                .map((n: any) => n[0])
                                .join("")
                                .toUpperCase() || ''}
                        </AvatarFallback>
                    </Avatar>
                    <div
                        className={`absolute bottom-1 right-1 lg:-bottom-2 lg:-right-2 w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 lg:border-4 border-background ${user?.is_active ? "bg-green-500" : "bg-gray-400"
                            }`}
                        title={user?.is_active ? "Đang hoạt động" : "Không hoạt động"}
                    />
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-4 lg:space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4">
                        <h1 className="text-2xl lg:text-4xl font-bold text-foreground line-clamp-1">{(user?.last_name + " " + user?.first_name)}</h1>
                        <Badge
                            variant="outline"
                            className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border-primary/20 w-fit"
                        >
                            <GraduationCap className="w-4 h-4" />
                            {user?.userRole}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-4 text-base lg:text-lg text-muted-foreground">
                        <span>@{user?.username}</span>
                    </div>

                    <p className="text-foreground leading-relaxed text-sm lg:text-lg max-w-3xl">
                        {user?.introduce || "Cập nhật giới thiệu để mọi người biết thêm về bạn."}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs lg:text-base text-muted-foreground mt-8 pt-6 border-t border-muted/50">
                <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    <span className="truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    <span>{user?.phone || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    <span className="truncate">{user?.address || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    <span>Tham gia từ: {user?.date_joined?.split('T')[0] || "N/A"}</span>
                </div>
            </div>
        </div>
    )
}
