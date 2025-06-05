import { ArrowProps } from ".";
import { ToolType } from "./tools/tool";
import { ArrowPosition } from "./shapes";

// declare module "konva/lib/Node" {
//   interface NodeConfig {
//     type: ToolType;
//     arrowProps?: ArrowProps[];
//     attachedShape?: {
//       [key in ArrowPosition]: string;
//     };
//   }
// }

declare module "konva/lib/shapes/Rect" {
  interface RectConfig {
    arrowProps?: ArrowProps[];
  }
}

declare module "konva/lib/shapes/Ellipse" {
  interface EllipseConfig {
    arrowProps?: ArrowProps[];
  }
}

declare module "konva/lib/shapes/Arrow" {
  interface ArrowConfig {
    attachedShape?: {
      [key in ArrowPosition]: string;
    };
  }
}
