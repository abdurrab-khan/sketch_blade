import { RectConfig } from "konva/lib/shapes/Rect";
import { TextConfig } from "konva/lib/shapes/Text";
import { LineConfig } from "konva/lib/shapes/Line";
import { ArrowConfig } from "konva/lib/shapes/Arrow";
import { ActiveUser, ArrowProps, AttachedShape } from "./common";
import { EllipseConfig } from "konva/lib/shapes/Ellipse";
import {
  ArrowStyle,
  EllipseStyle,
  EraserStyle,
  FreeHandStyle,
  RectangleStyle,
  TextStyle,
} from "./style-properties";

// <****************************> SHAPE BASE <****************************>
interface BaseShape<ShapeStyle> {
  _id: string;
  isLocked: boolean;
  styleProperties: ShapeStyle;
  activeUser?: ActiveUser;
}

// <****************************> SHAPE STYLES <****************************>
type PickShared<T, U> = {
  [K in keyof T & keyof U]-?: NonNullable<T[K]>;
};

export type KonvaRectStyle = PickShared<RectConfig, RectangleStyle>; // RectStyle
export type KonvaEllipseStyle = PickShared<EllipseConfig, EllipseStyle>; // EllipseStyle
export type KonvaTextStyle = PickShared<TextConfig, TextStyle>; // TextStyle
export type KonvaFreeHandStyle = PickShared<LineConfig, FreeHandStyle>; // LineStyle
export type KonvaArrowStyle = PickShared<ArrowConfig, ArrowStyle>; // ArrowStyle
export type KonvaEraserStyle = PickShared<ArrowConfig, EraserStyle>; // EraserStyle

// <****************************> SHAPES <****************************>
export interface KonvaRectangle extends BaseShape<KonvaRectStyle> {
  type: "rectangle";
  text?: KonvaTextStyle;
  arrowProps?: ArrowProps[];
}

export interface KonvaEllipse extends BaseShape<KonvaEllipseStyle> {
  type: "ellipse";
  text?: KonvaTextStyle;
  arrowProps?: ArrowProps[];
}

export interface KonvaText extends BaseShape<KonvaTextStyle> {
  type: "text";
  arrowProps?: ArrowProps[];
}

export interface KonvaFreeHand extends BaseShape<KonvaFreeHandStyle> {
  type: "free hand";
}

export interface KonvaArrow extends BaseShape<KonvaArrowStyle> {
  type: "arrow";
  attachedShape?: AttachedShape;
}

export interface KonvaEraser
  extends Omit<BaseShape<KonvaEraserStyle>, "_id" | "isLocked" | "activeUser"> {
  type: "eraser";
}

export interface KonvaShapeMap {
  rectangle: KonvaRectangle;
  ellipse: KonvaEllipse;
  eraser: KonvaEraser;
  "free hand": KonvaFreeHand;
  arrow: KonvaArrow;
  text: KonvaText;
}

export type KonvaStyles =
  | KonvaRectStyle
  | KonvaEllipseStyle
  | KonvaTextStyle
  | KonvaFreeHandStyle
  | KonvaArrowStyle
  | KonvaEraserStyle;

// <========================> ALL SHAPE PROPS MAP <========================>
export type KonvaStyleMap = {
  [K in keyof KonvaShapeMap]: KonvaShapeMap[K]["styleProperties"];
};

// <========================> Combine KonvaShape <========================>
export type KonvaShape =
  | KonvaRectangle
  | KonvaEllipse
  | KonvaEraser
  | KonvaText
  | KonvaFreeHand
  | KonvaArrow;

// <========================> Konva Text Supported Shapes <========================>
type KonvaTShape<T> = T extends { text?: any } ? T : never;
export type KonvaTextSupportedShapes = KonvaTShape<KonvaShape>;
