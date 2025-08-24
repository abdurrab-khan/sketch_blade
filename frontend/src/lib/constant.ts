import { CommonToolProperties } from "@/types/tools/common";
import { AllToolBarProperties, ToolTypeValue } from "@/types/tools/tool";

export const MAX_ARROW_LIMIT = 15;
export const ARROW_CIRCLE_RADIUS = 4;

export const TOOLBAR_TOOL_TYPES = [
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

export const toolBarProperties: Record<
  ToolTypeValue,
  Partial<AllToolBarProperties> | null
> = {
  cursor: null,
  hand: null,
  upload: null,
  "free hand": {
    type: "free hand",
    ...commonProperties,
  },
  ellipse: {
    type: "ellipse",
    fill: "#0A1F2C",
    fillStyle: "SOLID",
    ...commonProperties,
  },
  rectangle: {
    type: "rectangle",
    fill: "#0A1F2C",
    fillStyle: "SOLID",
    edgeStyle: "ROUNDED",
    ...commonProperties,
  },
  text: {
    type: "text",
    stroke: "#ffffff",
    fontSize: "MEDIUM",
    fontFamily: "NORMAL",
    textAlign: "CENTER",
    opacity: 1,
  },
  eraser: {
    type: "eraser",
    eraserRadius: 15,
  },
  "point arrow": {
    type: "point arrow",
    edgeStyle: "ROUNDED",
    ...commonProperties,
  },
};

export const LOCALSTORAGE_KEY = "canvas_all_shapes";
