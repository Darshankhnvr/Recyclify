// components/common/Navbar.jsx
"use client";

import Link from "next/link";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

export default function Navbar() {
  return (
      <nav className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link
              href="/"
              className="text-2xl font-extrabold tracking-wide bg-white text-green-700 px-3 py-1 rounded-xl shadow-sm hover:bg-gray-100 transition-all"
          >
            Recyclify
          </Link>

          <div className="space-x-6 flex items-center text-sm font-medium">
            <Link
                href="/guides"
                className="hover:text-yellow-200 transition-colors"
            >
              Guides
            </Link>
            <Link
                href="/centers"
                className="hover:text-yellow-200 transition-colors"
            >
              Centers
            </Link>
            <Link
                href="/leaderboard"
                className="hover:text-yellow-200 transition-colors"
            >
              Leaderboard
            </Link>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-white text-green-700 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition-all">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-yellow-400 text-green-900 px-4 py-2 rounded-full shadow-md hover:bg-yellow-300 transition-all">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link
                  href="/overview"
                  className="hover:text-yellow-200 transition-colors"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>
  );
}
