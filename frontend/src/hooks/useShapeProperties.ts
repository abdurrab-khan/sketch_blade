import { useSelector } from "react-redux";
import { useMemo } from "react";
import { RootState } from "../redux/store.ts";
import { getShapeProperties } from "../utils/ShapeUtils.ts";
import { CombineShape } from "@/types/shapes/shapes.ts";

const useShapeProperties = (): CombineShape | null => {
  const { toolBarProperties: properties } = useSelector(
    (state: RootState) => state.app,
  );

  const shapeProperties = useMemo(() => {
    if (!properties) return null;

    const allProperties = getShapeProperties(properties);

    return {
      customProperties: properties,
      ...allProperties,
    };
  }, [properties]);

  return shapeProperties;
};

export default useShapeProperties;
