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
    fill: "#0A1F2C",
    fillStyle: "SOLID",
    type: "ellipse",
    ...commonProperties,
  },
  rectangle: {
    fill: "#0A1F2C",
    fillStyle: "SOLID",
    edgeStyle: "ROUNDED",
    type: "rectangle",
    ...commonProperties,
  },
  text: {
    stroke: "#ffffff",
    fontSize: "MEDIUM",
    fontFamily: "NORMAL",
    textAlign: "CENTER",
    opacity: 1,
    type: "text",
  },
  eraser: {
    eraserRadius: 15,
    type: "eraser",
  },
  "point arrow": {
    edgeStyle: "ROUNDED",
    type: "point arrow",
    ...commonProperties,
  },
};

export const LOCALSTORAGE_KEY = "canvas_all_shapes";
