import { Loader2, BookOpen } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl z-[9999] animate-in fade-in duration-500">
            <div className="flex flex-col items-center gap-8 group">
                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
                    <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border border-slate-100">
                        <BookOpen className="w-12 h-12 text-blue-600 animate-bounce transition-all" />
                    </div>
                    <Loader2 className="absolute -bottom-2 -right-2 h-10 w-10 animate-spin text-indigo-600 stroke-[3]" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Đang chuẩn bị bài học</h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Học tập không giới hạn</p>
                </div>
            </div>
        </div>
    );
}
