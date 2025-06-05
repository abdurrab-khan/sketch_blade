import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Rect } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  deleteShapes,
  handleSelectedIds,
} from "../../../redux/slices/appSlice";
import useMouseValue from "../../../hooks/useMouseValue";
import useShapeEdgeDetector from "../../../hooks/useShapeEdgeDetector";
import { getDeletedShapeProps } from "../../../utils/ShapeUtils";

type MouseValue = {
  stageRef: React.RefObject<Konva.Stage>;
};

const Eraser: React.FC<MouseValue> = ({ stageRef }) => {
  const [isPressed, setIsPressed] = useState(false);
  const eraserRef = useRef<Konva.Rect>(null);
  const selectedIds = useSelector(
    (state: RootState) => state.app.selectedShapesId,
  );
  const shapes = useSelector((state: RootState) => state.app.shapes)

  const dispatch = useDispatch();
  const eraserProperties = useSelector(
    (state: RootState) => state.app.toolBarProperties?.eraserRadius,
  );
  const mouseCoordinates = useMouseValue({ stageRef });
  const { proximity } = useShapeEdgeDetector(10, null)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!e.target) return;

      if ((e.target as HTMLElement).tagName === "CANVAS") {
        setIsPressed(true);
      }
    };

    const handleMouseUp = () => {
      if (selectedIds && Array.isArray(selectedIds)) {
        const deletedShapeProps = getDeletedShapeProps(selectedIds, shapes);
        dispatch(deleteShapes(
          deletedShapeProps
        ));
      }

      setIsPressed(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [stageRef, isPressed, selectedIds, dispatch, shapes]);

  useEffect(() => {
    if (!isPressed) return;

    const { isNear, shapeId } = proximity;
    if (!isNear || !shapeId) return;

    // Checking Is shape already exist if yes,
    // We does not insert again.
    if (Array.isArray(selectedIds) && selectedIds.some((s) => s._id === shapeId)) return;

    dispatch(
      handleSelectedIds({
        _id: shapeId,
        purpose: "FOR_DELETING"
      })
    );
  }, [proximity, selectedIds, isPressed, dispatch])

  return (
    <Rect
      ref={eraserRef}
      height={eraserProperties}
      width={eraserProperties}
      fill={"#0a1f2c"}
      stroke={"#3282B8"}
      strokeWidth={1}
      cornerRadius={999}
      name="eraser"
      {...mouseCoordinates}
    />
  );
};

export default Eraser;
