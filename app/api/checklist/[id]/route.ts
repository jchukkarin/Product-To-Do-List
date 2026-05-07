import { connectDB } from "@/lib/mongodb";
import { getCurrentUserId, getTaskAccess } from "@/lib/taskPermissions";
import ChecklistItem from "@/models/ChecklistItem";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

async function getEditableItem(req: Request, id: string) {
  const userId = getCurrentUserId(req);
  const item = await ChecklistItem.findById(id);

  if (!item) {
    return { error: NextResponse.json({ error: "Item not found" }, { status: 404 }) };
  }

  const task = await Task.findById(item.taskId);

  if (!task) {
    return { error: NextResponse.json({ error: "Task not found" }, { status: 404 }) };
  }

  const access = await getTaskAccess(task, userId);

  if (!access?.canEdit) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { item };
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const result = await getEditableItem(req, id);

  if (result.error) return result.error;

  const body = await req.json();
  const update: {
    title?: string;
    description?: string;
    status?: "TODO" | "DONE";
    completed?: boolean;
  } = {};

  if (body.title !== undefined) {
    update.title = String(body.title);
  }

  if (body.description !== undefined) {
    update.description = String(body.description);
  }

  if (body.completed !== undefined) {
    update.completed = Boolean(body.completed);
    update.status = update.completed ? "DONE" : "TODO";
  }

  if (body.status !== undefined) {
    if (body.status !== "TODO" && body.status !== "DONE") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    update.status = body.status;
    update.completed = body.status === "DONE";
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const item = await ChecklistItem.findByIdAndUpdate(id, update, { new: true });

  return NextResponse.json(item);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const result = await getEditableItem(req, id);

  if (result.error) return result.error;

  await ChecklistItem.findByIdAndDelete(id);

  return NextResponse.json({ message: "Deleted" });
}
