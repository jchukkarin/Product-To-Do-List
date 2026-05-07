import { connectDB } from "@/lib/mongodb";
import { getCurrentUserId, getTaskAccess } from "@/lib/taskPermissions";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const userId = getCurrentUserId(req);

  const task = await Task.findById(id);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const access = await getTaskAccess(task, userId);

  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(task);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const userId = getCurrentUserId(req);

  const body = await req.json();
  const task = await Task.findById(id);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const access = await getTaskAccess(task, userId);

  if (!access?.canEdit) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const allowedStatus = ["TODO", "DOING", "DONE"];
  const update: { description?: string; status?: string } = {};

  if (body.description !== undefined) {
    update.description = String(body.description);
  }

  if (body.status !== undefined) {
    if (!allowedStatus.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    update.status = body.status;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "Only description and status can be updated" },
      { status: 400 }
    );
  }

  const updatedTask = await Task.findByIdAndUpdate(id, update, { new: true });

  return NextResponse.json(updatedTask);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const userId = getCurrentUserId(req);

  const task = await Task.findById(id);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const access = await getTaskAccess(task, userId);

  if (!access?.isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await Task.findByIdAndDelete(id);

  return NextResponse.json({ message: "Deleted" });
}
