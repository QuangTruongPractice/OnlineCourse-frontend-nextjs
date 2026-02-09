import { ForumHeader } from "@/src/components/forum-header";
import { ForumSidebar } from "@/src/components/forum-sidebar";
import { QuestionList } from "@/src/components/question-list";


export default function ForumPage() {
  return (

    <main className="container mx-auto px-4 py-8">
      <ForumHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ForumSidebar />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <QuestionList />
        </div>
      </div>
    </main>
  )

}
