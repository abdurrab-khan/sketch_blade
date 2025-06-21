import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";

import { ToolType } from "../types/tools/tool";
import { Arrow, Shape } from "../types/shapes";
import { Coordinates, FourCoordinates } from "../types";

import { RootState } from "../redux/store";
import {
  setShapes,
  changeActiveTool,
  handleSelectedIds,
  updateExistingShapes,
  changeToolBarProperties,
  setSelectedShapeToAddArrow,
} from "../redux/slices/appSlice";

import useShapeProperties from "./useShapeProperties";
import useShapeEdgeDetector from "./useShapeEdgeDetector";

import { ToolBarArr } from "../lib/constant";

import { checkRefValue } from "../utils/AppUtils";
import { getUpdatedPropsToAddArrow, recalculatesShapeDimensions } from "../utils/ShapeUtils";
import { getTransformedPos } from "@/utils/Helper";

import { v4 as uuid } from "uuid"
import { insertNewShape } from "@/services/shape.api";

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
  selectionRectRef,
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

  // <----------------------------> HELPER FUNCTION <------------------------------>
  const clearSelection = useCallback(() => {
    if (isDragging.current || isTransforming.current || !transformerRef.current)
      return;

    const tr = transformerRef.current;

    tr.nodes([]);
    dispatch(handleSelectedIds(null));
    dispatch(changeToolBarProperties(null));
  }, [dispatch, isDragging, isTransforming, transformerRef]);

  const createNewShape = useCallback(
    (customizedCurrentShape?: Shape) => {
      if (currentShape?.isAddable) {
        dispatch(setShapes(customizedCurrentShape ?? currentShape));

        if (!isToolLocked) {
          dispatch(
            changeActiveTool({
              type: ToolType.Cursor,
            }),
          );
        }
      }

      insertNewShape(customizedCurrentShape ?? currentShape)

      setIsDrawing(false);
      setCurrentShape(null);
      setStartingMousePos({ x: 0, y: 0 });
    },
    [currentShape, dispatch, isToolLocked, setCurrentShape],
  );

  const handleCursorToolMouseDown = (e: KonvaEventObject<MouseEvent>, tr: Konva.Transformer, selectionRect: Konva.Rect, metaPressed: boolean) => {
    const isNodesTheir = tr.nodes().length > 0;

    if (e.target.getType() === "Stage") {
      selectionRect.width(0);
      selectionRect.height(0);
      selectionRect?.visible(true);
      setIsSelecting(true);

      if (isNodesTheir || !metaPressed) {
        clearSelection();
      }
    } else if (e.target.hasName("shape")) {
      const isSelected = tr.nodes().indexOf(e.target) >= 0;

      // Only works --- Already have selectedShapesId and meta-pressed
      if (!(metaPressed && selectedShapesId)) return;

      if (selectedShapesId?._id && !Array.isArray(selectedShapesId?._id)) {
        const node = stageRef.current?.findOne(`#${selectedShapesId._id}`);

        if (node) {
          tr.nodes([node]);
        }
      }

      if (isSelected) {
        const nodes = tr.nodes().slice();
        nodes.splice(nodes.indexOf(e.target), 1);

        tr.nodes(nodes);
      } else if (!isSelected) {
        const nodes = tr.nodes().slice();
        nodes.push(e.target)

        tr.nodes(nodes);
      }

      if (Array.isArray(tr.nodes()) && tr.nodes().length > 0) {
        const nodesAttr = tr.nodes().map((shape) => shape.attrs);
        const ids = nodesAttr.map((attr) => attr.id);

        dispatch(changeToolBarProperties(nodesAttr));
        dispatch(handleSelectedIds({ _id: ids, purpose: "FOR_EDITING" }));
      }
    }

  }

  const handleShapeToolMouseDown = (transformedPos: Coordinates) => {
    const newShapeToCreate = {
      _id: uuid(),
      ...newShapeProperties
    };

    if (activeTool === "point arrow" || activeTool === "free hand") {
      if (activeTool === "point arrow") {
        newShapeToCreate["isDrawingArrow"] = true
      }

      newShapeToCreate["points"] = [
        ...Object.values(transformedPos),
      ];
    } else {
      newShapeToCreate["x"] = transformedPos.x;
      newShapeToCreate["y"] = transformedPos.y;
    }

    setCurrentShape(newShapeToCreate);
  }

  const handleShapeAttachment = (transformedPos?: Coordinates) => {
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

  }

  // Toggle the hovered state of the shape
  // This function toggles the hovered state of the shape based on the mouse event.
  const toggleHoveredState = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target.hasName("shape") && activeTool === "cursor") {
      setIsHovered(true);
    } else if (!e.target.hasName("shape") && isHovered) {
      setIsHovered(false);
    }
  }

  // Handle the selection rectangle
  // This function handles the selection rectangle based on the mouse position.
  const handleSelectionRect = (selectionRect: Konva.Rect, transformedPos: Coordinates) => {
    selectionRect.setAttrs({
      visible: true,
      x: Math.min(startingMousePos.x, transformedPos.x),
      y: Math.min(startingMousePos.y, transformedPos.y),
      width: Math.abs(transformedPos.x - startingMousePos.x),
      height: Math.abs(transformedPos.y - startingMousePos.y),
    });
  }

  // Handle selected shape based on the selection rectangle.
  // This function handles the selected shape based on the selection rectangle.
  const handleSelectedShape = useCallback((stage: Konva.Stage, selectionRect: Konva.Rect, tr: Konva.Transformer) => {
    const shapes = stage.find(".shape");
    const box = selectionRect.getClientRect();
    const selected = shapes.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect()),
    );

    if (
      selected.length > 0 &&
      selected.length !== selectedShapesId?._id.length
    ) {
      /* In here we add and remove the selected nodes */
      const ids = selected.map((shape) => shape.attrs.id);
      const selectedShapes = selected.map((items) => items.attrs);

      // Add Selection Shape -- Global Transformer
      tr.nodes(selected);

      dispatch(handleSelectedIds({ _id: ids, purpose: "FOR_EDITING" }));
      dispatch(changeToolBarProperties(selectedShapes));
    } else if (selected.length === 0) {
      tr.nodes([]);
      dispatch(handleSelectedIds(null));
      dispatch(changeToolBarProperties(null));
    }
  }, [dispatch, selectedShapesId])

  // <---------------------------> Mouse event handler <--------------------------->

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>): void => {
      e.evt.preventDefault();

      const allRef = checkRefValue(stageRef, selectionRectRef, transformerRef) as [Konva.Stage, Konva.Rect, Konva.Transformer] | null;
      if (!allRef) return;

      const [stage, selectionRectangle, tr] = allRef;
      if (![...ToolBarArr, "cursor"].includes(activeTool)) return;

      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const transformedPos = getTransformedPos(stage);
      if (!transformedPos) return;

      // Initializing Starting MousePos
      setStartingMousePos({
        x: transformedPos.x,
        y: transformedPos.y,
      });

      if (activeTool === ToolType.Cursor) {
        // Handle Selection
        if (!isSelecting) {
          handleCursorToolMouseDown(e, tr, selectionRectangle, metaPressed)
        }
      } else if (ToolBarArr.includes(activeTool)) {
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
    [isDrawing, isSelecting, newShapeProperties, selectedShapesId, activeTool, dispatch, currentShape, setCurrentShape, setIsDrawing, setStartingMousePos],
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


        if (isSelecting) {
          selectionRectRef?.current?.visible(false);
          setIsSelecting(false);
        }
      } else if (ToolBarArr.includes(activeTool)) {
        if (!isDrawing) {
          // 
        } else {
          if (!currentShape) return;

          if (activeTool === ToolType.PointArrow) {
            if ((currentShape as Arrow).points.length < 3 ||
              !(currentShape as Arrow).isDrawingArrow) {
              if ((currentShape as Arrow).isDrawingArrow) {
                setCurrentShape(
                  (prev) => ({
                    ...prev,
                    isDrawingArrow: false,
                  }) as Arrow
                );
              }
            }
            handleShapeAttachment()
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

      const allRefs = checkRefValue(selectionRectRef, stageRef, transformerRef) as [Konva.Rect, Konva.Stage, Konva.Transformer] | null
      if (!allRefs) return;

      const [selectionRectangle, stage, tr] = allRefs

      if (!isDrawing && !isSelecting) {
        toggleHoveredState(e);
      }

      const transformedPos = getTransformedPos(stage);
      if (!transformedPos) return;

      if (activeTool === ToolType.Cursor) {
        if (isSelecting) {
          // Handle the coordinates of selection rectangle
          handleSelectionRect(selectionRectangle, transformedPos)

          // Handle selected shape based on selection rect interaction.
          handleSelectedShape(stage, selectionRectangle, tr)
        }
      } else if (ToolBarArr.includes(activeTool) && currentShape) {
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
    [selectionRectRef, stageRef, transformerRef, isDrawing, isSelecting, activeTool, currentShape, toggleHoveredState, isDragging, isTransforming, startingMousePos, setCurrentShape]);

  useEffect(() => {
    if (!isDrawing || activeTool !== "point arrow") return;

    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === "Delete") {
        if (e.key === "Enter") {
          const points = (currentShape as Arrow)?.points || [];
          const slicedPoints = points?.slice(0, points?.length - 2);

          if (currentShape?.isAddable) {
            const updatedShape = {
              ...currentShape,
              points: slicedPoints,
            };

            console.log(updatedShape)

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
  }, [isDrawing, setCurrentShape, dispatch, currentShape, activeTool]);

  useEffect(() => {
    const handleshapedelete = (e: KeyboardEvent) => {
      if (
        (selectedShapesId && selectedShapesId?._id.length <= 0) ||
        e.key !== "Delete"
      )
        return;
      const tr = transformerRef.current;

      tr?.nodes([]);
      dispatch(handleSelectedIds(null));
      dispatch(changeToolBarProperties(null));
    };

    document.addEventListener("keydown", handleshapedelete);

    return () => {
      document.removeEventListener("keydown", handleshapedelete);
    };
  }, [dispatch, selectedShapesId, transformerRef]);

  useEffect(() => {
    if (activeTool !== "point arrow") return;

    if (!selectedShapeToAddArrow) {
      const { isNear, shapeId, arrowProps } = proximity;
      if (!isNear || !arrowProps) return;

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