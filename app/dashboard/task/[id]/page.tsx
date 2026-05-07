import InviteForm from "@/app/components/Task/inviteform";
import TaskCheck from "@/app/components/Task/taskcheck";
import TaskList from "@/app/components/Task/tasklist";
import DeleteTaskButton from "@/app/components/Button/delete-task-button";
import { connectDB } from "@/lib/mongodb";
import { getTaskAccess } from "@/lib/taskPermissions";
import Task from "@/models/Task";
import TaskMember from "@/models/TaskMember";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

type MemberView = {
  id: string;
  name: string;
  email: string;
  role: string;
};

function formatDate(value?: Date | string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(
    new Date(value)
  );
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value || "";

  await connectDB();

  const task = await Task.findById(id);

  if (!task) {
    notFound();
  }

  const access = await getTaskAccess(task, userId);

  if (!access) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
        <h1 className="text-xl font-bold">ไม่มีสิทธิ์เข้าถึงงานนี้</h1>
        <p className="mt-2 text-sm">
          ต้องเป็นเจ้าของงานหรือสมาชิกที่ได้รับเชิญเท่านั้น
        </p>
      </div>
    );
  }

  const permission = {
    canEditStatus: access.isOwner || access.role === "EDITOR",
    canEditDescription: access.isOwner || access.role === "EDITOR",
  };

  const members = await TaskMember.find({ taskId: task._id })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  const memberViews: MemberView[] = members.map((member) => ({
    id: member._id.toString(),
    name: member.userId?.name || "-",
    email: member.userId?.email || "-",
    role: member.role,
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{task.title}</h1>
          <p className="text-sm text-slate-500">
            รายละเอียดงานและสมาชิกที่เข้าถึงได้
          </p>
        </div>

        <Link
          href="/dashboard/task"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
        >
          กลับ
        </Link>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <TaskCheck
            task={{
              _id: task._id.toString(),
              description: task.description,
              status: task.status,
            }}
            permission={permission}
          />

          <div>
            <p className="text-sm font-medium text-slate-500">หมวดหมู่</p>
            <p className="mt-1 text-slate-900">{task.category || "-"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">กำหนดส่ง</p>
            <p className="mt-1 text-slate-900">{formatDate(task.dueDate)}</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          เพิ่มสิ่งที่คุณอยากทำ
        </h2>
        <TaskList taskId={task._id.toString()} canEdit={permission.canEditStatus} />
        <div />
      </section>

      {access.isOwner && <InviteForm taskId={task._id.toString()} />}

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">สมาชิก</h2>

        {memberViews.length === 0 ? (
          <p className="text-sm text-slate-500">ยังไม่มีสมาชิกที่ได้รับเชิญ</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {memberViews.map((member) => (
              <div key={member.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-slate-900">{member.name}</p>
                  <p className="text-sm text-slate-500">{member.email}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
      {access.isOwner && <DeleteTaskButton taskId={task.id.toString()}/>}
    </div>
  );
}
