"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Upload, X, Plus } from "lucide-react"
import api, { endpoints } from "@/src/utils/api"

interface CourseBasicInfoProps {
    data: any
    onUpdate: (data: any) => void
}

interface Category {
    id: number;
    name: string;
}

export function CourseBasicInfo({ data, onUpdate }: CourseBasicInfoProps) {
    const [preview, setPreview] = useState("")
    const [categories, setCategories] = useState<Category[]>([])

    const loadCatrgories = async () => {
        try {
            const res = await api.get(endpoints['categories'])
            setCategories(res.data)
        }
        catch (e) {
            console.log(e)
        }
    }

    const handleInputChange = (field: string, value: string | File | Number) => {
        onUpdate({ ...data, [field]: value })
    }

    useEffect(() => {
        loadCatrgories();
    }, [])

    return (
        <div className="space-y-6">
            {/* Course subject */}
            <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                    Chủ đề khóa học*
                </Label>
                <Input
                    id="subject"
                    placeholder="Nhập chủ đề khóa học của bạn"
                    value={data.subject || ""}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    className="text-lg"
                />
                <p className="text-sm text-muted-foreground">Chủ đề khóa học nên rõ ràng và thu hút học viên</p>
            </div>
            {/* Course name */}
            <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                    Tên khóa học *
                </Label>
                <Input
                    id="name"
                    placeholder="Nhập tên khóa học của bạn"
                    value={data.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-lg"
                />
                <p className="text-sm text-muted-foreground">Tên khóa học nên rõ ràng và thu hút học viên</p>
            </div>

            {/* Course Description */}
            <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium">
                    Mô tả khóa học *
                </Label>
                <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết về khóa học, nội dung và lợi ích mà học viên sẽ nhận được..."
                    value={data.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                />
                <p className="text-sm text-muted-foreground">Mô tả chi tiết sẽ giúp học viên hiểu rõ hơn về khóa học</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                    <Label className="text-base font-medium">Danh mục *</Label>
                    <Select value={String(data.category_id) || ""} onValueChange={(value) => handleInputChange("category_id", Number.parseInt(value))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories?.map(item => (
                                <SelectItem key={item.id} value={String(item?.id)}>{item?.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Level */}
                <div className="space-y-2">
                    <Label className="text-base font-medium">Cấp độ *</Label>
                    <Select value={data.level || ""} onValueChange={(value) => handleInputChange("level", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn cấp độ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="so_cap">Cơ cấp</SelectItem>
                            <SelectItem value="trung_cap">Trung cấp</SelectItem>
                            <SelectItem value="cao_cap">Cao cấp</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="price" className="text-base font-medium">
                        Giá khóa học (VNĐ) *
                    </Label>
                    <Input
                        id="price"
                        type="number"
                        placeholder="0"
                        value={data.price || ""}
                        onChange={(e) => handleInputChange("price", Number.parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">Nhập 0 nếu khóa học miễn phí</p>
                </div>
            </div>

            {/* Course Thumbnail */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Ảnh đại diện khóa học</CardTitle>
                    <CardDescription>Tải lên ảnh đại diện cho khóa học của bạn (khuyến nghị: 1280x720px)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        {preview ? (
                            <img
                                src={preview}
                                alt="preview"
                                className="mx-auto h-32 object-cover mb-4 rounded"
                            />
                        ) : (
                            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        )}
                        <p className="text-sm text-muted-foreground mb-2">Click để chọn file</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF tối đa 10MB</p>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    // hiển thị preview
                                    const url = URL.createObjectURL(file);
                                    setPreview(url);

                                    // truyền file lên state cha hoặc upload
                                    handleInputChange("image", file);
                                }
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-2">
                <Label htmlFor="video_url" className="text-base font-medium">
                    Video giới thiệu khóa học
                </Label>
                <Input
                    id="video_url"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={data.video_url || ""}
                    onChange={(e) => handleInputChange("video_url", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">URL video giới thiệu khóa học (YouTube, Vimeo, etc.)</p>
            </div>
        </div>
    )
}
