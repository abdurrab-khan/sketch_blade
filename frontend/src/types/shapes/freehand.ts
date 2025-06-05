import { ToolBarProperties } from "../tools/tool";
import { CommonShapeType } from "./common";

export interface FreeHand extends CommonShapeType {
  points: number[];
  dash: number[];
  stroke: string;
  strokeWidth: number;
  tension: number;
  customProperties: Partial<ToolBarProperties>;
}
