import { useSelector } from "react-redux";
import { useMemo } from "react";
import { RootState } from "../redux/store.ts";
import { Shape } from "../types/shapes/shape-union.ts";
import { getShapeProperties } from "../utils/ShapeUtils.ts";

const useShapeProperties = (): Shape | null => {
  const { toolBarProperties: properties } = useSelector(
    (state: RootState) => state.app,
  );

  const shapeProperties = useMemo(() => {
    if (!properties) return null;

    const allProperties = getShapeProperties(properties);

    return {
      isAddable: false,
      customProperties: properties,
      ...allProperties,
    } as Shape;
  }, [properties]);

  return shapeProperties;
};
export default useShapeProperties;
