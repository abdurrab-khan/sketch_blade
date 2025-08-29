import { ActiveUser, ArrowProps, AttachedShape } from "./common";
import {
  ArrowStyle,
  EllipseStyle,
  EraserStyle,
  FreeHandStyle,
  RectangleStyle,
  TextStyle,
} from "./style-properties";

// <****************************> SHAPE BASE <****************************>
interface BaseShape<ShapeStyle = never> {
  _id: string;
  isLocked: boolean;
  styleProperties: ShapeStyle;
  activeUser?: ActiveUser;
}

// <========================> Cursor <========================>
export interface Cursor
  extends Omit<BaseShape, "_id" | "isLocked" | "styleProperties" | "activeUser"> {
  type: "cursor";
}

// <========================> Hand <========================>
export interface Hand
  extends Omit<BaseShape, "_id" | "isLocked" | "styleProperties" | "activeUser"> {
  type: "free hand";
}

// <========================> RECTANGLE <========================>
export interface Rectangle extends BaseShape<RectangleStyle> {
  type: "rectangle";
  text?: TextStyle;
  arrowProps?: ArrowProps[];
}

// <========================> ELLIPSE <========================>
export interface Ellipse extends BaseShape<EllipseStyle> {
  type: "ellipse";
  text?: TextStyle;
  arrowProps?: ArrowProps[];
}

// <========================> TEXT <========================>
export interface Text extends BaseShape<TextStyle> {
  type: "text";
  arrowProps?: ArrowProps[];
}

// <========================> FREE-HAND <========================>
export interface FreeHand extends BaseShape<FreeHandStyle> {
  type: "free hand";
}

// <========================> Arrow <========================>
export interface Arrow extends BaseShape<ArrowStyle> {
  type: "arrow";
  attachedShape?: AttachedShape;
}

// <========================> Eraser <========================>
export interface Eraser extends Omit<BaseShape<EraserStyle>, "_id"> {
  type: "eraser";
}

// <========================> UPLOAD <========================>
export interface Upload
  extends Omit<BaseShape, "_id" | "isLocked" | "styleProperties" | "activeUser"> {
  type: "upload";
}

// <========================> ALL SHAPE MAP <========================>
export interface ShapeMap {
  cursor: Cursor;
  hand: Hand;
  "free hand": FreeHand;
  rectangle: Rectangle;
  ellipse: Ellipse;
  text: Text;
  arrow: Arrow;
  eraser: Eraser;
}

export type ToolType = keyof ShapeMap;

export type Shapes = Rectangle | Ellipse | Text | Eraser | FreeHand | Arrow;
