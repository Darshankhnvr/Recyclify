// app/(main)/centers/page.jsx
import { getRecyclingCenters } from '@/lib/actions/center.actions';
import MapView from '@/components/locator/MapView'; // Our Leaflet map component
// No need to import Link from next/link explicitly if only used by child components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

export const metadata = {
    title: 'Recycling Center Locator | Recyclify',
    description: 'Find recycling centers near you. View them on an interactive map or browse the list.',
};

export default async function CentersPage() {
    // Fetch centers that have coordinates for the map
    // The getRecyclingCenters action already defaults to hasCoordinates: true
    const centersForMapAndList = await getRecyclingCenters();

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                    Recycling Center Locator
                </h1>
                <p className="mt-3 text-lg leading-7 text-gray-600 dark:text-gray-300">
                    Discover facilities to recycle your materials. Click map markers for more details.
                </p>
            </header>

            {/* Map Section */}
            <section className="mb-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Interactive Map</CardTitle>
                        <CardDescription>Explore the recycling centers. Click on a marker to see more information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* The map needs a container with a defined height */}
                        <div style={{ height: '500px', width: '100%' }} className="rounded-lg overflow-hidden border dark:border-gray-700 bg-gray-100 dark:bg-gray-800"> {/* Added bg for loading state */}
                            {/*
                The MapView component handles its own "Loading map..." state if window is undefined.
                We pass initialLatitude, initialLongitude, and initialZoom to set the default map view.
              */}
                            <MapView
                                centers={centersForMapAndList}
                                initialLatitude={39.8283} // Approx center of US
                                initialLongitude={-98.5795}
                                initialZoom={4}
                            />
                        </div>
                        {centersForMapAndList.length === 0 && (
                            <p className="text-center text-gray-500 pt-4">No recycling centers with map coordinates found.</p>
                        )}
                    </CardContent>
                </Card>
            </section>

            {/* List Section */}
            <section>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                    Recycling Centers List
                </h2>
                {centersForMapAndList && centersForMapAndList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {centersForMapAndList.map(center => (
                            <Card key={center.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-lg">{center.name}</CardTitle>
                                    <CardDescription>{center.address}, {center.city}, {center.postalCode}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-2 text-sm">
                                    {center.operatingHours && <p><span className="font-medium">Hours:</span> {center.operatingHours}</p>}
                                    {center.contactNumber && <p><span className="font-medium">Phone:</span> {center.contactNumber}</p>}
                                    {center.website && (
                                        <p>
                                            <span className="font-medium">Website:</span>{' '}
                                            <a
                                                href={center.website.startsWith('http') ? center.website : `https://${center.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-600 hover:underline"
                                            >
                                                Visit Site
                                            </a>
                                        </p>
                                    )}
                                    {center.acceptedMaterials && center.acceptedMaterials.length > 0 && (
                                        <div>
                                            <p className="font-medium mb-1">Accepts:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {center.acceptedMaterials.map((material, index) => (
                                                    <Badge key={index} variant="secondary">{material}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                        No recycling centers found in the list.
                    </p>
                )}
            </section>
        </div>
    );
}