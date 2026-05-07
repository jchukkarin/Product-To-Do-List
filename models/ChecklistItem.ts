import mongoose from "mongoose";

const AttachmentSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "file"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ChecklistItemSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ["TODO", "DONE"],
      default: "TODO",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    attachments: {
      type: [AttachmentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.ChecklistItem ||
  mongoose.model("ChecklistItem", ChecklistItemSchema);
