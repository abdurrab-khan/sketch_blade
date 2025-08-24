import { TextToolProps } from "../tools/tool";
import { CommonShapeType, TextAlign } from "./common";

export interface Text extends CommonShapeType {
  x: number;
  y: number;
  height: number;
  width: number;
  shapeId: string | null;
  stroke: string;
  fontFamily: string;
  fontSize: number;
  opacity: number;
  text: string;
  textAlign: Lowercase<TextAlign>;
  isAddable: boolean;
  customProperties: TextToolProps;
}

export interface ShapeText {
  _id: string;
  x: number;
  y: number;
  height: number;
  width: number;
  shapeId: string | null;
  stroke: string;
  fontFamily: string;
  fontSize: number;
  opacity: number;
  text: string;
  textAlign: Lowercase<TextAlign>;
  isAddable: boolean;
  customProperties: TextToolProps;
}
