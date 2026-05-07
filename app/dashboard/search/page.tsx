"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchTasks = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/auth/tasks?search=${query}`
        );

        const data = await res.json();

        setTasks(data);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchTasks();
  }, [query]);

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <h1 className="text-xl font-bold">
          🔍 ผลการค้นหา: "{query}"
        </h1>
      </div>

      {/* Loading */}
      {loading && (
        <p>Loading...</p>
      )}

      {/* Empty */}
      {!loading && tasks.length === 0 && (
        <div className="bg-white p-4 rounded-xl shadow">
          ไม่พบข้อมูล
        </div>
      )}

      {/* Result */}
      <div className="space-y-3">

        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white p-4 rounded-xl shadow border border-gray-200"
          >
            <h2 className="font-semibold">
              {task.title}
            </h2>

            <p className="text-sm text-gray-500">
              {task.description}
            </p>

            <div className="mt-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg">
                {task.status}
              </span>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}