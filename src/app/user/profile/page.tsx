"use client"

import { EnrolledCourses } from "@/src/components/user/profile/enrolled-courses";
import { ProfileActions } from "@/src/components/user/profile/profile-actions";
import { ProfileHeader } from "@/src/components/user/profile/profile-header";
import { ProfileStats } from "@/src/components/user/profile/profile-stats";
import { ProfileTabs } from "@/src/components/user/profile/profile-tabs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/src/store/useAuthStore";

const Profile = () => {
    const user = useAuthStore((state) => state.user)
    const isRestoring = useAuthStore((state) => state.isRestoring)
    const router = useRouter()

    useEffect(() => {
        if (!isRestoring && !user) {
            router.push('/auth/signin')
        }
    }, [user, isRestoring, router])


    if (isRestoring) return <div className="mx-auto my-auto p-20 text-center">Đang kiểm tra phiên đăng nhập...</div>
    if (!user) return <div className="mx-auto my-auto p-20 text-center">Vui lòng đăng nhập!</div>

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <ProfileHeader />
                        <EnrolledCourses />
                        <ProfileTabs />
                    </div>

                    <div className="space-y-6">
                        <ProfileActions />
                        <ProfileStats />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Profile;
