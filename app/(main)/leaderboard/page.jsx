// app/(main)/leaderboard/page.jsx
import { getLeaderboardUsers } from '@/lib/actions/user.actions';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Award, TrendingUp, Trophy } from 'lucide-react'; // Icons

export const metadata = {
    title: 'Community Leaderboard | Recyclify',
    description: 'See who is leading the charge in recycling efforts and making the biggest impact on the Recyclify platform.',
};

// Helper to get initials for Avatar fallback
const getInitials = (firstName, lastName, username) => {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (firstName) return firstName.substring(0, 2).toUpperCase();
    if (username) return username.substring(0, 2).toUpperCase();
    return '??'; // Fallback for anonymous or no name
};

export default async function LeaderboardPage({ searchParams }) {
    const currentPage = parseInt(searchParams?.page) || 1; // Added optional chaining
    const limit = 15; // Adjusted limit slightly for potentially better display density
    const rankOffset = (currentPage - 1) * limit;

    const { users, totalUsers, totalPages } = await getLeaderboardUsers({ page: currentPage, limit });

    const getRankClass = (rank) => {
        if (rank === 1) return 'text-yellow-500 dark:text-yellow-400'; // Gold
        if (rank === 2) return 'text-slate-500 dark:text-slate-400';   // Silver
        if (rank === 3) return 'text-orange-600 dark:text-orange-500'; // Bronze
        return 'text-gray-700 dark:text-gray-300';
    };

    return (
        <div className="bg-slate-50 dark:bg-gray-900 min-h-screen"> {/* Consistent page background */}
            <div className="container mx-auto px-4 py-12 sm:py-16">
                {/* Enhanced Header Section */}
                <header className="mb-12 md:mb-16 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-xl shadow-lg mb-6">
                        <Trophy className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 dark:text-white sm:text-5xl">
                        Recycling Champions
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Meet our community's top contributors! Points are earned by logging recycled waste and participating in green initiatives.
                    </p>
                </header>

                {users && users.length > 0 ? (
                    <Card className="overflow-hidden shadow-xl border dark:border-gray-700"> {/* Added overflow-hidden for rounded corners on table */}
                        <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700">
                            <CardTitle className="text-xl sm:text-2xl">Top {limit} Recyclers</CardTitle>
                            <CardDescription className="mt-1">
                                Page {currentPage} of {totalPages} • {totalUsers} active participants.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0"> {/* Remove padding for table to span full width */}
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-100 dark:bg-slate-800">
                                        <TableHead className="w-16 sm:w-20 text-center font-semibold">Rank</TableHead>
                                        <TableHead className="font-semibold">User</TableHead>
                                        <TableHead className="text-right font-semibold pr-4 sm:pr-6">Points</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user, index) => {
                                        const rank = rankOffset + index + 1;
                                        return (
                                            <TableRow key={user.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/70 transition-colors">
                                                <TableCell className={`text-center font-bold text-lg ${getRankClass(rank)}`}>
                                                    {rank === 1 && <Award className="inline-block h-5 w-5 mr-1 -mt-1" />}
                                                    {rank === 2 && <Award className="inline-block h-5 w-5 mr-1 -mt-1 fill-slate-500 text-slate-500" />}
                                                    {rank === 3 && <Award className="inline-block h-5 w-5 mr-1 -mt-1 fill-orange-600 text-orange-600" />}
                                                    {rank}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3 sm:space-x-4 py-2">
                                                        <Avatar className="h-10 w-10 sm:h-11 sm:w-11 border-2 border-slate-200 dark:border-slate-700">
                                                            <AvatarImage src={user.imageUrl || undefined} alt={user.username || `${user.firstName} ${user.lastName}`} />
                                                            <AvatarFallback className="text-sm bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                                {getInitials(user.firstName, user.lastName, user.username)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white">
                                                                {user.firstName && user.lastName
                                                                    ? `${user.firstName} ${user.lastName}`
                                                                    : user.username || 'Eco Warrior'}
                                                            </p>
                                                            {user.username && (user.firstName || user.lastName) && (
                                                                <p className="text-xs text-muted-foreground dark:text-gray-400">@{user.username}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-xl sm:text-2xl text-green-600 dark:text-green-400 pr-4 sm:pr-6">
                                                    {user.points.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="text-center py-16 md:py-20 bg-white dark:bg-gray-800/50 rounded-xl shadow-md border dark:border-gray-700">
                        <TrendingUp className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-6" />
                        <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">Leaderboard is Still Growing!</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                            Be the first to appear! Log your recycling activities to earn points and climb the ranks.
                        </p>
                        <Button asChild className="bg-green-600 hover:bg-green-700">
                            <Link href="/log-waste">Log Your Waste</Link>
                        </Button>
                    </div>
                )}

                {/* Pagination (similar to previous examples, ensure styling is consistent) */}
                {totalPages > 1 && (
                    <nav className="mt-12 md:mt-16 flex justify-center" aria-label="Pagination">
                        <ul className="flex items-center -space-x-px h-10 text-base">
                            {currentPage > 1 && (
                                <li>
                                    <Link
                                        href={`/leaderboard?page=${currentPage - 1}`}
                                        className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    >
                                        <span className="sr-only">Previous</span>« Prev
                                    </Link>
                                </li>
                            )}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                                <li key={pageNumber}>
                                    <Link
                                        href={`/leaderboard?page=${pageNumber}`}
                                        aria-current={pageNumber === currentPage ? "page" : undefined}
                                        className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 dark:border-gray-700
                      ${pageNumber === currentPage
                                            ? 'z-10 text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700 dark:text-white dark:bg-green-700 dark:hover:bg-green-600' // Active page style
                                            : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white'}`}
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
                                        <span className="sr-only">Next</span>Next »
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>
                )}
            </div>
        </div>
    );
}