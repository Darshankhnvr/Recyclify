// lib/actions/waste.actions.js
"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const wasteLogSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format. Please use YYYY-MM-DD.",
  }),
  wasteType: z.string().min(1, "Waste type is required."),
  quantity: z.coerce.number().positive("Quantity must be a positive number."),
  unit: z.string().min(1, "Unit is required."),
  description: z.string().optional(),
  recycledAt: z.string().optional(),
});

export async function logWaste(formData) {
  const user = await currentUser();
  const userId = user?.id;

  // console.log("Server Action: currentUser result:", JSON.stringify(user, null, 2));
  // console.log("Server Action: userId:", userId);

  if (!userId) {
    return { success: false, error: "User not authenticated. Please sign in to log waste." };
  }

  try {
    // Ensure the user exists in our database (good practice, already in place)
    await prisma.user.upsert({
      where: { id: userId },
      update: {}, // No specific user fields to update here during waste logging
      create: {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        username: user.username || null,
        imageUrl: user.imageUrl || null,
        // points will default to 0 as per schema
      },
    });
    // console.log("Database user checked/created");

    const validationResult = wasteLogSchema.safeParse(formData);

    if (!validationResult.success) {
      let errorMessages = "Validation failed: ";
      for (const field in validationResult.error.flatten().fieldErrors) {
        errorMessages += `${field}: ${validationResult.error.flatten().fieldErrors[field].join(', ')}. `;
      }
      return { success: false, error: errorMessages.trim() };
    }

    const { date, wasteType, quantity, unit, description, recycledAt } = validationResult.data;
    const isoDate = new Date(date);
    if (isNaN(isoDate.getTime())) {
      return { success: false, error: "Invalid date provided." };
    }

    // --- Points Logic ---
    const pointsForThisLog = 10; // Award 10 points for each log
    // --- End Points Logic ---

    const newWasteLog = await prisma.wasteLog.create({
      data: {
        userId: userId,
        date: isoDate,
        wasteType,
        quantity,
        unit,
        description: description || null,
        recycledAt: recycledAt || null,
        pointsAwarded: pointsForThisLog, // Save points awarded for this specific log
      },
    });
    // console.log("Created waste log:", newWasteLog);

    // Update user's total points
    if (pointsForThisLog > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: pointsForThisLog, // Atomically increment user's total points
          },
        },
      });
      // console.log(`Awarded ${pointsForThisLog} points to user ${userId}.`);
    }

    revalidatePath("/overview");
    revalidatePath("/log-waste");
    // Consider revalidating any page that might display user points, like a profile or leaderboard
    // revalidatePath("/leaderboard");
    // revalidatePath(`/profile/${userId}`); // if you have such a page

    return { 
      success: true, 
      message: `Waste logged successfully! You earned ${pointsForThisLog} points.` 
    };

  } catch (error) {
    console.error("Error logging waste:", error);
    if (error.code === 'P2002') { // Unique constraint
      return { success: false, error: "A similar log might already exist or another unique constraint failed." };
    }
    if (error.code === 'P2003') { // Foreign key constraint
         // This could happen if the userId doesn't exist in the User table,
         // but our upsert should prevent this specific case for userId.
        return { success: false, error: "Database constraint error (e.g., related record not found)." };
    }
    // Generic error for other cases
    return { success: false, error: "Failed to log waste due to a server error. Please try again later." };
  }
}

// Keep getWasteLogsForUser function as it was
export async function getWasteLogsForUser() {
  const user = await currentUser();
  const userId = user?.id;
  // console.log("--- [getWasteLogsForUser] ---");
  // console.log("[getWasteLogsForUser] Current user object from currentUser():", JSON.stringify(user, null, 2));
  // console.log("[getWasteLogsForUser] Extracted userId:", userId);

  if (!userId) {
    // console.error("[getWasteLogsForUser] User not authenticated or userId is null/undefined.");
    return [];
  }

  try {
    // console.log(`[getWasteLogsForUser] Attempting to fetch logs for userId: ${userId}`);
    const wasteLogs = await prisma.wasteLog.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        date: 'desc',
      },
    });
    // console.log(`[getWasteLogsForUser] Prisma query executed. Found ${wasteLogs.length} logs.`);
    // if (wasteLogs.length > 0) {
    //     console.log("[getWasteLogsForUser] First fetched log:", JSON.stringify(wasteLogs[0], null, 2));
    // }
    // console.log("--- [getWasteLogsForUser END] ---");
    return wasteLogs;
  } catch (error) {
    // console.error("[getWasteLogsForUser] Error during Prisma query:", error);
    // console.log("--- [getWasteLogsForUser END with ERROR] ---");
    return [];
  }
}