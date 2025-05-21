// app/(main)/guides/[slug]/page.jsx
import { getGuideBySlug } from '@/lib/actions/guide.actions';
import GuideContent from '@/components/guides/GuideContent';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation'; // To handle guide not found

// Function to generate metadata dynamically (good for SEO)
export async function generateMetadata({ params }) {
  const guide = await getGuideBySlug(params.slug);
  if (!guide) {
    return {
      title: 'Guide Not Found | Recyclify',
    };
  }
  return {
    title: `${guide.title} | Recyclify Guides`,
    description: `Learn about ${guide.title.toLowerCase()} - ${guide.category} recycling guide.`, // You could use an excerpt here
  };
}

export default async function SingleGuidePage({ params }) {
  const { slug } = params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound(); // This will render the nearest not-found.js page or a default Next.js 404
  }

  // Helper to format date (optional)
  function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl"> {/* Max width for readability */}
      <header className="mb-8">
        {guide.category && (
          <Badge variant="secondary" className="mb-2">{guide.category}</Badge>
        )}
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
          {guide.title}
        </h1>
        {guide.publishedAt && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Published on {formatDate(guide.publishedAt)}
          </p>
        )}
      </header>

      {guide.imageUrl && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={guide.imageUrl}
            alt={`Image for ${guide.title}`}
            layout="fill"
            objectFit="cover"
            priority // Good to add for LCP images
          />
        </div>
      )}

      <GuideContent content={guide.content} />

      {/* You could add related guides or a back button here */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <a href="/guides" className="text-green-600 hover:text-green-700 font-medium">
          ← Back to All Guides
        </a>
      </div>
    </article>
  );
}