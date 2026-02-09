"use client"

import { useState } from "react"
import { Banknote, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { authApis, endpoints } from "@/src/utils/api"
import InfiniteScroll from "react-infinite-scroll-component";

export function ProfileTabs() {
    const [myCourse, setMyCourse] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)


    const loadMyCourse = async () => {
        if (!hasMore) return
        try {
            setLoading(true)
            const token = localStorage.getItem('access_token') ?? ''
            let url = `${endpoints['myCourses']}?page=${page}`
            const res = await authApis(token).get(url)
            setMyCourse(prev => [...prev, ...res.data.results])
            if (res.data.next === null) {
                setHasMore(false)
                setPage(0)
            } else {
                setPage(prev => prev + 1)
            }
        } catch (e) {
            console.log("error loadMyCourse: ", e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 ">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-border">
                <button
                    className={`px-4 py-2 font-manrope text-sm font-medium border-b-2 transition-colors  "border-primary text-primary"`
                    }
                >
                    Khóa học sở hữu
                    <span className="ml-2 px-2 py-1 text-xs bg-muted rounded-full">{myCourse.length}</span>
                </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
                <InfiniteScroll
                    dataLength={myCourse.length}
                    next={loadMyCourse}
                    hasMore={hasMore}
                    loader={<p className="text-center p-4">Loading...</p>}
                    endMessage={<p className="text-center p-4">Đã hết khóa học</p>}
                >
                    {myCourse.length === 0 ? <>
                        <div>Bạn chưa sở hữu khóa học nào.</div>
                    </> :
                        myCourse.map((course) => (
                            <Card key={`mycourse${course.id}`} className="hover:shadow-2xl transition-shadow shadow-xl bg-white/80">
                                <CardHeader className="p-4 lg:p-6">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-6">
                                        <img
                                            src={course.image || "/placeholder.svg"}
                                            alt={course.name}
                                            className="w-full sm:w-32 lg:w-48 h-48 sm:h-32 rounded-lg object-cover flex-shrink-0 shadow-md transition-transform hover:scale-105"
                                        />
                                        <div className="flex-1 text-center sm:text-left space-y-2 lg:space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <CardTitle className="font-sans text-xl lg:text-2xl font-bold line-clamp-1">{course.name}</CardTitle>
                                                <Badge variant={"secondary"} className="w-fit mx-auto sm:mx-0 px-2 py-1 text-xs font-semibold uppercase tracking-wider">
                                                    {course.subject}
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground text-sm lg:text-base line-clamp-2 leading-relaxed">{course.description}</p>
                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 lg:pt-4">
                                                <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
                                                    {course.category_name}
                                                </Badge>
                                                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 border-l pl-3 border-muted">
                                                    Giảng viên: <span className="text-foreground">{course.lecturer_name}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-6 pt-0 lg:pt-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-xl border border-border/50">
                                        <div className="flex items-center justify-center sm:justify-start gap-2.5 text-sm font-medium text-muted-foreground">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <Clock className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="font-manrope">{course.duration} phút</span>
                                        </div>
                                        <div className="flex items-center justify-center sm:justify-start gap-2.5 text-sm font-medium text-muted-foreground">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <Users className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="font-manrope">{course.total_student} học viên</span>
                                        </div>
                                        <div className="flex items-center justify-center sm:justify-start gap-2.5 text-sm font-bold text-green-600">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <Banknote className="w-4 h-4" />
                                            </div>
                                            <span className="font-manrope">{(parseInt(course.price)).toLocaleString()} vnđ</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </InfiniteScroll>
            </div>
        </div>
    )
}
