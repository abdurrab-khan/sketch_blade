import { Shape } from "../types/shapes";
import { ToolBarProperties } from "../types/tools/tool";

/**
 * Combine the properties of the selected shapes into a single object.
 * @param attrs {Shape[]}
 * @returns {ToolBarProperties}
 */
export function getCombineShapeProps(ShapeAttrs: Shape[]) {
  const combineProps = ShapeAttrs.reduce(
    (acc: ToolBarProperties, currentValue: Shape) => {
      if (Object.keys(acc).length === 0) {
        return { ...currentValue.customProperties } as ToolBarProperties;
      }

      Object.entries(currentValue.customProperties).forEach(([key, value]) => {
        const propKey = key as keyof ToolBarProperties;

        if (!(propKey in acc)) {
          acc[propKey] = value as ToolBarProperties[typeof propKey];
        } else if (acc[propKey] !== value) {
          acc[propKey] = "NOT_SHAPE" as ToolBarProperties[typeof propKey];
        }
      });

      return acc;
    },
    {} as ToolBarProperties,
  );

  return combineProps;
}
