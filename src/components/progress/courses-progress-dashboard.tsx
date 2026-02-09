import {
    BookOpen,
    Clock,
    Trophy,
    Target,
    TrendingUp,
    Play,
    CheckCircle,
    Star,
    FlameIcon as Fire,
    Award,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Button } from "../ui/button"

interface CourseProgress {
    id: string
    title: string
    instructor: string
    progress: number
    totalLessons: number
    completedLessons: number
    totalDuration: string
    completedDuration: string
    estimatedTimeLeft: string
    difficulty: "beginner" | "intermediate" | "advanced"
    category: string
    rating: number
    thumbnail: string
    lastAccessed: string
    weeklyProgress: number[]
    currentStreak: number
    nextLesson: {
        title: string
        duration: string
    }
    achievements: string[]
}

export function CourseProgressDashboard() {
    const courses: CourseProgress[] = [
        {
            id: "1",
            title: "React Fundamentals",
            instructor: "Nguyễn Văn A",
            progress: 75,
            totalLessons: 20,
            completedLessons: 15,
            totalDuration: "12h",
            completedDuration: "9h",
            estimatedTimeLeft: "2h còn lại",
            difficulty: "intermediate",
            category: "Frontend",
            rating: 4.8,
            thumbnail: "/placeholder.svg?height=120&width=200",
            lastAccessed: "Hôm qua",
            weeklyProgress: [10, 15, 20, 35, 50, 65, 75],
            currentStreak: 5,
            nextLesson: {
                title: "React Hooks Advanced",
                duration: "25 phút",
            },
            achievements: ["Hoàn thành 50%", "Học liên tục 5 ngày"],
        },
        {
            id: "2",
            title: "Node.js Backend Development",
            instructor: "Trần Thị B",
            progress: 45,
            totalLessons: 25,
            completedLessons: 11,
            totalDuration: "18h",
            completedDuration: "8h",
            estimatedTimeLeft: "8h còn lại",
            difficulty: "advanced",
            category: "Backend",
            rating: 4.6,
            thumbnail: "/placeholder.svg?height=120&width=200",
            lastAccessed: "3 ngày trước",
            weeklyProgress: [5, 12, 18, 25, 32, 38, 45],
            currentStreak: 0,
            nextLesson: {
                title: "Express.js Middleware",
                duration: "30 phút",
            },
            achievements: ["Bắt đầu khóa học"],
        },
        {
            id: "3",
            title: "UI/UX Design Principles",
            instructor: "Lê Văn C",
            progress: 90,
            totalLessons: 15,
            completedLessons: 13,
            totalDuration: "10h",
            completedDuration: "9h",
            estimatedTimeLeft: "30m còn lại",
            difficulty: "beginner",
            category: "Design",
            rating: 4.9,
            thumbnail: "/placeholder.svg?height=120&width=200",
            lastAccessed: "Hôm nay",
            weeklyProgress: [20, 35, 50, 65, 75, 85, 90],
            currentStreak: 7,
            nextLesson: {
                title: "Design System Creation",
                duration: "20 phút",
            },
            achievements: ["Hoàn thành 50%", "Hoàn thành 75%", "Học liên tục 7 ngày", "Sắp hoàn thành"],
        },
    ]

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "beginner":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "intermediate":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            case "advanced":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }
    }

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case "beginner":
                return "Cơ bản"
            case "intermediate":
                return "Trung bình"
            case "advanced":
                return "Nâng cao"
            default:
                return difficulty
        }
    }

    const totalProgress = Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)
    const totalCompletedLessons = courses.reduce((acc, course) => acc + course.completedLessons, 0)
    const totalLessons = courses.reduce((acc, course) => acc + course.totalLessons, 0)
    const activeStreak = Math.max(...courses.map((course) => course.currentStreak))

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Target className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tiến độ tổng</p>
                                <p className="text-2xl font-bold text-primary">{totalProgress}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent/10 rounded-lg">
                                <BookOpen className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Bài học</p>
                                <p className="text-2xl font-bold">
                                    {totalCompletedLessons}/{totalLessons}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <Fire className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Chuỗi học</p>
                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{activeStreak} ngày</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Khóa học</p>
                                <p className="text-2xl font-bold">{courses.length} đang học</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Course Progress Cards */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Tiến độ khóa học chi tiết
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="border border-border/50 rounded-xl p-6 bg-card/50 hover:bg-card/80 transition-colors"
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Course Thumbnail and Basic Info */}
                                <div className="flex gap-4">
                                    <img
                                        src={course.thumbnail || "/placeholder.svg"}
                                        alt={course.title}
                                        className="w-24 h-16 lg:w-32 lg:h-20 rounded-lg object-cover flex-shrink-0"
                                    />
                                    <div className="space-y-2">
                                        <div>
                                            <h3 className="font-semibold text-lg text-foreground">{course.title}</h3>
                                            <p className="text-sm text-muted-foreground">Giảng viên: {course.instructor}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="outline" className={getDifficultyColor(course.difficulty)}>
                                                {getDifficultyText(course.difficulty)}
                                            </Badge>
                                            <Badge variant="secondary">{course.category}</Badge>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                <span>{course.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Section */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-primary">{course.progress}%</span>
                                                <span className="text-sm text-muted-foreground">hoàn thành</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {course.completedLessons}/{course.totalLessons} bài • {course.completedDuration}/
                                                {course.totalDuration}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">Truy cập: {course.lastAccessed}</p>
                                            {course.currentStreak > 0 && (
                                                <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                                                    <Fire className="h-4 w-4" />
                                                    <span className="text-sm">{course.currentStreak} ngày liên tục</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Progress value={course.progress} className="h-3" />

                                    {/* Next Lesson and Actions */}
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Bài tiếp theo:</p>
                                            <p className="text-sm text-muted-foreground">
                                                {course.nextLesson.title} • {course.nextLesson.duration}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" className="flex items-center gap-2">
                                                <Play className="h-4 w-4" />
                                                Tiếp tục học
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Achievements */}
                                    {course.achievements.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium flex items-center gap-2">
                                                <Award className="h-4 w-4 text-primary" />
                                                Thành tích đạt được:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {course.achievements.map((achievement, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className="text-xs bg-primary/5 text-primary border-primary/20"
                                                    >
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        {achievement}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Time Estimate */}
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/30">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{course.estimatedTimeLeft}</span>
                                        </div>
                                        {course.progress >= 90 && (
                                            <div className="flex items-center gap-1 text-primary">
                                                <Trophy className="h-4 w-4" />
                                                <span>Sắp hoàn thành!</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
