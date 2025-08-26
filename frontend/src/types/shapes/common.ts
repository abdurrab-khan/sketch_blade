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

export type AttachedShape = Record<ArrowPosition, string>;
export interface ArrowProps {
  _id: string;
  x: number;
  y: number;
  arrowPosition: ArrowPosition;
  arrowDirection?: ArrowDirection;
}

export interface ActiveUser {
  _id: string;
  name: string;
  email: string;
  image: string;
}
