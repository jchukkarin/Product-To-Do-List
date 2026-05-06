"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const menu = [
        { name: "Home", href: "/dashboard" },
        { name: "Task", href: "/dashboard/task" },
        { name: "Report", href: "/report" },
    ];

    return (
        <div className="w-64 h-screen bg-slate-800 text-white p-4">
            <h1 className="text-xl font-bold mb-6">My App</h1>

            <ul className="space-y-2">
                {menu.map((item) => (
                    <li key={item.name}>
                        <Link
                            href={item.href}
                            className={`block px-4 py-2 rounded-lg ${pathname === item.href
                                    ? "bg-slate-600"
                                    : "hover:bg-slate-700"
                                }`}
                        >
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}