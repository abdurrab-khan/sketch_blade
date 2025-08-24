import { Collaborator } from "../user";
import { DrawingToolTypeLiteral, AllToolBarProperties } from "../tools/tool";
import { ArrowProps } from "..";
import { Texts } from "./shape-union";

export type StrokeStyle = "SOLID" | "DOTTED" | "DASHED";
export type FillStyle = "SOLID" | "CROSSHATCH" | "HACHURE";
export type EdgeStyle = "SHARP" | "ROUNDED";
export type StrokeWidth = "THIN" | "MEDIUM" | "THICK";
export type FontSize = "SMALL" | "MEDIUM" | "LARGE";
export type ArrowPosition = "START" | "END";
export type TextHorizontalAlign = "LEFT" | "CENTER" | "RIGHT";
export type TextVerticalAlign = "TOP" | "MIDDLE" | "BOTTOM";
export type ArrowDirection = "LEFT" | "RIGHT" | "TOP" | "BOTTOM" | "CENTER";
export type FontFamily = "NORMAL" | "CODE" | "SANS-SERIF";
export type TextAlign = "LEFT" | "CENTER" | "RIGHT";

export type SelectionPurpose = "FOR_EDITING" | "FOR_DELETING" | "DEFAULT";

export interface BoundedShapeProperties {
  x: number;
  y: number;
  height: number;
  width: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  dash: number[];
  lineCap: EdgeStyle;
  customProperties: AllToolBarProperties;
  text: Texts | null;
  fillPatternImage: string | null;
  arrowProps?: ArrowProps[];
}

export interface CommonShapeType {
  _id: string;
  layer: number;
  opacity: number;
  isLocked: boolean;
  isAddable: boolean;
  draggable: boolean;
  isSelected: boolean;
  type: DrawingToolTypeLiteral;
  collaborator: Collaborator | null;
}
