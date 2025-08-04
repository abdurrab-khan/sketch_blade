import { Rectangle } from "./rectangle";
import { Ellipse } from "./ellipse";
import { Arrow } from "./arrow";
import { FreeHand } from "./freehand";
import { ShapeText, Text } from "./text";

interface CustomEdgeRadius {
  tension: number;
  cornerRadius: number;
}

export type Shape = Arrow | Ellipse | Rectangle | FreeHand | Text;
export type ArrowSupportedShapes = Rectangle | Ellipse;
export type Texts = Text | ShapeText;

export type UpdateShape = Shape & {
  customEdgeRadius?: CustomEdgeRadius;
};
