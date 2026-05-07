import TaskMember from "@/models/TaskMember";

export type TaskAccess = {
  isOwner: boolean;
  role: "OWNER" | "VIEWER" | "EDITOR";
  canEdit: boolean;
};

type TaskLike = {
  _id: unknown;
  owner?: unknown;
  userId?: unknown;
};

function toId(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "toString" in value) {
    return value.toString();
  }
  return "";
}

export function getCurrentUserId(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const userCookie = cookies.find((cookie) => cookie.startsWith("userId="));

  return userCookie ? decodeURIComponent(userCookie.split("=")[1]) : "";
}

export async function getTaskAccess(
  task: TaskLike,
  userId: string
): Promise<TaskAccess | null> {
  if (!userId) return null;

  const ownerId = toId(task.owner);
  const legacyOwnerId = toId(task.userId);

  if (ownerId === userId || legacyOwnerId === userId) {
    return {
      isOwner: true,
      role: "OWNER",
      canEdit: true,
    };
  }

  const member = await TaskMember.findOne({
    taskId: task._id,
    userId,
  });

  if (!member) return null;

  return {
    isOwner: false,
    role: member.role,
    canEdit: member.role === "EDITOR",
  };
}
