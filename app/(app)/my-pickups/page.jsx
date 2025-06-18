// app/(app)/my-pickups/page.jsx
import { currentUser } from '@clerk/nextjs/server';
import { getPickupRequestsForUser } from '@/lib/actions/pickup.actions';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // To display status and waste types
import { Button } from '@/components/ui/button'; // For a "Schedule New Pickup" button

// Helper to format date (optional)
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function getStatusBadgeVariant(status) {
    switch (status) {
        case 'PENDING': return 'yellow'; // You might need to define custom variants in Badge
        case 'SCHEDULED': return 'blue';
        case 'COMPLETED': return 'green';
        case 'CANCELLED': return 'destructive'; // Uses red by default
        default: return 'secondary';
    }
}


export const metadata = {
    title: 'My Pickup Requests | Recyclify',
    description: 'View and manage your scheduled waste pickup requests.',
};

export default async function MyPickupsPage() {
    const user = await currentUser(); // Good to have for personalization if needed
    const pickupRequests = await getPickupRequestsForUser();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        My Pickup Requests
                    </h1>
                    <p className="mt-1 text-md text-gray-600 dark:text-gray-300">
                        View the status of your requested waste pickups.
                    </p>
                </div>
                <Link href="/schedule-pickup" legacyBehavior>
                    <Button>Schedule New Pickup</Button>
                </Link>
            </div>

            {pickupRequests && pickupRequests.length > 0 ? (
                <Card>
                    <CardContent className="p-0"> {/* Remove default CardContent padding if table has its own */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Requested On</TableHead>
                                    <TableHead>Preferred Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Waste Types</TableHead>
                                    <TableHead>Address</TableHead>
                                    {/* <TableHead>Notes</TableHead> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pickupRequests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell>{formatDate(request.createdAt)}</TableCell>
                                        <TableCell>{formatDate(request.preferredDate)}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(request.status)}>
                                                {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {request.wasteTypes.map((type, index) => (
                                                <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                                                    {type}
                                                </Badge>
                                            ))}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {request.address}, {request.city}, {request.postalCode}
                                        </TableCell>
                                        {/* <TableCell className="truncate max-w-[150px] text-xs">{request.userNotes || '-'}</TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>No Pickup Requests Yet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            You haven't scheduled any pickups.
                        </p>
                        <Link href="/schedule-pickup" legacyBehavior>
                            <Button variant="default">Schedule Your First Pickup</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}