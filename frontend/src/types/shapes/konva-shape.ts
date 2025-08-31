import { Rect } from "konva/lib/shapes/Rect";
import { Ellipse } from "konva/lib/shapes/Ellipse";
import { Text } from "konva/lib/shapes/Text";
import { Line } from "konva/lib/shapes/Line";
import { Arrow } from "konva/lib/shapes/Arrow";
import { ActiveUser, ArrowProps, AttachedShape } from "./common";

// <****************************> SHAPE BASE <****************************>
interface BaseShape<ShapeStyle> {
  _id: string;
  isLocked: boolean;
  styleProperties: ShapeStyle;
  activeUser?: ActiveUser;
}

// <========================> RECTANGLE <========================>
export interface KonvaRectangle extends BaseShape<Partial<Rect>> {
  type: "rectangle";
  text?: Partial<Text>;
  arrowProps?: ArrowProps[];
}

// <========================> ELLIPSE <========================>
export interface KonvaEllipse extends BaseShape<Partial<Ellipse>> {
  type: "ellipse";
  text?: Partial<Text>;
  arrowProps?: ArrowProps[];
}

// <========================> TEXT <========================>
export interface KonvaText extends BaseShape<Partial<Text>> {
  type: "text";
  arrowProps?: ArrowProps[];
}

// <========================> FREE-HAND <========================>
export interface KonvaFreeHand extends BaseShape<Partial<Line>> {
  type: "free hand";
}

// <========================> Arrow <========================>
export interface KonvaArrow extends BaseShape<Partial<Arrow>> {
  type: "arrow";
  attachedShape?: AttachedShape;
}

export interface KonvaEraser extends Omit<BaseShape<Rect>, "_id" | "isLocked" | "activeUser"> {
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
  | Partial<Rect>
  | Partial<Ellipse>
  | Partial<Rect>
  | Partial<Line>
  | Partial<Arrow>
  | Partial<Text>;

// <========================> ALL SHAPE PROPS MAP <========================>
export interface KonvaStyleMap {
  rectangle: Partial<Rect>;
  ellipse: Partial<Ellipse>;
  eraser: Partial<Rect>;
  "free hand": Partial<Line>;
  arrow: Partial<Arrow>;
  text: Partial<Text>;
}

// <========================> Combine KonvaShape <========================>
export type KonvaShape =
  | KonvaRectangle
  | KonvaEllipse
  | KonvaEraser
  | KonvaText
  | KonvaFreeHand
  | KonvaArrow;
