import { PointArrowToolProps } from "../tools/tool";
import { CommonShapeType, ArrowPosition } from "./common";

export type AttachedShape = Record<ArrowPosition, string>;

export interface Arrow extends CommonShapeType {
  points: number[];
  stroke: string;
  strokeWidth: number;
  dash: number[];
  tension: number;
  isDrawingArrow: boolean;
  attachedShape: AttachedShape | null;
  customProperties: PointArrowToolProps;
}
