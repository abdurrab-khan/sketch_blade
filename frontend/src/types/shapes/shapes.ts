import { DrawingToolTypeLiteral } from "../tools/tool";
import { ActiveUser, ArrowProps } from "./common";
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
  text: TextStyle;
  type: DrawingToolTypeLiteral;
  arrowProps: ArrowProps[];
  isLocked: boolean;
  styleProperties: RectangleStyle;
  activeUser?: ActiveUser;
}

// <========================> ELLIPSE <========================>
export interface Ellipse {
  _id: string;
  text: TextStyle;
  type: DrawingToolTypeLiteral;
  arrowProps: ArrowProps[];
  isLocked: boolean;
  styleProperties: EllipseStyle;
  activeUser?: ActiveUser;
}

// <========================> TEXT <========================>
export interface Text {
  _id: string;
  type: DrawingToolTypeLiteral;
  isLocked: boolean;
  arrowProps: ArrowProps[];
  styleProperties: TextStyle;
  activeUser?: ActiveUser;
}

// <========================> FREE-HAND <========================>
export interface FreeHand {
  _id: string;
  type: DrawingToolTypeLiteral;
  isLocked: boolean;
  arrowProps: ArrowProps[];
  styleProperties: FreeHandStyle;
  activeUser?: ActiveUser;
}

// <========================> Arrow <========================>
export interface Arrow {
  _id: string;
  type: DrawingToolTypeLiteral;
  isLocked: boolean;
  arrowProps: ArrowProps[];
  styleProperties: ArrowStyle;
  activeUser?: ActiveUser;
}

export type CombineShape = Rectangle | Ellipse | Text | FreeHand | Arrow;
