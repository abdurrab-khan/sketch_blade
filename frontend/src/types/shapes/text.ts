import { TextToolProps } from "../tools/tool";
import { CommonShapeType, CommonText } from "./common";

export interface Text extends CommonShapeType, CommonText {
  x: number;
  y: number;
  height: number;
  width: number;
  customProperties: TextToolProps;
}
