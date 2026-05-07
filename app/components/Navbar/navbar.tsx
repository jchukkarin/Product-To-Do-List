"use client";
import { useRouter } from "next/navigation";

export default function Navbar() {
     const router = useRouter();

  const handleLogout = async () => {
    document.cookie = "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

    return (
        <div className="w-full h-16 bg-slate-900 text-white flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold">My App</h1>

            <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg">
                Logout
            </button>
        </div>
    );
}