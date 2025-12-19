import { model, Schema, Document } from "mongoose";

interface Image extends Document {
  name: string;
  image_url: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  opacity: number;
  edge_style: "rounded" | "sharp";
  rotation: number;
  locked: boolean;
  file_id: Schema.Types.ObjectId;
  link: string;
}

const ImageSchema = new Schema<Image>({
  name: {
    type: String,
    default: "image",
  },
  edge_style: {
    type: String,
    enum: ["rounded", "sharp"],
    default: "rounded",
  },
  opacity: {
    type: Number,
    default: 1,
  },
  image_url: {
    type: String,
    required: true,
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
  },
});

export default model<Image>("Image", ImageSchema);
