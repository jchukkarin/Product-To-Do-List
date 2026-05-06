"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function dashboard() {
     const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("/api/auth/tasks");
      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

    return (
            <div className="space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">📋 Task</h1>

        <Link href="/dashboard/task/create">
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl">
            + เพิ่มงาน
          </button>
        </Link>
      </div>

      {/* List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <Link key={task._id} href={`/dashboard/task/${task._id}`}>
            <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer mb-4">
              <h2 className="font-semibold">{task.title}</h2>
              <p className="text-sm text-gray-500">{task.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
    );
} 