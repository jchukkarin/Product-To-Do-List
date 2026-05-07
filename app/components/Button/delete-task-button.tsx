"use client";

import { useRouter } from "next/navigation";

export default function DeleteTaskButton({ taskId }: { taskId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("คุณต้องการลบงานนี้ใช่ไหม?")) return;

    const res = await fetch(`/api/auth/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/dashboard/task");
      router.refresh();
      return;
    }

    alert("ลบไม่สำเร็จ");
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600"
    >
      ลบ
    </button>
  );
}
