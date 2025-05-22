import mongoose, { Schema, model, Document } from "mongoose";
import { IProject } from "../../types/project";

interface IProjectDocument extends IProject, Document {}

const resourceSchema = new Schema({
  type: { type: String, enum: ["video", "article", "course"], required: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
});

const projectSchema = new Schema<IProjectDocument>(
  {
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    resources: [resourceSchema],
    author: { type: String, ref: "user" },
    coverImage: { type: String },
    // featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Project = model<IProjectDocument>("Project", projectSchema);
