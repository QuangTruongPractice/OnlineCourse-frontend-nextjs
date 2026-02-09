'use client'
import { Clock, Users, Star, Badge } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Skeleton } from "./ui/skeleton"
import { toast } from "@/hooks/use-toast"
import api, { getMediaUrl, formatDuration } from "../utils/api"

export function FeaturedCourses() {
  const [courses, setCourses] = useState<ICourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true)
        // const response = await courseService.getCourses()
        const res = await api.get('courses/top/')
        console.log(res.data);
        setCourses(res.data)
      } catch (error) {
        console.error('Error loading courses:', error)
        toast({
          title: "Error",
          description: "Could not load courses. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  return (
    <section className="py-12 lg:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Khóa học nổi bật</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Khám phá những khóa học chất lượng cao từ các chuyên gia hàng đầu
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading ? (
            // Loading skeletons
            [...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="w-full h-48" />
                </CardHeader>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </CardFooter>
              </Card>
            ))
          ) : (
            courses.map((course) => (
              <Link key={course.id} href={`/course/${course.id}`}>
                <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <img
                      src={getMediaUrl(course.image)}
                      alt={course.name}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform"
                    />
                  </CardHeader>

                  <CardContent className="flex-1 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                        {course.level === "so_cap"
                          ? "Sơ cấp"
                          : course.level === "trung_cap"
                            ? "Trung cấp"
                            : "Cao cấp"}
                      </Badge>
                    </div>

                    <CardTitle className="text-lg font-semibold mb-2 line-clamp-1">
                      {course.name}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="mt-auto flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.total_student?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(course.duration)}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 flex items-center justify-between border-t">
                    <div>
                      <div className="text-xs text-muted-foreground">Giảng viên</div>
                      <div className="font-medium">{course.lecturer_name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Học phí</div>
                      <div className="font-bold text-primary">
                        {parseInt(course.price).toLocaleString()}đ
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>

            ))
          )}
        </div>
      </div>
    </section>
  )
}
