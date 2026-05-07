"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Task = {
  _id: string;
  title: string;
  category?: string;
  status?: string;
  dueDate?: string;
};

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ✅ filter logic
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === "ALL") return true;
    return (task.status || "TODO") === statusFilter;
  });

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("/api/auth/tasks");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "โหลดงานไม่สำเร็จ");
        return;
      }

      setTasks(data);
    };

    fetchTasks();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {["ALL", "TODO", "DOING", "DONE"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition
                ${
                  statusFilter === status
                    ? "bg-white shadow text-black"
                    : "text-gray-500 hover:text-black"
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        <Link
          href="/dashboard/task/create"
          className="rounded-xl bg-slate-900 px-4 py-2 text-white"
        >
          + เพิ่มงาน
        </Link>
      </div>

      {/* error */}
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* 🔥 List (ใช้ filteredTasks แล้ว) */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <Link key={task._id} href={`/dashboard/task/${task._id}`}>
            <div className="mb-4 cursor-pointer rounded-xl border border-gray-100 bg-white p-4 shadow transition hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {task.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {task.category || "ไม่มีหมวดหมู่"}
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {task.status || "TODO"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}