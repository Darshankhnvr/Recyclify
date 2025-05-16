// app/(app)/layout.jsx
import Sidebar from '@/components/common/Sidebar';

export default function AppPagesLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow p-6 ...">
        {children}
      </main>
    </div>
  );
}