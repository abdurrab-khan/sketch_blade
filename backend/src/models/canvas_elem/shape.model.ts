import { model, Schema, Document } from "mongoose";

interface Shape extends Document {
  name: string;
  background_color: string;
  edge_style: "rounded" | "sharp";
  fill_style: string;
  stroke_width: number;
  stroke_color: string;
  stroke_style: "solid" | "dotted" | "dashed";
  opacity: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  locked: boolean;
  file_id: Schema.Types.ObjectId;
  link: string;
}

const ShapeSchema = new Schema<Shape>({
  name: {
    type: String,
    required: true,
  },
  background_color: {
    type: String,
    default: "#ffffff",
  },
  edge_style: {
    type: String,
    enum: ["rounded", "sharp"],
    default: "rounded",
  },
  stroke_style: {
    type: String,
    enum: ["solid", "dotted", "dashed"],
    default: "solid",
  },
  fill_style: {
    type: String,
    default: "solid",
  },
  stroke_width: {
    type: Number,
    default: 1,
  },
  stroke_color: {
    type: String,
    default: "#000000",
  },
  opacity: {
    type: Number,
    default: 1,
  },
  position: {
    x: {
      type: Number,
    },
    y: {
      type: Number,
    },
  },
  size: {
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
  },
  rotation: {
    type: Number,
    default: 0,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  file_id: {
    type: Schema.Types.ObjectId,
    ref: "File",
    required: true,
  },
  link: {
    type: String,
    default: "",
  },
});

export default model<Shape>("Shape", ShapeSchema);
