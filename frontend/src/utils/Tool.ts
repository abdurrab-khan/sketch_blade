import { CombineShapeStyle, Shapes } from "@/types/shapes";

/**
 * Combine the properties of the selected shapes into a single object.
 * @param attrs {Shape[]}
 * @returns {ToolBarProperties}
 */
export function getCombineShapeProps(ShapeAttrs: Shapes[]) {
  const combineProps = ShapeAttrs.reduce((acc: CombineShapeStyle, currentValue: Shapes) => {
    if (Object.keys(acc).length === 0) {
      return { ...currentValue.styleProperties };
    }

    Object.entries(currentValue.styleProperties).forEach(([key, value]) => {
      const propKey = key as keyof CombineShapeStyle;

      if (!(propKey in acc)) {
        acc[propKey] = value;
      } else if (acc[propKey] !== value) {
        acc[propKey] = undefined;
      }
    });

    return acc;
  }, {});

  return combineProps;
}
