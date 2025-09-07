import { ShapeStyle } from "@/types/shapes";

export const MAX_ARROW_LIMIT = 15;
export const ARROW_CIRCLE_RADIUS = 4;

export const ArrowSupportedShapes = ["rectangle", "ellipse", "text"];

export const shapeStyleProperties: ShapeStyle = {
  cursor: null,
  hand: null,
  rectangle: {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    rotation: 0,
    opacity: 1,
    dash: "SOLID",
    stroke: "#3282B8",
    strokeWidth: "THIN",
    fill: "#0A1F2C",
    fillPatternImage: "SOLID",
    cornerRadius: "ROUNDED",
  },
  ellipse: {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    rotation: 0,
    dash: "SOLID",
    opacity: 1,
    stroke: "#3282B8",
    strokeWidth: "THIN",
    fill: "#0A1F2C",
    fillPatternImage: "SOLID",
  },
  text: {
    text: "",
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    rotation: 0,
    stroke: "#ffffff",
    fontSize: "MEDIUM",
    fontFamily: "NORMAL",
    align: "CENTER",
    opacity: 1,
  },
  eraser: {
    radius: 15,
  },
  "free hand": {
    rotation: 0,
    dash: "SOLID",
    opacity: 1,
    points: [],
    stroke: "#3282B8",
    strokeWidth: "THIN",
  },
  arrow: {
    points: [],
    dash: "SOLID",
    rotation: 0,
    stroke: "#3282B8",
    strokeWidth: "THIN",
    opacity: 1,
    tension: "ROUNDED",
  },
};

export const LOCALSTORAGE_KEY = "canvas_all_shapes";
