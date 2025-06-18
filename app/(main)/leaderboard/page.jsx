// app/(main)/leaderboard/page.jsx
import { getLeaderboardUsers } from '@/lib/actions/user.actions'; // Or from leaderboard.actions.js
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // For user images

export const metadata = {
    title: 'Community Leaderboard | Recyclify',
    description: 'See who is leading the charge in recycling efforts on the Recyclify platform.',
};

// Helper to get initials for Avatar fallback
const getInitials = (firstName, lastName, username) => {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (firstName) return firstName.substring(0, 2).toUpperCase();
    if (username) return username.substring(0, 2).toUpperCase();
    return 'U'; // Unknown
};

export default async function LeaderboardPage({ searchParams }) {
    const currentPage = parseInt(searchParams.page) || 1;
    const limit = 20; // Users per page, should match the action's default or be passed

    const {
        users,
        totalUsers,
        totalPages
    } = await getLeaderboardUsers({ page: currentPage, limit: limit });

    const rankOffset = (currentPage - 1) * limit;

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                    Recycling Champions Leaderboard
                </h1>
                <p className="mt-4 text-lg leading-7 text-gray-600 dark:text-gray-300">
                    See who's making the biggest impact! Points are earned by logging recycled waste.
                </p>
            </header>

            {users && users.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Top Recyclers</CardTitle>
                        <CardDescription>
                            Showing users ranked by their total recycling points. Page {currentPage} of {totalPages}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">Rank</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead className="text-right">Points</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user, index) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{rankOffset + index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.imageUrl || undefined} alt={user.username || `${user.firstName} ${user.lastName}`} />
                                                    <AvatarFallback>
                                                        {getInitials(user.firstName, user.lastName, user.username)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {user.firstName && user.lastName
                                                            ? `${user.firstName} ${user.lastName}`
                                                            : user.username || 'Anonymous User'}
                                                    </p>
                                                    {user.username && (user.firstName || user.lastName) && (
                                                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-lg text-green-600">
                                            {user.points}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-2">Leaderboard is Empty</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        No users with points to display yet. Start logging your waste to get on the board!
                    </p>
                    <Link href="/log-waste" className="mt-4 inline-block px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                        Log Your Waste
                    </Link>
                </div>
            )}

            {/* Pagination (similar to Guides page) */}
            {totalPages > 1 && (
                <nav className="mt-12 flex justify-center" aria-label="Pagination">
                    <ul className="flex items-center -space-x-px h-10 text-base">
                        {currentPage > 1 && (
                            <li>
                                <Link
                                    href={`/leaderboard?page=${currentPage - 1}`}
                                    className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    « Prev
                                </Link>
                            </li>
                        )}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                            <li key={pageNumber}>
                                <Link
                                    href={`/leaderboard?page=${pageNumber}`}
                                    aria-current={pageNumber === currentPage ? "page" : undefined}
                                    className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300
                    ${pageNumber === currentPage
                                        ? 'text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700 dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}
                                >
                                    {pageNumber}
                                </Link>
                            </li>
                        ))}
                        {currentPage < totalPages && (
                            <li>
                                <Link
                                    href={`/leaderboard?page=${currentPage + 1}`}
                                    className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    Next »
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>
            )}
        </div>
    );
}