import { ToolType } from "../types/tools/tool";

export const MAX_ARROW_LIMIT = 15;
export const ARROW_CIRCLE_RADIUS = 5;

export const ToolBarArr = [
  "text",
  "rectangle",
  "circle",
  "point arrow",
  "free hand",
];

export const ArrowSupportedShapes = ["rectangle", "circle", "text"];

const commonProperties = {
  stroke: "#3282B8",
  strokeStyle: "SOLID",
  strokeWidth: "THIN",
  opacity: 1,
  draggable: true,
};

export const toolBarProperties: {
  [key in ToolType]: Record<string, string | number | any> | null;
} = {
  cursor: null,
  "free hand": {
    ...commonProperties,
  },
  hand: null,
  ellipse: {
    fill: "#0A1F2C",
    fillStyle: "SOLID",
    ...commonProperties,
  },
  rectangle: {
    fill: "#0A1F2C",
    fillStyle: "SOLID",
    edgeStyle: "ROUNDED",
    ...commonProperties,
  },
  text: {
    stroke: "#3282B8",
    fontSize: "MEDIUM",
    opacity: 1,
  },
  eraser: {
    eraserRadius: 15,
  },
  "point arrow": { ...commonProperties, edgeStyle: "ROUNDED" },
  upload: null,
};

export const LOCALSTORAGE_KEY = "canvas_all_shapes";
