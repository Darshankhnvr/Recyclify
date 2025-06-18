// app/(main)/guides/page.jsx
import { getPublishedGuides, getGuideCategories } from "@/lib/actions/guide.actions";
import GuideCard from "@/components/guides/GuideCard";
import Link from "next/link";
// We might add a client component for filtering later
// import GuideFilters from "@/components/guides/GuideFilters";

export const metadata = {
  title: "Recycling Guides - Recyclify",
  description: "Learn more about recycling with our helpful guides and tips.",
};

// This component will be a Server Component
export default async function GuidesPage({ searchParams = {} }) {
  // Properly handle searchParams as an async parameter
  const params = await Promise.resolve(searchParams);
  const category = params.category || null;

  const [guides, categories] = await Promise.all([
    getPublishedGuides({ category }),
    getGuideCategories()
  ]);

  return (
    <div className="container mx-auto px-4 py-8">

        <header className="mb-12 md:mb-16 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg mb-6">
                {/* You'll need to import BookOpenText if you use it */}
                {/* <BookOpenText className="h-10 w-10 text-white" /> */}
                {/* For now, let's omit the icon here if it was causing issues earlier, or ensure its import */}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 dark:text-white sm:text-5xl">
                Recycling Knowledge Hub
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Browse our collection of articles and tips to master recycling, reduce waste, and live more sustainably.
            </p>
        </header>

      {/* Category Filter Links */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Link
          href="/guides"
          className={`px-4 py-2 rounded-md text-sm font-medium border
            ${!category ? 'bg-green-600 hover:scale-105 text-white border-green-600' : 'bg-green-600 dark:bg-gray-800 hover:scale-105 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'}`}
        >
          All Guides
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/guides?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-md text-sm font-medium border
              ${category === cat ? 'bg-green-600 hover:scale-105 text-white border-green-600' : 'bg-green-600 dark:bg-gray-800 hover:scale-105 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'}`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {guides && guides.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            {category
              ? `No guides found for the category "${category}".`
              : "No guides published yet. Check back soon!"}
          </p>
          {category && (
            <Link href="/guides" className="mt-4 inline-block text-green-600 hover:underline">
              View All Guides
            </Link>
          )}
        </div>
      )}

      {/* Pagination can be added here later if needed */}
    </div>
  );
}