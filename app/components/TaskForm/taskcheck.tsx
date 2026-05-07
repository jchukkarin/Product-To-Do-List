"use client";

import { useState } from "react";

type TaskEditableFields = {
  _id: string;
  description?: string;
  status?: "TODO" | "DOING" | "DONE";
};

type TaskPermission = {
  canEditStatus: boolean;
  canEditDescription: boolean;
};

const statusOptions = ["TODO", "DOING", "DONE"] as const;

export default function TaskCheck({
  task,
  permission,
}: {
  task: TaskEditableFields;
  permission: TaskPermission;
}) {
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "TODO");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateField = async (
    data: Partial<Pick<TaskEditableFields, "description" | "status">>
  ) => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/auth/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        setMessage(result.error || "อัปเดตไม่สำเร็จ");
        return;
      }

      setMessage("บันทึกแล้ว");
    } catch {
      setMessage("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="md:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-500">รายละเอียด</p>
          {loading && <span className="text-xs text-slate-400">กำลังบันทึก...</span>}
        </div>

        {permission.canEditDescription ? (
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            onBlur={() => updateField({ description })}
            className="mt-1 min-h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
            placeholder="รายละเอียด"
          />
        ) : (
          <p className="mt-1 whitespace-pre-wrap text-slate-900">{description || "-"}</p>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-500">สถานะ</p>

        {permission.canEditStatus ? (
          <select
            value={status}
            onChange={(event) => {
              const nextStatus = event.target.value as TaskEditableFields["status"];
              if (!nextStatus) return;

              setStatus(nextStatus);
              updateField({ status: nextStatus });
            }}
            disabled={loading}
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900 disabled:bg-gray-100"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <span className="mt-1 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            {status}
          </span>
        )}
        {message && <p className="mt-2 text-xs text-slate-500">{message}</p>}
      </div>
    </>
  );
}
