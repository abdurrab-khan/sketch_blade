import { Rectangle } from "./rectangle";
import { Ellipse } from "./ellipse";
import { Arrow } from "./arrow";
import { FreeHand } from "./freehand";
import { Text } from "./text";

// customEdgeRadius: {
//     "tension": 0.15,
//     "cornerRadius": 32
// }

interface CustomEdgeRadius {
  tension: number;
  cornerRadius: number;
}

export type Shape = Arrow | Ellipse | Rectangle | FreeHand | Text;
export type ArrowSupportedShapes = Rectangle | Ellipse;

export type UpdateShape = Shape & {
  customEdgeRadius?: CustomEdgeRadius;
};
