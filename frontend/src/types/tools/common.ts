import { StrokeStyle, StrokeWidth } from "../shapes";
import { ToolBarProperties } from "./tool";

export interface CommonToolProperties {
  stroke: string;
  strokeStyle: StrokeStyle;
  strokeWidth: StrokeWidth;
  opacity: number;
  draggable: boolean;
}

type AllKeysFromUnion<T> = T extends any ? keyof T : never;

export type AllToolBarPropertiesKeys = AllKeysFromUnion<ToolBarProperties>;
