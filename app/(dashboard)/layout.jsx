// app/(dashboard)/layout.jsx
export default function DashboardLayout({ children }) {
  console.log("Rendering DashboardLayout"); // Add a log
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">My Dashboard</h1>
      {children}
    </div>
  );
}