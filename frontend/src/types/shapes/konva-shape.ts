import { Rect } from "konva/lib/shapes/Rect";
import { Ellipse } from "konva/lib/shapes/Ellipse";
import { Text } from "konva/lib/shapes/Text";
import { Line } from "konva/lib/shapes/Line";
import { Arrow } from "konva/lib/shapes/Arrow";
import { DrawingToolTypeLiteral } from "../tools/tool";
import { ActiveUser, ArrowProps, AttachedShape } from "./common";

// <========================> RECTANGLE <========================>
export interface KonvaRectangle {
  _id: string;
  type: DrawingToolTypeLiteral;
  text?: Partial<KonvaText>;
  isLocked: boolean;
  isDraggable: boolean;
  arrowProps?: ArrowProps[];
  styleProperties: Partial<Rect>;
  activeUser?: ActiveUser;
}

// <========================> ELLIPSE <========================>
export interface KonvaEllipse {
  _id: string;
  type: DrawingToolTypeLiteral;
  text?: Partial<KonvaText>;
  isLocked: boolean;
  isDraggable: boolean;
  arrowProps?: ArrowProps[];
  styleProperties: Partial<Ellipse>;
  activeUser?: ActiveUser;
}

// <========================> TEXT <========================>
export interface KonvaText {
  _id: string;
  type: DrawingToolTypeLiteral;
  isLocked: boolean;
  isDraggable: boolean;
  arrowProps?: ArrowProps[];
  styleProperties: Partial<Text>;
  activeUser?: ActiveUser;
}

// <========================> FREE-HAND <========================>
export interface KonvaFreeHand {
  _id: string;
  type: DrawingToolTypeLiteral;
  isLocked: boolean;
  isDraggable: boolean;
  styleProperties: Partial<Line>;
  activeUser?: ActiveUser;
}

// <========================> Arrow <========================>
export interface KonvaArrow {
  _id: string;
  type: DrawingToolTypeLiteral;
  isLocked: boolean;
  isDraggable: boolean;
  attachedShape?: AttachedShape;
  styleProperties: Partial<Arrow>;
  activeUser?: ActiveUser;
}

// <========================> ALL SHAPE PROPS MAP <========================>
export interface ShapePropsMap {
  rectangle: KonvaRectangle;
  ellipse: KonvaEllipse;
  "free hand": KonvaFreeHand;
  "point arrow": KonvaArrow;
  text: KonvaText;
}

// <========================> Combine KonvaShape <========================>
export type CombineKonvaShape =
  | KonvaRectangle
  | KonvaEllipse
  | KonvaText
  | KonvaFreeHand
  | KonvaArrow;
