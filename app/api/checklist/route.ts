import { connectDB } from "@/lib/mongodb";
import { getCurrentUserId, getTaskAccess } from "@/lib/taskPermissions";
import ChecklistItem from "@/models/ChecklistItem";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const userId = getCurrentUserId(req);
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    return NextResponse.json({ error: "taskId is required" }, { status: 400 });
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const access = await getTaskAccess(task, userId);

  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const items = await ChecklistItem.find({ taskId }).sort({ createdAt: -1 });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  await connectDB();

  const userId = getCurrentUserId(req);
  const body = await req.json();
  const { taskId, title, description } = body;

  if (!taskId || !title) {
    return NextResponse.json(
      { error: "taskId and title are required" },
      { status: 400 }
    );
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const access = await getTaskAccess(task, userId);

  if (!access?.canEdit) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const item = await ChecklistItem.create({
    taskId,
    title: String(title),
    description: description ? String(description) : "",
    status: "TODO",
    completed: false,
    attachments: [],
  });

  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(req: Request) {
  await connectDB();

  const userId = getCurrentUserId(req);
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");
  const completed = searchParams.get("completed");

  if (!taskId) {
    return NextResponse.json({ error: "taskId is required" }, { status: 400 });
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const access = await getTaskAccess(task, userId);

  if (!access?.canEdit) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const filter = {
    taskId,
    ...(completed === "true" ? { completed: true } : {}),
  };
  const result = await ChecklistItem.deleteMany(filter);

  return NextResponse.json({ deletedCount: result.deletedCount });
}
