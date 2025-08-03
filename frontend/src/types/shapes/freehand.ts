import { FreeHandToolProps } from "../tools/tool";
import { CommonShapeType } from "./common";

export interface FreeHand extends CommonShapeType {
  points: number[];
  dash: number[];
  stroke: string;
  strokeWidth: number;
  tension: number;
  customProperties: FreeHandToolProps;
}
