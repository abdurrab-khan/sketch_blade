import {
  EdgeStyle,
  FillStyle,
  FontFamily,
  FontSize,
  StrokeStyle,
  StrokeWidth,
  TextAlign,
} from "./common";

// <========================> RECTANGLE <========================>
export interface RectangleStyle {
  x: number;
  y: number;
  height: number;
  width: number;
  fill: string;
  fillPattern: FillStyle;
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
  fillPattern: FillStyle;
  stroke: string;
  dash: StrokeStyle;
  strokeWidth: StrokeWidth;
  opacity: number;
}

// <========================> TEXT <========================>
export interface TextStyle {
  stroke: string;
  fontSize: FontSize;
  fontFamily: FontFamily;
  align: TextAlign;
  opacity: number;
}

// <========================> FREE-HAND <========================>
export interface FreeHandStyle {
  text: string;
  stroke: string;
  dash: StrokeStyle;
  strokeWidth: StrokeWidth;
  opacity: number;
}

// <========================> Arrow <========================>
export interface ArrowStyle {
  stroke: string;
  dash: StrokeStyle;
  strokeWidth: StrokeWidth;
  tension: EdgeStyle;
  opacity: number;
}

export type CombineShapeStyle = Partial<
  RectangleStyle & EllipseStyle & TextStyle & FreeHandStyle & ArrowStyle
>;
