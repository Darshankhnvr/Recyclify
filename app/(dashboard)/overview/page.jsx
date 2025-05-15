// app/(dashboard)/overview/page.jsx
import { currentUser } from '@clerk/nextjs/server'; // To get user info server-side

export default async function DashboardOverviewPage() {
  const user = await currentUser(); // This is an async operation

  if (!user) {
    // This should ideally not happen if middleware is set up correctly,
    // but as a safeguard.
    console.error("Dashboard Overview: User not found after sign-in!"); // Add a log
    return <p>You need to be signed in to view this page.</p>;
  }

  console.log("Dashboard Overview: Rendering for user:", user.id); // Add a log

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Welcome, {user.firstName || user.username}!</h2>
      <p>This is your personal dashboard overview.</p>
      <p>Here you'll soon see your waste tracking stats, recent activity, and more.</p>
    </div>
  );
}