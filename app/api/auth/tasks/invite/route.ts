import { connectDB } from "@/lib/mongodb";
import { getCurrentUserId, getTaskAccess } from "@/lib/taskPermissions";
import Task from "@/models/Task";
import TaskMember from "@/models/TaskMember";
import User from "@/models/User";
import { NextResponse } from "next/server";

const roles = ["VIEWER", "EDITOR"] as const;

export async function POST(req: Request) {
  await connectDB();

  const currentUserId = getCurrentUserId(req);

  if (!currentUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId, email, role } = await req.json();

  if (!taskId || !email || !roles.includes(role)) {
    return NextResponse.json(
      { error: "taskId, email and role are required" },
      { status: 400 }
    );
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const access = await getTaskAccess(task, currentUserId);

  if (!access?.isOwner) {
    return NextResponse.json({ error: "Only owner can invite" }, { status: 403 });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    return NextResponse.json({ error: "ไม่พบ user" }, { status: 404 });
  }

  if (task.owner?.toString() === user._id.toString()) {
    return NextResponse.json(
      { error: "Owner already has access" },
      { status: 400 }
    );
  }

  const member = await TaskMember.findOneAndUpdate(
    { taskId, userId: user._id },
    { role },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate("userId", "name email");

  return NextResponse.json({ message: "Invite success", member });
}
