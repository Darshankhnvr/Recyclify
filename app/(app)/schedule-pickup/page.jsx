// app/(app)/schedule-pickup/page.jsx
import PickupRequestForm from "@/components/dashboard/PickupRequestForm"; // Or components/pickup/ if you chose that
import { requestPickup } from "@/lib/actions/pickup.actions"; // Import the server action

export const metadata = {
    title: 'Schedule a Pickup | Recyclify',
    description: 'Request a pickup for your recyclable materials.',
};

export default function SchedulePickupPage() {
    // You could fetch user's default address here if you implement that later
    // const user = await currentUser();
    // const defaultAddress = user?.address; // Assuming address is on user model

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Schedule a Waste Pickup
                </h1>
                <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
                    Fill out the form below to request a pickup for your recyclables.
                </p>
            </header>

            <PickupRequestForm
                onSubmitAction={requestPickup}
                // initialData={defaultAddress ? { address: defaultAddress.street, city: defaultAddress.city, postalCode: defaultAddress.postalCode } : null}
            />
        </div>
    );
}