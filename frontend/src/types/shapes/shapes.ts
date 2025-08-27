import { DrawingToolTypeLiteral } from "../tools/tool";
import { ActiveUser, ArrowProps, AttachedShape } from "./common";
import {
  ArrowStyle,
  EllipseStyle,
  FreeHandStyle,
  RectangleStyle,
  TextStyle,
} from "./style-properties";

// <========================> RECTANGLE <========================>
export interface Rectangle {
  _id: string;
  type: DrawingToolTypeLiteral;
  text?: TextStyle;
  isLocked: boolean;
  arrowProps?: ArrowProps[];
  styleProperties: RectangleStyle;
  activeUser?: ActiveUser;
}

// <========================> ELLIPSE <========================>
export interface Ellipse {
  _id: string;
  type: DrawingToolTypeLiteral;
  text?: TextStyle;
  isLocked: boolean;
  arrowProps?: ArrowProps[];
  styleProperties: EllipseStyle;
  activeUser?: ActiveUser;
}

// <========================> TEXT <========================>
export interface Text {
  _id: string;
  type: DrawingToolTypeLiteral;
  isLocked: boolean;
  arrowProps?: ArrowProps[];
  styleProperties: TextStyle;
  activeUser?: ActiveUser;
}

// <========================> FREE-HAND <========================>
export interface FreeHand {
  _id: string;
  type: DrawingToolTypeLiteral;
  isLocked: boolean;
  styleProperties: FreeHandStyle;
  activeUser?: ActiveUser;
}

// <========================> Arrow <========================>
export interface Arrow {
  _id: string;
  type: DrawingToolTypeLiteral;
  isLocked: boolean;
  attachedShape?: AttachedShape;
  styleProperties: ArrowStyle;
  activeUser?: ActiveUser;
}

export type CombineShape = Rectangle | Ellipse | Text | FreeHand | Arrow;
