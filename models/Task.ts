import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    status: {
      type: String,
      enum: ["TODO", "DOING", "DONE"],
      default: "TODO",
    },
    dueDate: Date,
    userId: String,
  },
  { timestamps: true }
);

export default mongoose.models.Task ||
  mongoose.model("Task", TaskSchema);