import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const task = await Task.findById(id);

  return Response.json(task);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const body = await req.json();

  const task = await Task.findByIdAndUpdate(
    id,
    body,
    { new: true }
  );

  return Response.json(task);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  await Task.findByIdAndDelete(id);

  return Response.json({ message: "Deleted" });
}
