"use client";

import { ChangeEvent, useEffect, useState } from "react";

type Attachment = {
  url: string;
  type: "image" | "file";
  name: string;
};

type ChecklistItem = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  status: "TODO" | "DONE";
  attachments: Attachment[];
};

export default function TaskList({
  taskId,
  canEdit,
}: {
  taskId: string;
  canEdit: boolean;
}) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadItems() {
      const res = await fetch(`/api/checklist?taskId=${taskId}`);
      const data = await res.json();

      if (!mounted) return;

      if (!res.ok) {
        setMessage(data.error || "โหลด checklist ไม่สำเร็จ");
        return;
      }

      setItems(data);
    }

    void loadItems();

    return () => {
      mounted = false;
    };
  }, [taskId]);

  const addItem = async () => {
    if (!newTitle.trim() || !canEdit) return;

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/checklist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId,
        title: newTitle.trim(),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || "เพิ่ม checklist ไม่สำเร็จ");
      return;
    }

    setItems([data, ...items]);
    setNewTitle("");
  };

  const updateItem = async (
    id: string,
    data: Partial<Pick<ChecklistItem, "title" | "description" | "completed" | "status">>
  ) => {
    if (!canEdit) return;

    const res = await fetch(`/api/checklist/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage(result.error || "อัปเดต checklist ไม่สำเร็จ");
      return;
    }

    setItems((current) => current.map((item) => (item._id === id ? result : item)));
  };

  const deleteItem = async (id: string) => {
    if (!canEdit) return;

    const res = await fetch(`/api/checklist/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const result = await res.json();
      setMessage(result.error || "ลบ checklist ไม่สำเร็จ");
      return;
    }

    setItems((current) => current.filter((item) => item._id !== id));
  };

  const deleteCompletedItems = async () => {
    if (!canEdit) return;

    const completedCount = items.filter((item) => item.completed).length;

    if (completedCount === 0) {
      setMessage("ยังไม่มีรายการที่ติ๊กไว้");
      return;
    }

    const res = await fetch(`/api/checklist?taskId=${taskId}&completed=true`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage(result.error || "ลบรายการที่ติ๊กไม่สำเร็จ");
      return;
    }

    setItems((current) => current.filter((item) => !item.completed));
    setMessage(`ลบรายการที่ติ๊กแล้ว ${result.deletedCount} รายการ`);
  };

  const deleteAttachment = async (id: string, url: string) => {
    if (!canEdit) return;

    const res = await fetch(`/api/checklist/${id}/attachments`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage(result.error || "ลบไฟล์แนบไม่สำเร็จ");
      return;
    }

    setItems((current) => current.map((item) => (item._id === id ? result : item)));
  };

  const checkedCount = items.filter((item) => item.completed).length;

  const uploadFile = async (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canEdit) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/checklist/${id}/attachments`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    event.target.value = "";

    if (!res.ok) {
      setMessage(result.error || "อัปโหลดไฟล์ไม่สำเร็จ");
      return;
    }

    setItems((current) => current.map((item) => (item._id === id ? result : item)));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-stretch gap-2">
        <input
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && addItem()}
          disabled={!canEdit || loading}
          placeholder={canEdit ? "เพิ่มรายการ..." : "คุณมีสิทธิ์ดูอย่างเดียว"}
          className="min-w-64 flex-1 rounded-lg border px-3 py-2 disabled:bg-gray-100"
        />
        <button
          type="button"
          onClick={addItem}
          disabled={!canEdit || loading || !newTitle.trim()}
          className="shrink-0 whitespace-nowrap rounded-lg bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          เพิ่ม
        </button>
        <button
          type="button"
          onClick={deleteCompletedItems}
          disabled={!canEdit || checkedCount === 0}
          className="shrink-0 whitespace-nowrap rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
        >
          ลบ {checkedCount > 0 ? `(${checkedCount})` : ""}
        </button>
      </div>

      {message && <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-600">{message}</p>}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={item.completed}
                disabled={!canEdit}
                onChange={(event) =>
                  updateItem(item._id, { completed: event.target.checked })
                }
              />

              <input
                value={item.title}
                disabled={!canEdit}
                onChange={(event) =>
                  setItems((current) =>
                    current.map((currentItem) =>
                      currentItem._id === item._id
                        ? { ...currentItem, title: event.target.value }
                        : currentItem
                    )
                  )
                }
                onBlur={(event) => updateItem(item._id, { title: event.target.value })}
                className="flex-1 border-none bg-transparent font-medium outline-none disabled:text-slate-900"
              />

              <select
                value={item.status}
                disabled={!canEdit}
                onChange={(event) =>
                  updateItem(item._id, {
                    status: event.target.value as ChecklistItem["status"],
                  })
                }
                className="rounded border px-2 py-1 text-sm disabled:bg-gray-100"
              >
                <option value="TODO">TODO</option>
                <option value="DONE">DONE</option>
              </select>

              {canEdit && (
                <button
                  type="button"
                  onClick={() => deleteItem(item._id)}
                  className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                  aria-label="ลบ checklist"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                </button>
              )}
            </div>

            <textarea
              value={item.description || ""}
              disabled={!canEdit}
              onChange={(event) =>
                setItems((current) =>
                  current.map((currentItem) =>
                    currentItem._id === item._id
                      ? { ...currentItem, description: event.target.value }
                      : currentItem
                  )
                )
              }
              onBlur={(event) =>
                updateItem(item._id, { description: event.target.value })
              }
              placeholder="รายละเอียด"
              className="mt-3 min-h-20 w-full rounded-lg border px-3 py-2 text-sm disabled:bg-gray-50"
            />

            <div className="mt-3 space-y-2">
              {canEdit && (
                <input
                  type="file"
                  onChange={(event) => uploadFile(item._id, event)}
                  className="block text-sm"
                />
              )}

              {item.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.attachments.map((attachment) => (
                    <div
                        key={attachment.url}
                        className="relative group"
                        >
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                    >
                      {attachment.type === "image" ? "รูปภาพ" : "ไฟล์"}: {attachment.name}
                    </a>
                     <button
                        type="button"
                        onClick={() => deleteAttachment(item._id, attachment.url)}
                        className="absolute -top-2 -right-2 hidden group-hover:flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
                        aria-label="ลบไฟล์แนบ"
                        >
                            ✕
                    </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

