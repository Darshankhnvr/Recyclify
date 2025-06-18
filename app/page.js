// app/page.jsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Recycle, MapPin, Truck, BookOpenText } from 'lucide-react'; // Ensure lucide-react is installed

export default function HomePage() {
  return (
      <>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 text-white py-20 md:py-32">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Go Greener. Go Smarter.
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-green-100 mb-10">
              Join Recyclify to easily track your recycling habits, find local centers, schedule pickups,
              and access helpful guides to make a positive impact on our planet.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {/*
              Consider running the codemod for these Links if you haven't:
              npx @next/codemod@latest new-link .
              Or adjust to use `asChild` pattern if preferred with Shadcn Button
            */}
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100 hover:text-green-600 text-lg px-8 py-3 w-full sm:w-auto transition-transform transform hover:scale-105">
                <Link href="/sign-up">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-green-200 text-green-600 hover:text-green-600 hover:bg-opacity-10  text-lg px-8 py-3 w-full sm:w-auto transition-transform transform hover:scale-105">
                <Link href="/guides">Explore Guides</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Everything You Need, All In One Place
              </h2>
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Recyclify makes sustainable living simpler and more rewarding.
              </p>
            </div>

            {/* Increased gap between cards: gap-10 lg:gap-12 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
              {/* Feature 1: Waste Tracking */}
              {/* Increased internal padding to p-8 and vertical margins inside card */}
              <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <div className="p-4 bg-green-100 dark:bg-green-800 rounded-full mb-6 inline-block">
                  <Recycle className="h-10 w-10 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Track Your Impact</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Log your recycled items, monitor your progress, and earn points for your green efforts.
                </p>
              </div>

              {/* Feature 2: Center Locator */}
              <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded-full mb-6 inline-block">
                  <MapPin className="h-10 w-10 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Find Local Centers</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Easily locate nearby recycling centers with our interactive map and detailed information.
                </p>
              </div>

              {/* Feature 3: Pickup Scheduling */}
              <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <div className="p-4 bg-yellow-100 dark:bg-yellow-700 rounded-full mb-6 inline-block">
                  <Truck className="h-10 w-10 text-yellow-500 dark:text-yellow-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Schedule Pickups</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Request convenient pickups for your recyclables right from your dashboard.
                </p>
              </div>

              {/* Feature 4: Educational Guides */}
              <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <div className="p-4 bg-purple-100 dark:bg-purple-800 rounded-full mb-6 inline-block">
                  <BookOpenText className="h-10 w-10 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Learn & Grow</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Access a library of guides to understand recycling best practices and sustainability tips.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 text-white"> {/* Adjusted gradient */}
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-lg sm:text-xl text-green-50 mb-8 max-w-xl mx-auto"> {/* Lighter text on darker bg */}
              Join the Recyclify community today and take the first step towards a more sustainable lifestyle.
            </p>
            <Button asChild size="lg" className="bg-white text-green-700 hover:bg-gray-200 text-lg px-10 py-3 transition-transform transform hover:scale-105 shadow-md hover:shadow-lg">
              <Link href="/sign-up">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </>
  );
}