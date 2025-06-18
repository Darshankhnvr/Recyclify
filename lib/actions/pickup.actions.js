// lib/actions/pickup.actions.js
"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Zod schema for validation (should match the form's schema)
const pickupRequestSchema = z.object({
    address: z.string().min(5, "Full address is required."),
    city: z.string().min(2, "City is required."),
    postalCode: z.string().min(3, "Postal code is required."),
    contactNumber: z.string().min(7, "A valid contact number is required."),
    wasteTypes: z.array(z.string()).min(1, "At least one waste type must be selected."),
    preferredDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Preferred date is required."),
    userNotes: z.string().max(500).optional(),
});

export async function getPickupRequestsForUser() {
    const user = await currentUser();
    if (!user || !user.id) {
        // console.error("getPickupRequestsForUser: User not authenticated.");
        return []; // Return empty array or handle error as needed
    }
    const userId = user.id;

    try {
        const pickupRequests = await prisma.pickupRequest.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc', // Show most recent requests first
            },
        });

        // Parse the wasteTypes JSON string back into an array for each request
        return pickupRequests.map(request => ({
            ...request,
            wasteTypes: JSON.parse(request.wasteTypes || '[]'), // Ensure fallback for null/empty string
        }));

    } catch (error) {
        console.error("Error fetching pickup requests for user:", error);
        return [];
    }
}

export async function requestPickup(formData) {
    const user = await currentUser();
    if (!user || !user.id) {
        return { success: false, error: "User not authenticated. Please sign in." };
    }
    const userId = user.id;

    // Ensure user exists in our DB (good practice, can be part of user sync too)
    // This is similar to what we did in waste.actions.js
    try {
        await prisma.user.upsert({
            where: { id: userId },
            update: {}, // No specific user fields to update here during pickup request
            create: {
                id: userId,
                email: user.emailAddresses[0]?.emailAddress || '',
                firstName: user.firstName || null,
                lastName: user.lastName || null,
                username: user.username || null,
                imageUrl: user.imageUrl || null,
            },
        });
    } catch (dbUserError) {
        console.error("Error ensuring user exists in DB for pickup request:", dbUserError);
        // Decide if this is a critical failure or if we can proceed if user object from Clerk is valid
    }


    const validationResult = pickupRequestSchema.safeParse(formData);

    if (!validationResult.success) {
        let errorMessages = "Validation failed: ";
        for (const field in validationResult.error.flatten().fieldErrors) {
            errorMessages += `${field}: ${validationResult.error.flatten().fieldErrors[field].join(', ')}. `;
        }
        return { success: false, error: errorMessages.trim() };
    }

    const { address, city, postalCode, contactNumber, wasteTypes, preferredDate, userNotes } = validationResult.data;

    try {
        const isoPreferredDate = new Date(preferredDate);
        if (isNaN(isoPreferredDate.getTime())) {
            return { success: false, error: "Invalid preferred date provided." };
        }

        // The 'wasteTypes' field in Prisma schema is a JSON string for SQLite.
        // The form sends an array of strings. We need to stringify it.
        const wasteTypesJsonString = JSON.stringify(wasteTypes);

        await prisma.pickupRequest.create({
            data: {
                userId: userId,
                address,
                city,
                postalCode,
                contactNumber,
                wasteTypes: wasteTypesJsonString, // Store as JSON string
                preferredDate: isoPreferredDate,
                userNotes: userNotes || null,
                status: 'PENDING', // Default status from enum in schema.prisma
            },
        });

        // Revalidate paths where pickup requests might be displayed
        revalidatePath("/my-pickups"); // User's list of pickups
        revalidatePath("/schedule-pickup"); // The form page itself (to clear or show success)

        return { success: true, message: "Pickup request submitted successfully! We will contact you soon." };

    } catch (error) {
        console.error("Error creating pickup request:", error);
        // Add more specific error handling if needed
        return { success: false, error: "Failed to submit pickup request due to a server error." };
    }
}