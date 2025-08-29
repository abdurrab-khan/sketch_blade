import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { RootState } from "@/redux/store";
import { KonvaEventObject } from "konva/lib/Node";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Arrow, Shapes, Ellipse, Rectangle } from "@/types/shapes";
import { GetDynamicShape } from "./others/const";
import useShapeProperties from "@/hooks/useShapeProperties";
import { Coordinates, FourCoordinates } from "@/types";
import { getTransformedPos } from "@/utils/Helper";
import {
  getUpdatedPropsToAddArrow,
  isShapeAddable,
  recalculatesShapeDimensions,
} from "@/utils/ShapeUtils";
import useShapeEdgeDetector from "@/hooks/useShapeEdgeDetector";
import { changeActiveTool, handleSelectedIds, setSelectedShapeToAddArrow, setShapes, updateExistingShapes } from "@/redux/slices/appSlice";

interface ShapeCreatorProps {
  stageRef: React.RefObject<Konva.Stage>;
}

const ShapeCreator: React.FC<ShapeCreatorProps> = ({ stageRef }) => {
  const [currentShape, setCurrentShape] = useState<Shapes | null>(null);

  const isDrawingArrow = useRef<boolean>(true);
  const mouseStartPos = useRef<{ x: number; y: number } | null>(null);

  const dispatch = useDispatch();
  const {
    activeTool: { type: activeTool, isLocked },
    selectedShapeToAddArrow,
    shapes,
  } = useSelector((state: RootState) => state.app);
  const newShapeProps = useShapeProperties();
  const { proximity } = useShapeEdgeDetector(10, currentShape);

  // <===================> Helper functions <========================>
  const createNewShape = useCallback(
    (shapeBase: Shapes, transformedPos: Coordinates) => {
      if (shapeBase.type === "arrow" || shapeBase.type === "free hand") {
        shapeBase["styleProperties"]["points"] = [...Object.values(transformedPos)];
      } else {
        (shapeBase as Rectangle | Ellipse)["styleProperties"]["x"] = transformedPos.x;
        (shapeBase as Rectangle | Ellipse)["styleProperties"]["y"] = transformedPos.y;
      }

      setCurrentShape(shapeBase);
    },
    [],
  );

  const insertNewShape = useCallback(
    (currentShape: Shapes) => {
      if (isShapeAddable(currentShape)) {
        dispatch(setShapes(currentShape));

        if (!isLocked) {
          dispatch(
            changeActiveTool({
              type: "cursor",
            }),
          );
        }

        // insertNewShape(customizedCurrentShape ?? { ...currentShape })
      }

      setCurrentShape(null);
      mouseStartPos.current = null;
    },
    [dispatch, isLocked],
  );

  const handleShapeAttachment = useCallback(() => {
    if (!selectedShapeToAddArrow?._id) return;

    const arrowAndShapeValue = getUpdatedPropsToAddArrow(
      shapes,
      selectedShapeToAddArrow,
      currentShape as Arrow,
    );

    if (arrowAndShapeValue) {
      dispatch(
        updateExistingShapes({
          shapeValue: {
            arrowProps: arrowAndShapeValue.arrowProps,
          },
          shapeId: selectedShapeToAddArrow?._id,
        }),
      );

      setCurrentShape(
        (prev) =>
          ({
            ...prev,
            attachedShape: arrowAndShapeValue?.attachedShape,
          }) as Shapes,
      );

      dispatch(handleSelectedIds(null));
    }
  }, [currentShape, dispatch, selectedShapeToAddArrow, shapes]);

  // <===================> Handle Mouse Events <========================>
  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent, Stage>) => {
      e.evt.preventDefault();

      const stage = e.target.getStage();
      const newShapeBase = newShapeProps;

      if (newShapeBase === null) return; // Return if newShapeBase is null.

      if (stage) {
        const transformedPos = getTransformedPos(stage);
        if (!transformedPos) return;

        // Initializing String MousePos
        mouseStartPos.current = {
          x: transformedPos.x,
          y: transformedPos.y,
        };

        if (!currentShape) {
          createNewShape(newShapeBase, transformedPos); // Drawing a new Shape.
        } else {
          if (currentShape.type === "arrow") {
            handleShapeAttachment();
            (currentShape as Arrow)?.styleProperties.points?.push(
              transformedPos.x,
              transformedPos.y,
            );
          }
        }
      }
    },
    [createNewShape, currentShape, handleShapeAttachment, newShapeProps],
  );

  const handleMouseUp = useCallback(
    (e: KonvaEventObject<MouseEvent, Stage>) => {
      e.evt.preventDefault();

      if (currentShape === null) return; // Return if there is not shape
      const shapeType = currentShape.type;

      const drawingArrow = shapeType === "arrow" && isDrawingArrow && currentShape.styleProperties.points.length === 2;

      if (drawingArrow) {
        isDrawingArrow.current = false;
      } else {
        insertNewShape(currentShape);
      }
    },
    [insertNewShape, currentShape],
  );

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent, Stage>) => {
      e.evt.preventDefault();

      const stage = e.target.getStage();
      if (!stage || currentShape === null) return;

      const shapeType = currentShape.type;

      const transformedPos = getTransformedPos(stage);
      if (!transformedPos) return;

      const updatedCoordinates = {
        ...mouseStartPos.current,
        x2: transformedPos.x,
        y2: transformedPos.y,
      } as unknown as FourCoordinates;

      const updatedShapeValue = recalculatesShapeDimensions(
        shapeType,
        updatedCoordinates,
        currentShape,
      );

      setCurrentShape(updatedShapeValue);
    }
    , [currentShape],
  );

  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage) return;

    // Attach event listeners to the document
    stage.on("mousedown", handleMouseDown);
    stage.on("mouseup", handleMouseUp);
    stage.on("mousemove", handleMouseMove);

    return () => {
      // Cleanup event listeners on component getting unmount
      stage.off("mousemove", handleMouseMove);
      stage.off("mousedown", handleMouseDown);
      stage.off("mouseup", handleMouseUp);
    };
  }, [stageRef, handleMouseDown, handleMouseUp, handleMouseMove]);

  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === "Delete") {
        if (e.key === "Enter" && currentShape?.type === "arrow") {
          const points = (currentShape as Arrow)["styleProperties"]["points"] || [];
          const slicedPoints = points.slice(0, points?.length - 2);

          if (slicedPoints.length >= 4) {
            const updatedShape = {
              ...currentShape,
              points: slicedPoints,
              isDrawing: false,
            };

            // addShape is missing, either define it or import it
            insertNewShape(updatedShape);
            return;
          }
        }

        setCurrentShape(null);
      }
    };

    document.addEventListener("keydown", handleKeyboardEvent);

    return () => {
      document.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [createNewShape, currentShape, insertNewShape]);

  useEffect(() => {
    if (activeTool !== "arrow") return;

    const { isNear, shapeId, arrowProps } = proximity;
    if (isNear) {
      if (!arrowProps || selectedShapeToAddArrow?._id === shapeId) return;
      dispatch(
        setSelectedShapeToAddArrow({
          _id: shapeId as string,
          x: arrowProps.x,
          y: arrowProps.y,
          arrowPosition: arrowProps?.arrowPosition,
          arrowDirection: arrowProps?.arrowDirection,
        }),
      );
    } else {
      dispatch(setSelectedShapeToAddArrow(null));
    }
  }, [activeTool, dispatch, proximity, selectedShapeToAddArrow?._id]);

  return currentShape ? <GetDynamicShape {...currentShape} /> : null;
};

export default ShapeCreator;
