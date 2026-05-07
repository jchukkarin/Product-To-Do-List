import { connectDB } from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/taskPermissions";
import Task from "@/models/Task";
import TaskMember from "@/models/TaskMember";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const userId = getCurrentUserId(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memberships = await TaskMember.find({ userId }).select("taskId");
  const memberTaskIds = memberships.map((member) => member.taskId);

  const tasks = await Task.find({
    $or: [{ owner: userId }, { userId }, { _id: { $in: memberTaskIds } }],
  }).sort({ createdAt: -1 });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  await connectDB();

  const userId = getCurrentUserId(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const task = await Task.create({
    ...body,
    owner: userId,
    userId,
  });

  return NextResponse.json(task);
}
