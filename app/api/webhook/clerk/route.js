import { headers } from "next/headers";
import { Webhook } from "svix";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

export async function POST(req) {
  if (!WEBHOOK_SECRET) {
    console.log("Webhook secret is not set");
    return new Response("Webhook secret is not set", { status: 500 });
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.log("Error occures in headers");
    return new Response("Error occures in headers", { status: 500 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (error) {
    console.log("Error while verifying webhook", error);
    return new Response("Error occured", { status: 400 });
  }

  const { id } = evt.data;
  const eventType = event.type;

  console.log(`webhook on id : ${id}  and type of : ${eventType}`);

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    try {
      await prisma.user.upsert({
        wher: { id: id },
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
      }),
        console.log(
          `User ${id} processed successfully for event ${eventType}.`
        );
      return new Response("User processed", { status: 200 });
    } catch (error) {
      console.error(
        `Error processing user ${id} for event ${eventType}:`,
        error
      );
      return new Response("Error processing user data", { status: 500 });
    }
  } else if (eventType === "user.deleted") {
    const { id } = event.data;
    try {
      await prisma.user.delete({
        where: { id: id },
      });
      console.log(`User ${id} deleted successfully.`);
      return new Response("User deleted", { status: 200 });
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      // It's possible the user was already deleted or never existed in your DB
      return new Response("Error processing user deletion or user not found", {
        status: error.code === "P2025" ? 200 : 500,
      });
    }
  } else {
    console.log(`Received unhandled event type: ${eventType}`);
    return new Response(`Unhandled event type: ${eventType}`, { status: 200 }); // Acknowledge other events
  }
}
