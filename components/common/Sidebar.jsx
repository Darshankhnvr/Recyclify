"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const dashboardLinks = [
    { href: "/overview", label: "Overview" },
    { href: "/log-waste", label: "Log Waste" },
    { href: "/my-pickups", label: "My Pickups" },
    { href: "/schedule-pickup", label: "Schedule Pickup" },
    { href: "/settings", label: "Settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="h-screen w-64 bg-white/10 backdrop-blur-md p-6 hidden sm:block shadow-lg border-r border-white/10">
            <h2 className="text-xl font-bold mb-6 text-white">Dashboard</h2>
            <nav className="flex flex-col gap-2">
                {dashboardLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                            pathname === link.href
                                ? "bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-md"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
