"use client";

export default function Navbar() {
    return (
        <div className="w-full h-16 bg-slate-900 text-white flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold">My App</h1>

            <button className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg">
                Logout
            </button>
        </div>
    );
}