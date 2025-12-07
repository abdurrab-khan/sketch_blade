import { model, Schema, Document } from "mongoose";

export interface IText extends Document {
  name: string;
  text: string;
  font_family: string;
  font_size: number;
  color: string;
  opacity: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  text_align: string;
  rotation: number;
  locked: boolean;
  file_id: Schema.Types.ObjectId;
  link: string;
}

const TextSchema = new Schema<IText>({
  name: {
    type: String,
    default: "text",
  },
  text: {
    type: String,
    required: true,
  },
  font_family: {
    type: String,
    required: true,
    default: "Arial",
  },
  font_size: {
    type: Number,
    required: true,
    default: 20,
  },
  color: {
    type: String,
    required: true,
    default: "#000000",
  },
  opacity: {
    type: Number,
    required: true,
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
  text_align: {
    type: String,
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

export default model<IText>("Text", TextSchema);
