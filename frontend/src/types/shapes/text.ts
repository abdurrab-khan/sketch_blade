import { TextToolProps } from "../tools/tool";
import { CommonShapeType, TextAlign } from "./common";

export interface Text extends CommonShapeType {
  x: number;
  y: number;
  height: number;
  width: number;
  stroke: string;
  fontSize: number;
  opacity: number;
  text: string[];
  textAlign: Lowercase<TextAlign>;
  customProperties: TextToolProps;
}

export interface ShapeText {
  x: number;
  y: number;
  height: number;
  width: number;
  stroke: string;
  fontSize: number;
  opacity: number;
  text: string[];
  textAlign: Lowercase<TextAlign>;
  customProperties: TextToolProps;
}
