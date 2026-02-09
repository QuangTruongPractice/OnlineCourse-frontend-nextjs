import { NewQuestionForm } from "@/src/components/new-question-form";

export default function NewQuestionPage() {
  return (


    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Đặt câu hỏi mới</h1>
          <p className="text-muted-foreground">
            Hãy mô tả chi tiết câu hỏi của bạn để nhận được câu trả lời tốt nhất
          </p>
        </div>
        <NewQuestionForm />
      </div>
    </main>

  )
}
