import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";

import { ToolType } from "../types/tools/tool";
import { Arrow, Ellipse, Rectangle, Shape } from "../types/shapes";
import { Coordinates, FourCoordinates } from "../types";

import { RootState } from "../redux/store";
import {
  setShapes,
  changeActiveTool,
  handleSelectedIds,
  updateExistingShapes,
  changeToolBarProperties,
  setSelectedShapeToAddArrow,
  deleteShapes,
} from "../redux/slices/appSlice";

import useShapeProperties from "./useShapeProperties";
import useShapeEdgeDetector from "./useShapeEdgeDetector";

import { TOOLBAR_TOOL_TYPES } from "../lib/constant";

import { getDeletedShapeProps, getUpdatedPropsToAddArrow, recalculatesShapeDimensions } from "../utils/ShapeUtils";
import { getTransformedPos } from "@/utils/Helper";

import { v4 as uuid } from "uuid"
import { deleteShapesAPI, insertNewShape } from "@/services/shape.api";

interface StageHandlerProps {
  currentShape: Shape | null;
  setCurrentShape: React.Dispatch<React.SetStateAction<Shape | null>>;
  isHovered: boolean;
  setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
  selectionRectRef: React.RefObject<Konva.Rect>;
  stageRef: React.RefObject<Konva.Stage>;
  transformerRef: React.RefObject<Konva.Transformer>;
  isDragging: React.MutableRefObject<boolean>;
  isTransforming: React.MutableRefObject<boolean>;
}

const useStageHandler = ({
  isHovered,
  isDragging,
  isTransforming,
  currentShape,
  setIsHovered,
  setCurrentShape,
  stageRef,
  transformerRef,
}: StageHandlerProps) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [startingMousePos, setStartingMousePos] = useState<Coordinates>({
    x: 0,
    y: 0,
  });

  const { proximity, setProximity } = useShapeEdgeDetector(10, currentShape);
  const { type: activeTool, isLocked: isToolLocked } = useSelector(
    (state: RootState) => state.app.activeTool,
  );
  const newShapeProperties = useShapeProperties();
  const { selectedShapesId, selectedShapeToAddArrow, shapes } = useSelector(
    (state: RootState) => state.app
  );

  const dispatch = useDispatch();

  const createNewShape = useCallback(
    (customizedCurrentShape?: Shape) => {

      if (currentShape?.isAddable) {
        dispatch(setShapes(customizedCurrentShape ?? { ...currentShape, isDrawing: false }));

        if (!isToolLocked) {
          dispatch(
            changeActiveTool({
              type: ToolType.Cursor,
            }),
          );
        }

        insertNewShape(customizedCurrentShape ?? { ...currentShape, isDrawing: false })
      }

      setIsDrawing(false);
      setCurrentShape(null);
      setStartingMousePos({ x: 0, y: 0 });
    },
    [currentShape, dispatch, isToolLocked, setCurrentShape],
  );

  const handleShapeToolMouseDown = useCallback((transformedPos: Coordinates) => {
    const newShapeToCreate = {
      _id: uuid(),
      isDrawing: true,
      ...newShapeProperties
    };

    if (activeTool === "point arrow" || activeTool === "free hand") {
      if (activeTool === "point arrow") {
        ((newShapeToCreate as Arrow)["isDrawingArrow"]) = true
      }

      ((newShapeToCreate as Arrow)["points"]) = [
        ...Object.values(transformedPos),
      ];
    } else {
      ((newShapeToCreate as Rectangle | Ellipse)["x"]) = transformedPos.x;
      ((newShapeToCreate as Rectangle | Ellipse)["y"]) = transformedPos.y;
    }

    setCurrentShape(newShapeToCreate as Shape);
  }, [activeTool, newShapeProperties, setCurrentShape])

  const handleShapeAttachment = useCallback((transformedPos?: Coordinates) => {
    const shape = currentShape ?? {
      ...newShapeProperties,
      ...Object.values(transformedPos!)
    } as Shape

    const arrowAndShapeValue = getUpdatedPropsToAddArrow(
      shapes,
      selectedShapeToAddArrow,
      (shape) as Arrow
    );

    if (arrowAndShapeValue) {
      dispatch(
        updateExistingShapes({
          shapeValue: {
            arrowProps: arrowAndShapeValue.arrowProps,
          },
          shapeId: selectedShapeToAddArrow?._id,
        })
      );

      setCurrentShape(
        (prev) => ({
          ...prev,
          attachedShape: arrowAndShapeValue?.attachedShape,
        }) as Shape
      );

      dispatch(handleSelectedIds(null));
    }

  }, [currentShape, dispatch, newShapeProperties, selectedShapeToAddArrow, setCurrentShape, shapes])

  // Toggle the hovered state of the shape
  // This function toggles the hovered state of the shape based on the mouse event.
  const toggleHoveredState = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (e.target.hasName("shape") && activeTool === "cursor") {
      setIsHovered(true);
    } else if (!e.target.hasName("shape") && isHovered) {
      setIsHovered(false);
    }
  }, [activeTool, isHovered, setIsHovered])


  // <===================> Handle Mouse Events <========================>
  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>): void => {
      e.evt.preventDefault();

      const stage = stageRef.current;
      if (!stage) return;

      if (![...TOOLBAR_TOOL_TYPES, "cursor"].includes(activeTool)) return;

      const transformedPos = getTransformedPos(stage);
      if (!transformedPos) return;

      // Initializing Starting MousePos
      setStartingMousePos({
        x: transformedPos.x,
        y: transformedPos.y,
      });

      if (TOOLBAR_TOOL_TYPES.includes(activeTool)) {
        // Not isDrawing -- Handle Initialize Shape
        if (!isDrawing) {
          setIsDrawing(true)
          handleShapeToolMouseDown(transformedPos)
        } else {
          // isDrawing -- Add Points to "POINT ARROW"
          if (activeTool === "point arrow") {
            handleShapeAttachment(transformedPos);

            (currentShape as Arrow)?.points?.push(
              ...Object.values(transformedPos)
            );
          }
        }
      }
    },
    [stageRef, activeTool, isDrawing, handleShapeToolMouseDown, handleShapeAttachment, currentShape],
  );

  const handleMouseUp = useCallback(
    (e: KonvaEventObject<MouseEvent>): void => {
      e.evt.preventDefault();

      if (activeTool === ToolType.Cursor) {
        if (!isDrawing) {
          if (isDragging.current || isTransforming.current) {
            isDragging.current = false;
            isTransforming.current = false;
          }
        }
      } else if (TOOLBAR_TOOL_TYPES.includes(activeTool)) {
        if (!isDrawing) {
          // 
        } else {
          if (!currentShape) return;

          if (activeTool === ToolType.PointArrow) {
            handleShapeAttachment()

            const arrow = currentShape as Arrow;

            if (arrow?.isDrawingArrow) {
              // If user click at the start point drawing arrow.
              // We assume -- User want to create pointed arrow.
              // Otherwise -- User want to create arrow.
              if (arrow?.points.length === 2) {
                setCurrentShape(
                  (prev) => ({
                    ...prev,
                    isDrawingArrow: false,
                  }) as Arrow
                );
              } else {
                createNewShape()
              }
            }
          } else {
            createNewShape();
          }
        }
      };

    },
    [isDrawing, currentShape, activeTool, isSelecting, setIsDrawing],
  );

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>): void => {
      e.evt.preventDefault();

      const stage = stageRef?.current;
      if (!stage) return;

      if (!isDrawing && !isSelecting) {
        toggleHoveredState(e);
      }

      const transformedPos = getTransformedPos(stage);
      if (!transformedPos) return;

      if (TOOLBAR_TOOL_TYPES.includes(activeTool) && currentShape) {
        const updatedCoordinates = { ...startingMousePos, x2: transformedPos.x, y2: transformedPos.y } as unknown as FourCoordinates;

        const updatedShapeValue =
          recalculatesShapeDimensions(
            activeTool,
            updatedCoordinates,
            currentShape,
          );
        setCurrentShape(updatedShapeValue);
      }

    },
    [isDrawing, isSelecting, activeTool, currentShape, setCurrentShape, startingMousePos, stageRef, toggleHoveredState]);

  useEffect(() => {
    if (!isDrawing || activeTool !== "point arrow") return;

    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === "Delete") {

        if (e.key === "Enter") {
          const points = (currentShape as Arrow)?.points || [];
          const slicedPoints = points?.slice(0, points?.length - 2);

          if (currentShape?.isAddable && slicedPoints.length >= 4) {
            const updatedShape = {
              ...currentShape,
              points: slicedPoints,
              isDrawing: false
            };

            // addShape is missing, either define it or import it
            createNewShape(updatedShape as Shape);
            return;
          }
        }

        setIsDrawing(false);
        setCurrentShape(null);
      }
    };

    document.addEventListener("keydown", handleKeyboardEvent);

    return () => {
      document.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [isDrawing, setCurrentShape, dispatch, currentShape, activeTool, createNewShape]);

  useEffect(() => {
    const handleshapedelete = (e: KeyboardEvent) => {
      const tr = transformerRef.current;

      // Only work when press delete key
      if (e.key !== "Delete" || !tr) return;

      let ids: string[] | null = null;

      // Update ids and make them array of ids. 
      if (selectedShapesId?._id) {
        ids = Array.isArray(selectedShapesId?._id) ? selectedShapesId._id : [selectedShapesId._id];
      }

      // Delete -- If selected ids are there. 
      if (ids && ids.length > 0) {
        const deletedShapeProps = getDeletedShapeProps(ids, shapes);

        dispatch(deleteShapes(
          deletedShapeProps
        ));

        deleteShapesAPI(ids)

        tr?.nodes([]);
        dispatch(handleSelectedIds(null));
        dispatch(changeToolBarProperties(null));
      };
    };

    document.addEventListener("keydown", handleshapedelete);

    return () => {
      document.removeEventListener("keydown", handleshapedelete);
    };
  }, [dispatch, selectedShapesId, shapes, transformerRef]);

  useEffect(() => {
    if (activeTool !== "point arrow") return;

    const { isNear, shapeId, arrowProps } = proximity;

    if (isNear) {
      if (!arrowProps || selectedShapeToAddArrow?._id === shapeId) return;

      dispatch(
        setSelectedShapeToAddArrow(
          {
            _id: shapeId as string,
            x: arrowProps.x,
            y: arrowProps.y,
            arrowPosition: arrowProps?.arrowPosition,
            arrowDirection: arrowProps?.arrowDirection,
          }
        )
      )
    } else {
      dispatch(setSelectedShapeToAddArrow(null));
    }

  }, [activeTool, dispatch, proximity, selectedShapeToAddArrow, setProximity]);

  return { handleMouseDown, handleMouseMove, handleMouseUp };
};

export default useStageHandler;