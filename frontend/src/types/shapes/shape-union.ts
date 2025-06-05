import { Rectangle } from "./rectangle";
import { Ellipse } from "./ellipse";
import { Arrow } from "./arrow";
import { FreeHand } from "./freehand";
import { Text } from "./text";

export type Shape = Arrow | Ellipse | Rectangle | FreeHand | Text;
export type ArrowSupportedShapes = Rectangle | Ellipse;
