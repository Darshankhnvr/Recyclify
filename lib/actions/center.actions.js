// lib/actions/center.actions.js
"use server";

import prisma from "@/lib/db";

/**
 * Fetches recycling centers.
 * @param {{ limit?: number, hasCoordinates?: boolean }} options - Optional filtering.
 *   hasCoordinates: if true, only returns centers with lat/lng. Defaults to true.
 * @returns {Promise<Array<Object>>} A list of recycling center objects.
 */
export async function getRecyclingCenters(options = {}) {
    const { limit, hasCoordinates = true } = options;

    try {
        const whereClause = {};

        if (hasCoordinates) {
            whereClause.latitude = { not: null };
            whereClause.longitude = { not: null };
        }

        const queryOptions = {
            where: whereClause,
            orderBy: {
                name: 'asc', // Or any other preferred order
            },
        };

        if (limit && typeof limit === 'number' && limit > 0) {
            queryOptions.take = limit;
        }

        const centers = await prisma.recyclingCenter.findMany(queryOptions);

        // Process the data for frontend consumption
        return centers.map(center => ({
            id: center.id,
            name: center.name,
            address: center.address,
            city: center.city,
            postalCode: center.postalCode,
            // Ensure latitude and longitude are numbers
            latitude: center.latitude ? parseFloat(center.latitude) : null,
            longitude: center.longitude ? parseFloat(center.longitude) : null,
            contactNumber: center.contactNumber,
            website: center.website,
            // Parse the JSON string for acceptedMaterials back into an array
            acceptedMaterials: center.acceptedMaterials ? JSON.parse(center.acceptedMaterials) : [],
            operatingHours: center.operatingHours,
            // You can add/transform other fields as needed
        }));

    } catch (error) {
        console.error("Error fetching recycling centers:", error);
        return []; // Return empty array on error to prevent breaking the frontend
    }
}