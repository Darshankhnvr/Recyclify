// app/(app)/overview/page.jsx
import { currentUser } from '@clerk/nextjs/server';
import { getWasteLogsForUser } from '@/lib/actions/waste.actions'; // Make sure path is correct
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Award, ListChecks, TrendingUp } from 'lucide-react'; // Icons for stats cards

// Helper to format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export default async function OverviewPage() {
    const user = await currentUser();

    if (!user) {
        // This page is inside (app) group, so middleware should protect it.
        // But as a fallback, or if direct access somehow occurs without session.
        // Consider redirecting or showing a more styled unauthorized message.
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
                <p className="text-lg">Please sign in to view your dashboard.</p>
                <Link href="/sign-in">
                    <Button className="mt-4">Sign In</Button>
                </Link>
            </div>
        );
    }

    const wasteLogs = await getWasteLogsForUser();
    let dbUser = null;
    if (user && user.id) { // Check if user and user.id exist
        console.log("[OverviewPage] Fetching points for Clerk userId:", user.id); // ADD THIS
        dbUser = await prisma.user.findUnique({
            where: { id: user.id }, // Ensure this 'id' matches the 'id' in your User table (Clerk's user ID)
            select: { points: true }
        });
        console.log("[OverviewPage] Fetched dbUser for points:", JSON.stringify(dbUser, null, 2)); // ADD THIS
    }
    const totalPoints = dbUser?.points || 0;
    // Assuming 'points' is directly on the Clerk user object synced to your DB
    // Or fetch from your DB: const dbUser = await prisma.user.findUnique({ where: { id: user.id }}); totalPoints = dbUser.points;
    const totalLogs = wasteLogs.length;

    // Simple stat: logs this month (can be made more robust)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const logsThisMonth = wasteLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
    }).length;

    return (
        // The parent app/(app)/layout.jsx likely provides overall padding, so p-4 here might be for specific content alignment
        // Let's assume layout.jsx handles main padding, so we'll focus on content spacing.
        <div className="space-y-8"> {/* Adds vertical spacing between sections */}
            <header>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Welcome Back, {user.firstName || user.username}!
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Here's an overview of your recycling achievements.
                </p>
            </header>

            {/* Stats Cards Section */}
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Points</CardTitle>
                        <Award className="h-5 w-5 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalPoints}</div>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">Keep up the great work!</p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Logs Submitted</CardTitle>
                        <ListChecks className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalLogs}</div>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">Every log makes a difference.</p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Logs This Month</CardTitle>
                        <TrendingUp className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{logsThisMonth}</div>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">Contributing this month!</p>
                    </CardContent>
                </Card>
            </section>

            {/* Recent Waste Logs Section */}
            <Card className="shadow-lg">
                <CardHeader className="border-b dark:border-gray-700">
                    <CardTitle className="text-xl font-semibold">Recent Waste Logs</CardTitle>
                    <CardDescription className="mt-1">
                        Your latest contributions to a greener planet.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6"> {/* Added padding-top to content after header border */}
                    {wasteLogs && wasteLogs.length > 0 ? (
                        <ScrollArea className="h-[350px] w-full pr-3"> {/* Added pr-3 for scrollbar spacing */}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px]">Date</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right w-[100px]">Quantity</TableHead>
                                        <TableHead className="w-[80px]">Unit</TableHead>
                                        <TableHead>Description</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {wasteLogs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <TableCell className="font-medium">{formatDate(log.date)}</TableCell>
                                            <TableCell>{log.wasteType}</TableCell>
                                            <TableCell className="text-right">{log.quantity}</TableCell>
                                            <TableCell>{log.unit}</TableCell>
                                            <TableCell className="truncate max-w-[150px] sm:max-w-[250px] text-sm text-gray-600 dark:text-gray-400">
                                                {log.description || <span className="italic text-gray-400 dark:text-gray-500">No description</span>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    ) : (
                        <div className="text-center py-10">
                            <Recycle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white">No Waste Logged Yet</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Start tracking your recycling efforts to see your progress.
                            </p>
                            <Button asChild>
                                <Link href="/log-waste">Log Your First Item</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}