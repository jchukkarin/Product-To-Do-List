import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

export async function GET() {
  await connectDB();

  const tasks = await Task.find().sort({ createdAt: -1 });

  return Response.json(tasks);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const task = await Task.create(body);

  return Response.json(task);
}