// app/(main)/layout.jsx
export default function MainLayout({ children }) {
  return (
    // The global Navbar and Footer are already in the root layout.
    // This layout is for specific styling or components for the main public section.
    // For now, just a simple container. Add more styling as needed.
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  );
}