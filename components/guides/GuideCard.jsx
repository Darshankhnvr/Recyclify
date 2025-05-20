// components/guides/GuideCard.jsx
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GuideCard({ guide }) {
  if (!guide) {
    // Optionally, render a skeleton or a specific "not found" card
    // For now, just returning null if no guide data is passed.
    return null;
  }

  // Define a fallback image path.
  // Ensure this image exists in your `public` folder, e.g., `public/images/placeholder-guide.png` or .avif
  const fallbackImage = "/images/placeholder-guide.avif"; // Adjust extension if needed

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-xl dark:border-gray-700">
      <Link href={`/guides/${guide.slug}`} className="block group h-full flex flex-col">
        <CardHeader className="p-0">
          {/* Image container - ensures consistent aspect ratio if images vary */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] overflow-hidden">
            {/*
              Using guide.imageUrl (which should be like '/images/guides/my-image.avif')
              or the fallbackImage if guide.imageUrl is not provided.
            */}
            <Image
              src={guide.imageUrl || fallbackImage}
              alt={guide.title || "Recycling guide image"}
              fill // This makes the image fill its parent container
              style={{ objectFit: "cover" }} // Ensures the image covers the area, might crop
              className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
              // The 'sizes' prop helps Next.js optimize image loading for different screen sizes.
              // Adjust these based on your grid layout and breakpoints.
              // Example: (max-width: 640px) means for screens up to 640px wide, the image takes 100% of viewport width.
              // (max-width: 1024px) means for screens up to 1024px, it takes 50% (if 2 columns).
              // Default is 33% (if 3 columns).
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              // You can also provide width and height directly if you don't use `fill`,
              // but `fill` with a sized parent is often more flexible for responsive cards.
              // priority={false} // Set to true for above-the-fold images if needed
            />
          </div>
        </CardHeader>

        <CardContent className="p-4 flex-grow flex flex-col"> {/* flex-grow allows content to push footer down */}
          <CardTitle className="text-lg font-semibold mb-2 group-hover:text-green-600 transition-colors duration-200">
            {guide.title}
          </CardTitle>
          {/* 
            Optional: Add an excerpt/description here if you have it in your guide data.
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-2 flex-grow">
              {guide.excerpt || "Learn more about this topic..."}
            </p> 
          */}
        </CardContent>

        <CardFooter className="p-4 pt-2 border-t dark:border-gray-700 mt-auto"> {/* mt-auto pushes footer to bottom if content is short */}
          {guide.category && (
            <Badge variant="outline" className="text-xs">
              {guide.category}
            </Badge>
          )}
          {/* You could add other meta here, like a "Read More" text or published date */}
        </CardFooter>
      </Link>
    </Card>
  );
}