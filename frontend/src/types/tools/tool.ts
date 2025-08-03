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

export interface ActiveTool {
  type: ToolType;
  isLocked: boolean;
}

export type FreeHandToolProps = CommonToolProperties;

export interface EllipseToolProps extends CommonToolProperties {
  fill: string;
  fillStyle: FillStyle;
}
export interface RectangleToolProps extends CommonToolProperties {
  fill: string;
  fillStyle: FillStyle;
  edgeStyle: EdgeStyle;
}
export interface TextToolProps {
  stroke: string;
  fontSize: FontSize;
  fontFamily: FontFamily;
  textAlign: TextAlign;
  opacity: number;
}
export interface EraserToolProps {
  eraserRadius: number;
}
export interface PointArrowToolProps extends CommonToolProperties {
  edgeStyle: EdgeStyle;
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
