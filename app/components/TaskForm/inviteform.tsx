"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InviteForm({ taskId }: { taskId: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"VIEWER" | "EDITOR">("VIEWER");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const invite = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/tasks/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId, email, role }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || "เชิญไม่สำเร็จ");
      return;
    }

    setEmail("");
    setRole("VIEWER");
    setMessage("เชิญสำเร็จ");
    router.refresh();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">เชิญสมาชิก</h2>

      <div className="grid gap-3 md:grid-cols-[1fr_160px_auto]">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-900"
        />

        <select
          value={role}
          onChange={(event) => setRole(event.target.value as "VIEWER" | "EDITOR")}
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-900"
        >
          <option value="VIEWER">ดูอย่างเดียว</option>
          <option value="EDITOR">แก้ไขได้</option>
        </select>

        <button
          type="button"
          onClick={invite}
          disabled={loading || !email}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "กำลังเชิญ..." : "เชิญ..."}
        </button>
      </div>
      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
    </div>
  );
}
