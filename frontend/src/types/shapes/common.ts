import { Collaborator } from "../user";
import { DrawingToolTypeLiteral, ToolBarProperties } from "../tools/tool";
import { ArrowProps } from "..";

export type StrokeStyle = "SOLID" | "DOTTED" | "DASHED";
export type FillStyle = "SOLID" | "CROSSHATCH" | "HACHURE";
export type EdgeStyle = "SHARP" | "ROUNDED";
export type StrokeWidth = "THIN" | "MEDIUM" | "THICK";
export type FontSize = "SMALL" | "MEDIUM" | "LARGE";
export type ArrowPosition = "START" | "END";
export type TextHorizontalAlign = "LEFT" | "CENTER" | "RIGHT";
export type TextVerticalAlign = "TOP" | "MIDDLE" | "BOTTOM";
export type ArrowDirection = "LEFT" | "RIGHT" | "TOP" | "BOTTOM" | "CENTER";
export type FontFamily = "NORMAL" | "CODE" | "JO BHI HAI";

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
  customProperties: ToolBarProperties;
  text: CommonText | null;
  fillPatternImage: string | null;
  arrowProps?: ArrowProps[];
}

export interface CommonText {
  text: string;
  fontSize: FontSize;
  fontFamily: FontFamily;
  color: string;
  horizontalAlign: TextHorizontalAlign;
  verticalAlign: TextVerticalAlign;
  customProperties: Partial<ToolBarProperties>;
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
