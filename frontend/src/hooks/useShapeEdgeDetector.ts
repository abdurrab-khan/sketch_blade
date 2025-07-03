import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";

import { Proximity } from "../types";
import { Shape } from "../types/shapes";
import { detectShapeEdgeProximity } from "@/utils/Helper";
import Konva from "konva";

interface LastUpdateRef {
  shapeId: string | null;
  isNear: boolean;
}

const useShapeEdgeDetector = (
  threshold = 10,
  currentShape: Shape | null,
  isPressed?: boolean,
) => {
  const [proximity, setProximity] = useState<Proximity>({
    shapeId: null,
    isNear: false,
    arrowProps: null,
  });
  const lastUpdateRef = useRef<LastUpdateRef>({
    shapeId: null,
    isNear: false,
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shapes = useSelector((state: RootState) => state.app.shapes);
  const {
    activeTool: { type: activeTool },
  } = useSelector((state: RootState) => state.app);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isPressed && activeTool === "eraser") {
        return;
      }

      if (timeoutRef.current) {
        return;
      }

      const { clientX, clientY } = event;

      const result = detectShapeEdgeProximity(
        clientX,
        clientY,
        shapes,
        threshold,
        activeTool,
        currentShape,
      );

      const statusChanged =
        result.isNear !== lastUpdateRef.current.isNear ||
        result.shapeId !== lastUpdateRef.current.shapeId;

      if (statusChanged) {
        setProximity(result);
        lastUpdateRef.current = result;
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
      }, 100);
    },
    [activeTool, currentShape, isPressed, shapes, threshold],
  );

  useEffect(() => {
    if (!(activeTool === "point arrow" || activeTool === "eraser")) {
      return;
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [activeTool, handleMouseMove]);

  return { proximity, setProximity };
};

export default useShapeEdgeDetector;
