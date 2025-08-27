import { CombineShapeStyle, StylePropsMap } from "@/types/shapes";

export const MAX_ARROW_LIMIT = 15;
export const ARROW_CIRCLE_RADIUS = 4;

export const CREATOR_TOOLS = [
  "rectangle",
  "ellipse",
  "point arrow",
  "free hand",
];

export const ArrowSupportedShapes = ["rectangle", "ellipse", "text"];

const commonProperties = {
  stroke: "#3282B8",
  strokeStyle: "SOLID",
  strokeWidth: "THIN",
  draggable: true,
  opacity: 1,
} as Partial<CombineShapeStyle>;

export const shapeStyleProperties: {
  [K in keyof StylePropsMap]: Partial<StylePropsMap[K]>;
} = {
  rectangle: {
    fill: "#0A1F2C",
    fillPattern: "SOLID",
    cornerRadius: "ROUNDED",
    ...commonProperties,
  },
  ellipse: {
    fill: "#0A1F2C",
    fillPattern: "SOLID",
    ...commonProperties,
  },
  text: {
    stroke: "#ffffff",
    fontSize: "MEDIUM",
    fontFamily: "NORMAL",
    align: "CENTER",
    opacity: 1,
  },
  eraser: {
    eraserRadius: 15,
  },
  "free hand": {
    ...commonProperties,
  },
  "point arrow": {
    tension: "ROUNDED",
    ...commonProperties,
  },
};

export const LOCALSTORAGE_KEY = "canvas_all_shapes";
