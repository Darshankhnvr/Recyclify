// app/(app)/overview/page.jsx
import { currentUser } from '@clerk/nextjs/server';
import { getWasteLogsForUser } from '@/lib/actions/waste.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

// Helper to format date (optional)
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default async function OverviewPage() {
  const user = await currentUser();
  
  if (!user) {
    return (
      <div className="p-4">
        <p>Please sign in to view your dashboard.</p>
      </div>
    );
  }

  const wasteLogs = await getWasteLogsForUser();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.firstName || user.username}!</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        This is your personal dashboard. Track your recycling progress below.
      </p>

      {/* Placeholder for Stats - We'll add this later */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recycled (Items)</CardTitle>
            <svg ... /> Some icon ... </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        // Add more stat cards
      </div> */}

      <Card>
        <CardHeader>
          <CardTitle>Recent Waste Logs</CardTitle>
          <CardDescription>
            Here are your most recently logged recycled items. Keep up the great work!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {wasteLogs && wasteLogs.length > 0 ? (
            <ScrollArea className="h-[300px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wasteLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatDate(log.date)}</TableCell>
                      <TableCell>{log.wasteType}</TableCell>
                      <TableCell className="text-right">{log.quantity}</TableCell>
                      <TableCell>{log.unit}</TableCell>
                      <TableCell className="truncate max-w-[200px]">{log.description || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You haven't logged any waste yet. Go to the{" "}
              <a href="/log-waste" className="text-green-600 hover:underline">Log Waste page</a> to add your first entry!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}