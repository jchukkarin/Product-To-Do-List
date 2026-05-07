import { connectDB } from "@/lib/mongodb";
import { getCurrentUserId, getTaskAccess } from "@/lib/taskPermissions";
import ChecklistItem from "@/models/ChecklistItem";
import Task from "@/models/Task";
import { mkdir, unlink, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const userId = getCurrentUserId(req);
  const item = await ChecklistItem.findById(id);

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const task = await Task.findById(item.taskId);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const access = await getTaskAccess(task, userId);

  if (!access?.canEdit) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${Date.now()}-${safeName}`;

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);

  const attachment = {
    url: `/uploads/${fileName}`,
    type: file.type.startsWith("image/") ? "image" : "file",
    name: file.name,
  };

  item.attachments.push(attachment);
  await item.save();

  return NextResponse.json(item);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const userId = getCurrentUserId(req);
  const { url } = await req.json();
  const item = await ChecklistItem.findById(id);

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const task = await Task.findById(item.taskId);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const access = await getTaskAccess(task, userId);

  if (!access?.canEdit) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  item.attachments = item.attachments.filter(
    (attachment: { url: string }) => attachment.url !== url
  );
  await item.save();

  if (url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", url);
    await unlink(filePath).catch(() => undefined);
  }

  return NextResponse.json(item);
}
