// components/common/Navbar.jsx
"use client"; // Required for Clerk components and client-side interactions

import Link from 'next/link';
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Recyclify
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/guides" className="hover:text-green-200">Guides</Link>
          <Link href="/centers" className="hover:text-green-200">Centers</Link>
          <Link href="/leaderboard" className="hover:text-green-200">Leaderboard</Link>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-100">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
               <button className="bg-yellow-400 text-green-800 px-3 py-1 rounded hover:bg-yellow-300">
                Sign Up
               </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard/overview" className="hover:text-green-200">Dashboard</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}