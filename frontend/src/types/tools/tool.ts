import {
  EdgeStyle,
  FillStyle,
  FontSize,
  StrokeStyle,
  StrokeWidth,
} from "../shapes/common";

export enum ToolType {
  Hand = "hand",
  Cursor = "cursor",
  Rectangle = "rectangle",
  Ellipse = "ellipse",
  Eraser = "eraser",
  Text = "text",
  FreeHand = "free hand",
  PointArrow = "point arrow",
  Upload = "upload",
}

export enum DrawingToolType {
  Rectangle = "rectangle",
  Ellipse = "ellipse",
  Text = "text",
  FreeHand = "free hand",
  PointArrow = "point arrow",
}

export type DrawingToolTypeLiteral = `${DrawingToolType}`;

export interface ActiveTool {
  type: ToolType;
  isLocked: boolean;
}

export type ToolBarProperties = {
  fill: string;
  fillStyle: FillStyle;
  stroke: string;
  strokeStyle: StrokeStyle;
  strokeWidth: StrokeWidth;
  edgeStyle: EdgeStyle;
  opacity: number;
  eraserRadius: number;
  fontSize: FontSize;
};
