// app/api/webhooks/clerk/route.js
import { Webhook } from 'svix';
import { headers } from 'next/headers'; // Correct import
import prisma from '@/lib/db';
import { NextResponse } from 'next/server'; // Import NextResponse for cleaner responses

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req) {
  console.log("CLERK WEBHOOK HANDLER REACHED!"); // Good, this means 404 is gone.

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set in .env.local');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  // Get the headers
  const headerPayload = headers(); // This is the instance of ReadonlyHeaders

  // Log all headers to see what's arriving (for debugging)
  console.log("Received Headers:");
  for (const [key, value] of headerPayload.entries()) {
    console.log(`${key}: ${value}`);
  }

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  console.log("svix_id:", svix_id);
  console.log("svix_timestamp:", svix_timestamp);
  console.log("svix_signature:", svix_signature);


  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Error: Missing one or more svix headers.");
    // Return a JSON response for clarity
    return NextResponse.json({ error: 'Error occurred -- no svix headers' }, { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload); // Svix expects the raw string body

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, { // Pass the stringified body
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err.message);
    return NextResponse.json({ error: 'Webhook verification failed', details: err.message }, { status: 400 });
  }

  const eventType = evt.type;
  console.log(`Webhook event type: ${eventType}`);

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, username, image_url } = evt.data;
    try {
      await prisma.user.upsert({
        where: { id: id },
        update: {
          email: email_addresses[0]?.email_address,
          firstName: first_name,
          lastName: last_name,
          username: username,
          imageUrl: image_url,
        },
        create: {
          id: id,
          email: email_addresses[0]?.email_address,
          firstName: first_name,
          lastName: last_name,
          username: username,
          imageUrl: image_url,
        },
      });
      console.log(`User ${id} processed successfully for event ${eventType}.`);
      return NextResponse.json({ message: 'User processed' }, { status: 200 });
    } catch (error) {
      console.error(`Error processing user ${id} for event ${eventType}:`, error);
      return NextResponse.json({ error: 'Error processing user data' }, { status: 500 });
    }
  } else if (eventType === 'user.deleted') {
    // ... (user deletion logic) ...
    const { id } = evt.data;
     try {
        await prisma.user.delete({ where: { id: id } });
        console.log(`User ${id} deleted successfully.`);
        return NextResponse.json({ message: 'User deleted' }, { status: 200 });
      } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        return NextResponse.json({ error: 'Error processing user deletion' }, { status: error.code === 'P2025' ? 200 : 500 });
      }
  } else {
    console.log(`Received unhandled event type: ${eventType}`);
    return NextResponse.json({ message: `Unhandled event type: ${eventType}` }, { status: 200 });
  }
}