"use client";

import { ChangeEvent, useState } from "react";

export default function TaskForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    status: "TODO",
    dueDate: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form.title) return alert("กรุณากรอกชื่อ");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("สร้างงานสำเร็จ 🎉");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow border border-gray-200 space-y-4">

      <h1 className="text-xl font-bold">➕ เพิ่มงาน</h1>

      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="ชื่องาน"
        value={form.title}
        onChange={handleChange}
        className="w-full border rounded-xl px-4 py-2"
      />

      {/* Description */}
      <textarea
        name="description"
        placeholder="รายละเอียด"
        value={form.description}
        onChange={handleChange}
        className="w-full border rounded-xl px-4 py-2"
      />

      {/* Category */}
      <input
        type="text"
        name="category"
        placeholder="หมวดหมู่"
        value={form.category}
        onChange={handleChange}
        className="w-full border rounded-xl px-4 py-2"
      />

      {/* Status */}
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border rounded-xl px-4 py-2"
      >
        <option value="TODO">TODO</option>
        <option value="DOING">DOING</option>
        <option value="DONE">DONE</option>
      </select>

      {/* Due Date */}
      <input
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        className="w-full border rounded-xl px-4 py-2"
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full bg-slate-900 text-white py-2 rounded-xl"
      >
        บันทึก
      </button>
    </div>
  );
}
