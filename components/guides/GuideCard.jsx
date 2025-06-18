// components/guides/GuideCard.jsx
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from 'lucide-react'; // For a more appealing CTA

export default function GuideCard({ guide }) {
  if (!guide) return null;

  return (
      // Using Button asChild for the link for better semantics if Link directly wraps Card
      // Or keep Link wrapping an <a> tag which wraps the Card
      <Link href={`/guides/${guide.slug}`} className="block group"> {/* group for hover effects on children */}
        <Card className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform group-hover:-translate-y-1 rounded-lg overflow-hidden">
          {guide.imageUrl ? (
              <div className="relative w-full h-48">
                <Image
                    src={guide.imageUrl}
                    alt={guide.title}
                    layout="fill"
                    objectFit="cover"
                    // className="rounded-t-lg" // No longer needed if Card has overflow-hidden and rounded-lg
                />
              </div>
          ) : (
              // Placeholder if no image
              <div className="w-full h-48 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
                <BookOpenText className="w-16 h-16 text-green-300 dark:text-green-700" /> {/* Assuming BookOpenText from lucide */}
              </div>
          )}
          <CardHeader className="pb-3 pt-4"> {/* Adjusted padding */}
            {guide.category && (
                <Badge variant="outline" className="mb-2 w-fit text-xs border-green-300 dark:border-green-700 text-green-700 dark:text-green-300">
                  {guide.category}
                </Badge>
            )}
            <CardTitle className="text-lg font-semibold leading-tight text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              {guide.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow py-0"> {/* Adjusted padding */}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
              {/* Create an excerpt if guide.content is long, or use a dedicated excerpt field */}
              {guide.content ? (guide.content.substring(0, 100) + (guide.content.length > 100 ? '...' : '')) : `Learn more about ${guide.title.toLowerCase()}.`}
            </p>
          </CardContent>
          <CardFooter className="pt-3 pb-4"> {/* Adjusted padding */}
            <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium group-hover:underline">
              Read Guide
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </CardFooter>
        </Card>
      </Link>
  );
}