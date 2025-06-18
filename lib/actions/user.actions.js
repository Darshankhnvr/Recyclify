// lib/actions/user.actions.js (or leaderboard.actions.js)
"use server";

import prisma from "@/lib/db";

/**
 * Fetches users for the leaderboard, ordered by points.
 * @param {{ page?: number, limit?: number }} options - Pagination options.
 * @returns {Promise<{users: Array, totalUsers: number, currentPage: number, totalPages: number}>} Leaderboard data.
 */
export async function getLeaderboardUsers(options = {}) {
    const { page = 1, limit = 20 } = options; // Default to page 1, 20 users per page
    const skip = (page - 1) * limit;

    try {
        const users = await prisma.user.findMany({
            where: {
                points: {
                    gt: 0, // Optionally, only show users with points > 0
                },
            },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                imageUrl: true,
                points: true,
            },
            orderBy: {
                points: 'desc',
            },
            skip: skip,
            take: limit,
        });

        const totalUsersWithPoints = await prisma.user.count({
            where: {
                points: {
                    gt: 0, // Count only users with points > 0
                },
            },
        });

        // console.log(`Fetched ${users.length} users for leaderboard page ${page}.`);
        return {
            users,
            totalUsers: totalUsersWithPoints,
            currentPage: page,
            totalPages: Math.ceil(totalUsersWithPoints / limit),
        };
    } catch (error) {
        console.error("Error fetching leaderboard users:", error);
        return { users: [], totalUsers: 0, currentPage: 1, totalPages: 0 };
    }
}