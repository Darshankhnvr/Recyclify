// app/(app)/schedule-pickup/page.jsx
import PickupRequestForm from "@/components/dashboard/PickupRequestForm"; // Or components/pickup/ if you chose that
import { requestPickup } from "@/lib/actions/pickup.actions";
import {CalendarPlus} from "lucide-react"; // Import the server action

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
            <header className="pb-6 border-b border-gray-200 dark:border-gray-700 mb-5">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gradient-to-tr from-sky-500 to-cyan-500 rounded-lg shadow"> {/* Different gradient for variety */}
                        <CalendarPlus className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Schedule a New Pickup
                    </h1>
                </div>
                <p className="mt-1 text-md text-gray-600 dark:text-gray-400 max-w-2xl">
                    Let us know where and when to pick up your recyclables. We appreciate your effort in making our planet cleaner!
                </p>
            </header>

            <PickupRequestForm
                onSubmitAction={requestPickup}
                // initialData={defaultAddress ? { address: defaultAddress.street, city: defaultAddress.city, postalCode: defaultAddress.postalCode } : null}
            />
        </div>
    );
}