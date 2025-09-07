import { RectConfig } from "konva/lib/shapes/Rect";
import { EllipseConfig } from "konva/lib/shapes/Ellipse";
import { TextConfig } from "konva/lib/shapes/Text";
import { LineConfig } from "konva/lib/shapes/Line";
import { ArrowConfig } from "konva/lib/shapes/Arrow";
import { ActiveUser, ArrowProps, AttachedShape } from "./common";

// <****************************> SHAPE BASE <****************************>
interface BaseShape<ShapeStyle> {
  _id: string;
  isLocked: boolean;
  styleProperties: ShapeStyle;
  activeUser?: ActiveUser;
}

// <========================> RECTANGLE <========================>
export interface KonvaRectangle extends BaseShape<Partial<RectConfig>> {
  type: "rectangle";
  text?: Partial<TextConfig>;
  arrowProps?: ArrowProps[];
}

// <========================> ELLIPSE <========================>
export interface KonvaEllipse extends BaseShape<Partial<EllipseConfig>> {
  type: "ellipse";
  text?: Partial<TextConfig>;
  arrowProps?: ArrowProps[];
}

// <========================> TEXT <========================>
export interface KonvaText extends BaseShape<Partial<TextConfig>> {
  type: "text";
  arrowProps?: ArrowProps[];
}

// <========================> FREE-HAND <========================>
export interface KonvaFreeHand extends BaseShape<Partial<LineConfig>> {
  type: "free hand";
}

// <========================> Arrow <========================>
export interface KonvaArrow extends BaseShape<Partial<ArrowConfig>> {
  type: "arrow";
  attachedShape?: AttachedShape;
}

export interface KonvaEraser
  extends Omit<BaseShape<RectConfig>, "_id" | "isLocked" | "activeUser"> {
  type: "eraser";
}

// <========================> ALL SHAPE PROPS MAP <========================>
export interface KonvaShapeMap {
  rectangle: KonvaRectangle;
  ellipse: KonvaEllipse;
  eraser: KonvaEraser;
  "free hand": KonvaFreeHand;
  arrow: KonvaArrow;
  text: KonvaText;
}

export type KonvaStyles =
  | Partial<RectConfig>
  | Partial<EllipseConfig>
  | Partial<RectConfig>
  | Partial<LineConfig>
  | Partial<ArrowConfig>
  | Partial<TextConfig>;

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
