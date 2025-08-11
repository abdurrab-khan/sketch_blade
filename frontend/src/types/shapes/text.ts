import { TextToolProps } from "../tools/tool";
import { CommonShapeType, TextAlign } from "./common";

export interface Text extends CommonShapeType {
  x: number;
  y: number;
  height: number;
  width: number;
  shapeId: string;
  stroke: string;
  fontFamily: string;
  fontSize: number;
  opacity: number;
  text: string | null;
  textAlign: Lowercase<TextAlign>;
  customProperties: TextToolProps;
}

export interface ShapeText {
  _id: string;
  x: number;
  y: number;
  height: number;
  width: number;
  shapeId: string;
  stroke: string;
  fontFamily: string;
  fontSize: number;
  opacity: number;
  text: string | null;
  textAlign: Lowercase<TextAlign>;
  customProperties: TextToolProps;
}
