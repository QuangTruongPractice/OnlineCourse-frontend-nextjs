// import { Card, CardContent } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Minh Hoàng",
    role: "Sinh viên IT",
    avatar: "/professional-student-avatar.png",
    content:
      "Nền tảng này đã giúp tôi nâng cao kỹ năng lập trình một cách đáng kể. Các khóa học được thiết kế rất bài bản và dễ hiểu.",
    rating: 5,
  },
  {
    id: 2,
    name: "Trần Thị Mai",
    role: "Designer",
    avatar: "/professional-female-designer-avatar.png",
    content:
      "Tôi đã hoàn thành khóa học UI/UX và cảm thấy rất hài lòng. Giảng viên nhiệt tình, nội dung cập nhật và thực tế.",
    rating: 5,
  },
  {
    id: 3,
    name: "Lê Văn Đức",
    role: "Data Analyst",
    avatar: "/professional-male-analyst-avatar.png",
    content:
      "Khóa học Data Science đã mở ra cho tôi một con đường sự nghiệp mới. Rất cảm ơn đội ngũ giảng viên chuyên nghiệp.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Học viên nói gì về chúng tôi</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hàng nghìn học viên đã tin tưởng và đạt được thành công với nền tảng của chúng tôi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <CardContent className="space-y-4 p-0">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>

                <div className="flex items-center gap-3 pt-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
