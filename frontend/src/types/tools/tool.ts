import {
  EdgeStyle,
  FillStyle,
  FontFamily,
  FontSize,
  TextAlign,
} from "../shapes/common";
import { CommonToolProperties } from "./common";

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
export type ToolTypeValue = `${ToolType}`;

export interface ActiveTool {
  type: ToolType;
  isLocked: boolean;
}

export interface FreeHandToolProps extends CommonToolProperties {
  type: ToolTypeValue;
}

export interface EllipseToolProps extends CommonToolProperties {
  fill: string;
  fillStyle: FillStyle;
  type: ToolTypeValue;
}
export interface RectangleToolProps extends CommonToolProperties {
  fill: string;
  fillStyle: FillStyle;
  edgeStyle: EdgeStyle;
  type: ToolTypeValue;
}
export interface TextToolProps {
  stroke: string;
  fontSize: FontSize;
  fontFamily: FontFamily;
  opacity: number;
  textAlign: TextAlign;
  type: ToolTypeValue;
}

export interface EraserToolProps {
  eraserRadius: number;
  type: ToolTypeValue;
}
export interface PointArrowToolProps extends CommonToolProperties {
  edgeStyle: EdgeStyle;
  type: ToolTypeValue;
}

export type AllToolBarProperties = Partial<
  FreeHandToolProps &
    EllipseToolProps &
    RectangleToolProps &
    TextToolProps &
    EraserToolProps &
    PointArrowToolProps
>;

export interface AllToolTypeObj {
  "free hand": FreeHandToolProps;
  ellipse: EllipseToolProps;
  rectangle: RectangleToolProps;
  text: TextToolProps;
  eraser: EraserToolProps;
  "point arrow": PointArrowToolProps;
}
