import mongoose from "mongoose";

const TaskMemberSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["VIEWER", "EDITOR"],
      default: "VIEWER",
      required: true,
    },
  },
  { timestamps: true }
);

TaskMemberSchema.index({ taskId: 1, userId: 1 }, { unique: true });

export default mongoose.models.TaskMember ||
  mongoose.model("TaskMember", TaskMemberSchema);
