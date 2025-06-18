// app/layout.jsx
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/common/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Recyclify Platform",
  description: "Track your waste, find recycling centers, and get rewarded.",
};

export default function RootLayout({ children }) {
  return (
      <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/overview"
          afterSignUpUrl="/overview"
      >
        <html lang="en">
        <body
            className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500 text-white`}
        >
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-md">
            {children}
          </div>
        </main>
        </body>
        </html>
      </ClerkProvider>
  );
}
