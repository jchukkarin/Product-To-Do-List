"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!search.trim()) return;
    router.push(`/dashboard/search?q=${search}`);
  };

  return (
    <div className="w-full bg-gray-100 px-6 py-3">
      <div className="max-w-2xl mx-auto">
        
        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">

          <span className="m-2">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
                <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
            </svg>
          </span>

          <input
            type="text"
            placeholder="Seacrh"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 outline-none"
          />

          <button
            onClick={handleSearch}
            className="bg-slate-900 text-white px-3 py-1 rounded-lg text-sm"
          >
            ค้นหา
          </button>
        </div>

      </div>
    </div>
  );
}