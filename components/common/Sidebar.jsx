
"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

const dashboardLinks = [
  { href: "/overview", label: "Overview" },
  { href: "/log-waste", label: "Log Waste" },
  { href: "/my-pickups", label: "My Pickups" },
  { href: "/settings", label: "Settings" },
];


export default function Sidebar(){
    const pathname = usePathname()
    return(
        <aside>
            {dashboardLinks.map((link) =>(
                <Link key={link.href}
                href = {link.href}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium
            ${pathname  === link.href
              ? 'bg-green-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
            }`}
                >
                    {link.label}
                
                </Link>
            ))}
        </aside>
    )
}