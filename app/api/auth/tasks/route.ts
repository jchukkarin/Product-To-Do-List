import { connectDB } from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/taskPermissions";
import Task from "@/models/Task";
import TaskMember from "@/models/TaskMember";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const userId = getCurrentUserId(req);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 🔍 รับ query จาก URL
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search");
  const status = searchParams.get("status");

  // 👥 หา task ที่ user เป็น member
  const memberships = await TaskMember.find({
    userId,
  }).select("taskId");

  const memberTaskIds = memberships.map(
    (member) => member.taskId
  );

  // 🔥 query หลัก
  const query: any = {
    $and: [
      {
        $or: [
          { owner: userId },
          { userId },
          { _id: { $in: memberTaskIds } },
        ],
      },
    ],
  };

  // 🔍 Search
  if (search) {
    query.$and.push({
      $or: [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    });
  }

  // 🏷️ Filter status
  if (status) {
    query.$and.push({
      status,
    });
  }

  // 📋 ดึงข้อมูล
  const tasks = await Task.find(query).sort({
    createdAt: -1,
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  await connectDB();

  const userId = getCurrentUserId(req);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const task = await Task.create({
    ...body,
    owner: userId,
    userId,
  });

  return NextResponse.json(task);
}