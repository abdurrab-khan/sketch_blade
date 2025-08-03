import { CommonToolProperties } from "@/types/tools/common";
import { AllToolTypeObj } from "@/types/tools/tool";

export const MAX_ARROW_LIMIT = 15;
export const ARROW_CIRCLE_RADIUS = 4;

export const ToolBarArr = [
  "text",
  "rectangle",
  "ellipse",
  "point arrow",
  "free hand",
];

export const ArrowSupportedShapes = ["rectangle", "ellipse", "text"];

const commonProperties: CommonToolProperties = {
  stroke: "#3282B8",
  strokeStyle: "SOLID",
  strokeWidth: "THIN",
  opacity: 1,
  draggable: true,
};

export const toolBarProperties: AllToolTypeObj = {
  "free hand": {
    ...commonProperties,
  },
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
    stroke: "#ffffff",
    fontSize: "MEDIUM",
    fontFamily: "NORMAL",
    textAlign: "CENTER",
    opacity: 1,
  },
  eraser: {
    eraserRadius: 15,
  },
  "point arrow": { ...commonProperties, edgeStyle: "ROUNDED" },
};

export const LOCALSTORAGE_KEY = "canvas_all_shapes";
