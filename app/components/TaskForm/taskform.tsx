"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

type TaskFormState = {
  title: string;
  description: string;
  category: string;
  status: "TODO" | "DOING" | "DONE ";
  dueDate: string;
};

const initialForm: TaskFormState = {
  title: "",
  description: "",
  category: "",
  status: "TODO",
  dueDate: "",
};

export default function TaskForm() {
  const [form, setForm] = useState(initialForm);
  const router = useRouter();

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form.title) return alert("กรุณากรอกชื่อ");

    try {
      const res = await fetch("/api/auth/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "สร้างงานไม่สำเร็จ");
        return;
      }

      alert("สร้างงานสำเร็จ");
      setForm(initialForm);
      router.push("/dashboard/task");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow">
      <div className="relative mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/task")}
          className="rounded-lg p-2 transition hover:bg-gray-100"
          aria-label="กลับ"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 52 52"
            fill="currentColor"
          >
            <path d="M48.6,23H15.4c-0.9,0-1.3-1.1-0.7-1.7l9.6-9.6c0.6-0.6,0.6-1.5,0-2.1l-2.2-2.2c-0.6-0.6-1.5-0.6-2.1,0L2.5,25c-0.6,0.6-0.6,1.5,0,2.1L20,44.6c0.6,0.6,1.5,0.6,2.1,0l2.1-2.1c0.6-0.6,0.6-1.5,0-2.1l-9.6-9.6C14,30.1,14.4,29,15.3,29h33.2c0.8,0,1.5-0.6,1.5-1.4v-3C50,23.8,49.4,23,48.6,23z" />
          </svg>
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold">เพิ่มงาน</h1>
      </div>

      <input
        type="text"
        name="title"
        placeholder="ชื่องาน"
        value={form.title}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-2"
      />

      <textarea
        name="description"
        placeholder="รายละเอียด"
        value={form.description}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-2"
      />

      <input
        type="text"
        name="category"
        placeholder="หมวดหมู่"
        value={form.category}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-2"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-2"
      >
        <option value="TODO">TODO</option>
        <option value="DOING">DOING</option>
        <option value="DONE">DONE</option>
      </select>

      <input
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-2"
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-xl bg-slate-900 py-2 text-white"
      >
        บันทึก
      </button>
    </div>
  );
}
