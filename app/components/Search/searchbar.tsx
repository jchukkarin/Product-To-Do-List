"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ไม่ค้นถ้าว่าง
    if (!search.trim()) {
      setTasks([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/auth/tasks?search=${encodeURIComponent(search)}`
        );

        const data = await res.json();

        setTasks(data);

      } catch (error) {
        console.error(error);
      }

      setLoading(false);

    }, 400);

    return () => clearTimeout(delay);

  }, [search]);

  return (
    <div className="w-full bg-gray-100 px-6 py-3 border-b border-gray-200">
      <div className="max-w-2xl mx-auto relative">

        {/* Search Box */}
        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">

          {/* Icon */}
          <svg 
          xmlns="http://www.w3.org/2000/svg" 
          x="0px" y="0px" width="30" height="30" 
          viewBox="0 0 50 50"
          > 
          <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path> 
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm m-4"
          />

        </div>

        {/* Dropdown */}
        {search && (
          <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">

            {/* Loading */}
            {loading && (
              <div className="p-4 text-sm text-gray-500">
                กำลังค้นหา...
              </div>
            )}

            {/* Empty */}
            {!loading && tasks.length === 0 && (
              <div className="p-4 text-sm text-gray-500">
                ไม่พบข้อมูล
              </div>
            )}

            {/* Result */}
            {!loading &&
              tasks.map((task) => (
                <Link
                  key={task._id}
                  href={`/dashboard/task/${task._id}`}
                >
                  <div className="p-4 hover:bg-gray-100 border-b border-gray-100 cursor-pointer transition">

                    <div className="flex items-center justify-between">

                      <div>
                        <h2 className="font-medium text-sm">
                          {task.title}
                        </h2>

                        <p className="text-xs text-gray-500">
                          {task.description}
                        </p>
                      </div>

                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg">
                        {task.status}
                      </span>

                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}