import {
  EdgeStyle,
  FillStyle,
  FontFamily,
  FontSize,
  StrokeStyle,
  StrokeWidth,
  TextAlign,
} from "./common";
import { ToolType } from "./shapes";

// <========================> RECTANGLE <========================>
export interface RectangleStyle {
  x: number;
  y: number;
  height: number;
  width: number;
  fill: string;
  fillPatternImage: FillStyle;
  stroke: string;
  dash: StrokeStyle;
  strokeWidth: StrokeWidth;
  cornerRadius: EdgeStyle;
  opacity: number;
}

// <========================> ELLIPSE <========================>
export interface EllipseStyle {
  x: number;
  y: number;
  height: number;
  width: number;
  fill: string;
  fillPatternImage: FillStyle;
  stroke: string;
  dash: StrokeStyle;
  strokeWidth: StrokeWidth;
  opacity: number;
}

// <========================> TEXT <========================>
export interface TextStyle {
  text: string;
  stroke: string;
  fontSize: FontSize;
  fontFamily: FontFamily;
  align: TextAlign;
  opacity: number;
}

// <========================> FREE-HAND <========================>
export interface FreeHandStyle {
  points: number[];
  stroke: string;
  dash: StrokeStyle;
  strokeWidth: StrokeWidth;
  opacity: number;
}

// <========================> Arrow <========================>
export interface ArrowStyle {
  points: number[];
  stroke: string;
  dash: StrokeStyle;
  strokeWidth: StrokeWidth;
  tension: EdgeStyle;
  opacity: number;
}

// <========================> Eraser <========================>
export interface EraserStyle {
  eraserRadius: number;
}

// <========================> ALL STYLE PROPS MAP <========================>
export interface StylePropsMap {
  rectangle: RectangleStyle;
  ellipse: EllipseStyle;
  "free hand": FreeHandStyle;
  arrow: ArrowStyle;
  text: TextStyle;
  eraser: EraserStyle;
}

// <========================> ALL STYLE PROPS MAP <========================>

// <========================> Shape Style Partial <========================>
export type ShapeStyle = {
  [K in ToolType]: K extends keyof StylePropsMap ? StylePropsMap[K] : null;
};

export type ShapeStylePartial = {
  [K in ToolType]?: ShapeStyle[K];
}[ToolType];

// <========================> Combine Shape Style <========================>
export type CombineShapeStyle = Partial<
  RectangleStyle & EllipseStyle & TextStyle & FreeHandStyle & ArrowStyle & EraserStyle
>;
