// app/(app)/my-pickups/page.jsx
import { currentUser } from '@clerk/nextjs/server';
import { getPickupRequestsForUser } from '@/lib/actions/pickup.actions'; // Ensure path is correct
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Truck, PackageSearch } from 'lucide-react'; // Icons

// Helper to format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper for status badge styling (using Tailwind classes directly for more control)
// You could also define variants in your badge.jsx if preferred
function getStatusBadgeClasses(status) {
    switch (status) {
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
        case 'SCHEDULED':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300 dark:border-blue-700';
        case 'COMPLETED':
            return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300 dark:border-green-700';
        case 'CANCELLED':
            return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300 dark:border-red-700';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
}

export const metadata = {
    title: 'My Pickup Requests | Recyclify Dashboard',
    description: 'View and manage your scheduled waste pickup requests with Recyclify.',
};

export default async function MyPickupsPage() {
    // const user = await currentUser(); // Not strictly needed if getPickupRequestsForUser handles auth
    const pickupRequests = await getPickupRequestsForUser();

    return (
        <div className="space-y-8">
            {/* Enhanced Header Section */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 dark:border-gray-700 gap-4">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg shadow">
                            <Truck className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            My Pickup Requests
                        </h1>
                    </div>
                    <p className="mt-1 text-md text-gray-600 dark:text-gray-400">
                        Track the status of your requested waste pickups and manage your schedule.
                    </p>
                </div>
                <Button asChild className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                    <Link href="/schedule-pickup">Schedule New Pickup</Link>
                </Button>
            </header>

            {pickupRequests && pickupRequests.length > 0 ? (
                <Card className="shadow-lg border dark:border-gray-700 overflow-hidden"> {/* overflow-hidden for table rounded corners */}
                    <CardHeader className="bg-gray-50 dark:bg-gray-800/30 border-b dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4"> {/* Adjusted padding */}
                        <CardTitle className="text-lg sm:text-xl font-semibold">Your Active & Past Requests</CardTitle>
                        {/* <CardDescription className="mt-1 text-sm">Review your pickup history.</CardDescription> */}
                    </CardHeader>
                    <CardContent className="p-0"> {/* Remove padding for the table */}
                        <div className="overflow-x-auto"> {/* Make table horizontally scrollable on small screens */}
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <TableHead className="px-4 py-3 sm:px-6 font-medium whitespace-nowrap">Requested</TableHead><TableHead className="px-4 py-3 sm:px-6 font-medium whitespace-nowrap">Preferred For</TableHead><TableHead className="px-4 py-3 sm:px-6 font-medium text-center">Status</TableHead><TableHead className="px-4 py-3 sm:px-6 font-medium">Waste Types</TableHead><TableHead className="px-4 py-3 sm:px-6 font-medium">Address</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pickupRequests.map((request) => (
                                        <TableRow key={request.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/60 transition-colors border-b dark:border-gray-700/50">
                                            <TableCell className="px-4 py-3 sm:px-6 whitespace-nowrap">{formatDate(request.createdAt)}</TableCell>
                                            <TableCell className="px-4 py-3 sm:px-6 whitespace-nowrap">{formatDate(request.preferredDate)}</TableCell>
                                            <TableCell className="px-4 py-3 sm:px-6 text-center">
                                                <Badge className={`text-xs font-semibold ${getStatusBadgeClasses(request.status)}`}>
                                                    {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 sm:px-6">
                                                <div className="flex flex-wrap gap-1 max-w-[200px] sm:max-w-xs"> {/* Limit width of this cell */}
                                                    {request.wasteTypes.map((type, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs whitespace-nowrap">
                                                            {type}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 sm:px-6 text-sm text-gray-700 dark:text-gray-300">
                                                {request.address}, {request.city}, {request.postalCode}
                                            </TableCell>
                                            {/* <TableCell className="px-4 py-3 sm:px-6 truncate max-w-[150px] text-xs">{request.userNotes || '-'}</TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="shadow-md border dark:border-gray-700">
                    <CardContent className="py-12 flex flex-col items-center text-center">
                        <PackageSearch className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-6" />
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Pickup Requests Found</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                            It looks like you haven't scheduled any waste pickups yet. Get started by requesting your first one!
                        </p>
                        <Button asChild className="bg-green-600 hover:bg-green-700">
                            <Link href="/schedule-pickup">Schedule Your First Pickup</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}