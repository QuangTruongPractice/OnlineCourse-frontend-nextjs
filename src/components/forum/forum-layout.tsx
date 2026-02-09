"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import {
    MessageSquare,
    Plus,
    Pin,
    Eye,
    Clock,
    Send,
    User,
    ArrowLeft,
    PinOff
} from "lucide-react"
import { authApis, endpoints } from "@/src/utils/api"
import { toast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { useAuthStore } from "@/src/store/useAuthStore"

interface ForumLayoutProps {
    courseId: string
}

export function ForumLayout({ courseId }: ForumLayoutProps) {
    const user = useAuthStore((state) => state.user)
    const isTeacher = user?.userRole === "Teacher"

    // Forum state
    const [forum, setForum] = useState<IForum | null>(null)
    const [loading, setLoading] = useState(true)

    // Forum creation
    const [showCreateForum, setShowCreateForum] = useState(false)
    const [forumName, setForumName] = useState("")
    const [forumDescription, setForumDescription] = useState("")

    // Topics
    const [topics, setTopics] = useState<ITopic[]>([])
    const [selectedTopic, setSelectedTopic] = useState<ITopic | null>(null)
    const [showNewTopic, setShowNewTopic] = useState(false)
    const [newTopicTitle, setNewTopicTitle] = useState("")
    const [newTopicContent, setNewTopicContent] = useState("")

    // Comments
    const [comments, setComments] = useState<IComment[]>([])
    const [newComment, setNewComment] = useState("")
    const [replyingTo, setReplyingTo] = useState<IComment | null>(null)

    useEffect(() => {
        fetchForumData()
    }, [courseId])

    const fetchForumData = async () => {
        try {
            const token = localStorage.getItem('access_token')

            // Try with auth first if token exists, otherwise use public API
            const api = token ? authApis(token) : (await import('@/src/utils/api')).default

            const forumResponse = await api.get(endpoints.forumByCourse(courseId))
            if (forumResponse.data && forumResponse.data.length > 0) {
                setForum(forumResponse.data[0])
                await fetchTopics(forumResponse.data[0].id)
            }
        } catch (error) {
            console.error('Error fetching forum:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchTopics = async (forumId: number) => {
        try {
            const token = localStorage.getItem('access_token')
            const api = token ? authApis(token) : (await import('@/src/utils/api')).default

            const response = await api.get(endpoints.topicsByForum(forumId.toString()))
            const allTopics = response.data.results || response.data
            // Sort: pinned first, then by created_at descending
            const sorted = allTopics.sort((a: ITopic, b: ITopic) => {
                if (a.is_pinned && !b.is_pinned) return -1
                if (!a.is_pinned && b.is_pinned) return 1
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            })
            setTopics(sorted)
        } catch (error) {
            console.error('Error fetching topics:', error)
        }
    }

    const fetchComments = async (topicId: number) => {
        try {
            const token = localStorage.getItem('access_token')
            const api = token ? authApis(token) : (await import('@/src/utils/api')).default

            const response = await api.get(endpoints.commentsByTopic(topicId.toString()))
            setComments(response.data.results || response.data)
        } catch (error) {
            console.error('Error fetching comments:', error)
        }
    }

    const handleCreateForum = async () => {
        if (!forumName.trim() || !forumDescription.trim()) {
            toast({
                title: "Lỗi",
                description: "Vui lòng điền đầy đủ thông tin",
                variant: "destructive"
            })
            return
        }

        try {
            const token = localStorage.getItem('access_token')
            if (!token) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng đăng nhập lại",
                    variant: "destructive"
                })
                return
            }

            await authApis(token).post(endpoints.forums, {
                course: Number(courseId),
                name: forumName,
                description: forumDescription
            })

            setForumName("")
            setForumDescription("")
            setShowCreateForum(false)
            await fetchForumData()

            toast({
                title: "Thành công",
                description: "Đã tạo diễn đàn mới"
            })
        } catch (error: any) {
            console.error('Error creating forum:', error)
            const errorMsg = error?.response?.status === 403
                ? "Chỉ Teacher mới có thể tạo diễn đàn"
                : "Không thể tạo diễn đàn"
            toast({
                title: "Lỗi",
                description: errorMsg,
                variant: "destructive"
            })
        }
    }

    const handleCreateTopic = async () => {
        if (!newTopicTitle.trim() || !newTopicContent.trim() || !forum) return

        try {
            const token = localStorage.getItem('access_token')
            if (!token) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng đăng nhập để tạo chủ đề",
                    variant: "destructive"
                })
                return
            }

            await authApis(token).post(endpoints.topics, {
                forum: forum.id,
                title: newTopicTitle,
                content: newTopicContent
            })

            setNewTopicTitle("")
            setNewTopicContent("")
            setShowNewTopic(false)
            await fetchTopics(forum.id)

            toast({
                title: "Thành công",
                description: "Đã tạo chủ đề mới"
            })
        } catch (error) {
            console.error('Error creating topic:', error)
            toast({
                title: "Lỗi",
                description: "Không thể tạo chủ đề",
                variant: "destructive"
            })
        }
    }

    const handleSelectTopic = async (topic: ITopic) => {
        setSelectedTopic(topic)
        setReplyingTo(null)
        await fetchComments(topic.id)
    }

    const handleTogglePin = async (topicId: number, currentPinStatus: boolean) => {
        if (!isTeacher) return

        try {
            const token = localStorage.getItem('access_token')
            if (!token) return

            await authApis(token).patch(`/topics/${topicId}/`, {
                is_pinned: !currentPinStatus
            })

            // Refresh topics
            if (forum) {
                await fetchTopics(forum.id)
            }

            // Update selected topic if it's the one being pinned
            if (selectedTopic?.id === topicId) {
                setSelectedTopic({ ...selectedTopic, is_pinned: !currentPinStatus })
            }

            toast({
                title: "Thành công",
                description: !currentPinStatus ? "Đã ghim chủ đề" : "Đã bỏ ghim chủ đề"
            })
        } catch (error) {
            console.error('Error toggling pin:', error)
            toast({
                title: "Lỗi",
                description: "Không thể thay đổi trạng thái ghim",
                variant: "destructive"
            })
        }
    }

    const handleCreateComment = async () => {
        if (!newComment.trim() || !selectedTopic) return

        try {
            const token = localStorage.getItem('access_token')
            if (!token) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng đăng nhập để bình luận",
                    variant: "destructive"
                })
                return
            }

            await authApis(token).post(endpoints.comments, {
                topic: selectedTopic.id,
                content: newComment,
                parent: replyingTo?.id || null
            })

            setNewComment("")
            setReplyingTo(null)
            await fetchComments(selectedTopic.id)

            toast({
                title: "Thành công",
                description: replyingTo ? "Đã trả lời bình luận" : "Đã thêm bình luận"
            })
        } catch (error) {
            console.error('Error creating comment:', error)
            toast({
                title: "Lỗi",
                description: "Không thể thêm bình luận",
                variant: "destructive"
            })
        }
    }

    const handleReply = (comment: IComment) => {
        setReplyingTo(comment)
        setNewComment("")
    }

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // Empty state - no forum
    if (!forum) {
        return (
            <div className="text-center py-16 px-4">
                <MessageSquare className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Chưa có diễn đàn</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Khóa học này chưa có diễn đàn thảo luận.
                    {isTeacher && " Hãy tạo diễn đàn để học viên có thể thảo luận!"}
                </p>

                {isTeacher && (
                    <div className="max-w-md mx-auto">
                        {!showCreateForum ? (
                            <Button
                                onClick={() => setShowCreateForum(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-12 px-8 shadow-lg shadow-blue-500/30"
                                size="lg"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Tạo diễn đàn
                            </Button>
                        ) : (
                            <Card className="border-2 border-blue-100 shadow-xl">
                                <CardContent className="pt-6 space-y-4">
                                    <Input
                                        placeholder="Tên diễn đàn..."
                                        value={forumName}
                                        onChange={(e) => setForumName(e.target.value)}
                                        className="rounded-xl border-slate-200 focus:border-blue-500 h-12 text-base"
                                    />
                                    <Textarea
                                        placeholder="Mô tả diễn đàn..."
                                        value={forumDescription}
                                        onChange={(e) => setForumDescription(e.target.value)}
                                        rows={4}
                                        className="rounded-xl border-slate-200 focus:border-blue-500 resize-none text-base"
                                    />
                                    <div className="flex gap-3">
                                        <Button
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-12"
                                            onClick={handleCreateForum}
                                        >
                                            Tạo diễn đàn
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="px-6 font-bold border-2 rounded-xl h-12"
                                            onClick={() => setShowCreateForum(false)}
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        )
    }

    // Topic detail view
    if (selectedTopic) {
        return (
            <div className="max-w-5xl mx-auto">
                <Card className="border-2 border-slate-100 shadow-xl rounded-2xl overflow-hidden">
                    {/* Header */}
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b-2 border-slate-100 pb-6">
                        <div className="flex items-start justify-between gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedTopic(null)}
                                className="font-bold hover:bg-slate-100 rounded-xl -ml-2"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay lại
                            </Button>

                            {isTeacher && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleTogglePin(selectedTopic.id, selectedTopic.is_pinned)}
                                    className="font-bold border-2 rounded-xl"
                                >
                                    {selectedTopic.is_pinned ? (
                                        <><PinOff className="w-4 h-4 mr-2" /> Bỏ ghim</>
                                    ) : (
                                        <><Pin className="w-4 h-4 mr-2" /> Ghim</>
                                    )}
                                </Button>
                            )}
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center gap-2 mb-3">
                                {selectedTopic.is_pinned && (
                                    <Badge className="bg-amber-100 text-amber-700 border-none font-black text-xs uppercase">
                                        <Pin className="w-3 h-3 mr-1 fill-amber-700" /> Đã ghim
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="text-2xl font-black text-slate-900 mb-3">
                                {selectedTopic.title}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {selectedTopic.user}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {formatDistanceToNow(new Date(selectedTopic.created_at), { addSuffix: true, locale: vi })}
                                </span>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        {/* Original post */}
                        <div className="bg-slate-50 rounded-xl p-6 mb-8">
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {selectedTopic.content}
                            </p>
                        </div>

                        <Separator className="my-8" />

                        {/* Comments section */}
                        <div>
                            <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Bình luận ({comments.length})
                            </h3>

                            <ScrollArea className="max-h-[500px] pr-4">
                                <div className="space-y-4">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className={`${comment.parent ? 'ml-12' : ''}`}>
                                            <Card className="border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
                                                <CardContent className="p-4">
                                                    {/* Parent reference if reply */}
                                                    {comment.parent && (
                                                        <div className="bg-slate-50 border-l-4 border-blue-400 rounded p-3 mb-3 text-sm text-slate-600">
                                                            <span className="font-bold">Trả lời:</span> {
                                                                comments.find(c => c.id === comment.parent)?.content.substring(0, 60)
                                                            }...
                                                        </div>
                                                    )}

                                                    <div className="flex items-start gap-3">
                                                        <Avatar className="w-10 h-10">
                                                            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                                                                {comment.user?.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="font-bold text-slate-900">{comment.user}</span>
                                                                <span className="text-xs text-slate-500">
                                                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: vi })}
                                                                </span>
                                                            </div>
                                                            <p className="text-slate-700 leading-relaxed mb-3 whitespace-pre-wrap">
                                                                {comment.content}
                                                            </p>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleReply(comment)}
                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold h-8 px-3 rounded-lg"
                                                            >
                                                                Trả lời
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            {/* Comment input */}
                            <div className="mt-6">
                                {replyingTo && (
                                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-4 mb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-bold text-sm text-blue-900">Đang trả lời @{replyingTo.user}</span>
                                                <p className="text-sm text-blue-700 mt-1">{replyingTo.content.substring(0, 80)}...</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setReplyingTo(null)}
                                                className="text-blue-600 hover:bg-blue-100"
                                            >
                                                Hủy
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Avatar className="w-10 h-10 flex-shrink-0">
                                        <AvatarFallback className="bg-slate-100 text-slate-700 font-bold">
                                            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <Textarea
                                            placeholder={replyingTo ? "Viết câu trả lời..." : "Viết bình luận..."}
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            rows={3}
                                            className="rounded-xl border-slate-200 focus:border-blue-500 resize-none mb-3"
                                        />
                                        <Button
                                            onClick={handleCreateComment}
                                            disabled={!newComment.trim()}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-10 px-6"
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            {replyingTo ? "Trả lời" : "Gửi"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Topic list view
    return (
        <div className="max-w-5xl mx-auto">
            <Card className="border-2 border-slate-100 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b-2 border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900 mb-2">
                                {forum.name}
                            </CardTitle>
                            <p className="text-slate-600">{forum.description}</p>
                        </div>
                        <Button
                            onClick={() => setShowNewTopic(!showNewTopic)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-blue-500/20"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tạo chủ đề
                        </Button>
                    </div>

                    {/* New topic form */}
                    {showNewTopic && (
                        <div className="mt-6 space-y-4 animate-in slide-in-from-top duration-300">
                            <Input
                                placeholder="Tiêu đề chủ đề..."
                                value={newTopicTitle}
                                onChange={(e) => setNewTopicTitle(e.target.value)}
                                className="rounded-xl border-slate-200 focus:border-blue-500 h-12"
                            />
                            <Textarea
                                placeholder="Nội dung thảo luận..."
                                value={newTopicContent}
                                onChange={(e) => setNewTopicContent(e.target.value)}
                                rows={4}
                                className="rounded-xl border-slate-200 focus:border-blue-500 resize-none"
                            />
                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11"
                                    onClick={handleCreateTopic}
                                    disabled={!newTopicTitle.trim() || !newTopicContent.trim()}
                                >
                                    Đăng bài
                                </Button>
                                <Button
                                    variant="outline"
                                    className="px-6 font-bold border-2 rounded-xl"
                                    onClick={() => setShowNewTopic(false)}
                                >
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="p-6">
                    {topics.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-600 font-medium">Chưa có chủ đề nào. Hãy tạo chủ đề đầu tiên!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {topics.map((topic) => (
                                <Card
                                    key={topic.id}
                                    className={`cursor-pointer border-2 transition-all duration-200 hover:shadow-lg ${topic.is_pinned
                                        ? 'border-amber-200 bg-amber-50/30 hover:border-amber-300'
                                        : 'border-slate-100 hover:border-blue-300'
                                        }`}
                                    onClick={() => handleSelectTopic(topic)}
                                >
                                    <CardContent className="p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {topic.is_pinned && (
                                                        <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[10px] uppercase px-2 py-0.5">
                                                            <Pin className="w-3 h-3 mr-1 fill-amber-700" />
                                                            Ghim
                                                        </Badge>
                                                    )}
                                                    <h3 className="font-bold text-slate-900 text-lg truncate flex-1">
                                                        {topic.title}
                                                    </h3>
                                                </div>
                                                <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                                                    {topic.content}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <User className="w-3.5 h-3.5" />
                                                        {topic.user}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                        {topic.comment_count || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: vi })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
