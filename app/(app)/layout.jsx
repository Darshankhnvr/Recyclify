// app/(app)/layout.jsx
import Sidebar from "@/components/common/Sidebar";

export default function AppPagesLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white">
            <Sidebar />
            <main className="flex-grow p-6 sm:p-10 overflow-y-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-md p-6 text-white">
                    {children}
                </div>
            </main>
        </div>
    );
}
