"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/app/components/Search/searchbar";

type Task = {
  _id: string;
  title: string;
  category?: string;
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);


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
      <div className="bg-gray-100 p-4 rounded-xl">
        <SearchBar />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">งานทั้งหมด</h1>
          <p className="text-sm text-slate-500">งานที่คุณเป็นเจ้าของหรือได้รับสิทธิ์เข้าถึง</p>
        </div>

        <Link
          href="/dashboard/task/create"
          className="rounded-xl bg-slate-900 px-4 py-2 text-white"
        >
          เพิ่มงาน
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
