import { AnswerForm } from "@/src/components/answer-form"
import { AnswerList } from "@/src/components/answer-list"
import { QuestionDetail } from "@/src/components/question-detail"


interface PageProps {
  params: {
    id: string
  }
}

export default function QuestionDetailPage({ params }: PageProps) {
  return (

    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <QuestionDetail questionId={params.id} />
        <AnswerList questionId={params.id} />
        <AnswerForm questionId={params.id} />
      </div>
    </main>

  )
}
