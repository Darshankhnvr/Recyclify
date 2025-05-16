import Sidebar from "@/components/common/Sidebar";

// app/(dashboard)/layout.jsx
export default function DashboardLayout({ children }) {
  console.log("Rendering DashboardLayout"); // Add a log
  return (
     <div className="flex">
      <Sidebar />
      <main className="flex-grow p-6 bg-white dark:bg-gray-900 min-h-[calc(100vh-theme(spacing.16))]"> {/* Adjust min-height if needed based on navbar height */}
        {children}
      </main>
    </div>
  );
}