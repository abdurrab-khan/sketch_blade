import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Circle } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { deleteShapes, handleSelectedIds } from "../../../redux/slices/appSlice";
import useMouseValue from "../../../hooks/useMouseValue";
import useShapeEdgeDetector from "../../../hooks/useShapeEdgeDetector";
import { getDeletedShapeProps } from "../../../utils/ShapeUtils";
import { deleteShapesAPI } from "@/services/shape.api";
import { EraserStyle } from "@/types/shapes";

interface IEraser {
  stageRef: React.RefObject<Konva.Stage>
}

const Eraser: React.FC<IEraser> = ({ stageRef }) => {
  const [isPressed, setIsPressed] = useState(false);
  const eraserRef = useRef<Konva.Circle>(null);
  const shapes = useSelector((state: RootState) => state.app.shapes);
  const selectedIds = useSelector((state: RootState) => state.app.selectedShapesId);

  const dispatch = useDispatch();
  const mouseCoordinates = useMouseValue({ stageRef });
  const { proximity } = useShapeEdgeDetector(20, null, isPressed);
  const eraserProperties = useSelector((state: RootState) => state.app.shapeStyles) as EraserStyle;

  useEffect(() => {
    if (!isPressed) return;

    const { isNear, shapeId } = proximity;

    // Return -- If isNear or shapeId is not there
    if (!isNear || !shapeId) return;

    // Return -- If in the selectedIds has already that shapeId.
    if (Array.isArray(selectedIds?._id) && selectedIds?._id.some((s) => s === shapeId)) return;

    let shapeIds: string[];
    if (!Array.isArray(selectedIds?._id)) {
      shapeIds = [shapeId];
    } else {
      shapeIds = [...selectedIds._id, shapeId];
    }

    dispatch(
      handleSelectedIds({
        _id: shapeIds as string[],
        purpose: "FOR_DELETING",
      }),
    );
  }, [proximity, selectedIds, isPressed, dispatch]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!e.target) return;

      if ((e.target as HTMLElement).tagName === "CANVAS") {
        setIsPressed(true);
      }
    };

    const handleMouseUp = () => {
      if (!selectedIds?._id || !(Array.isArray(selectedIds?._id) && selectedIds?._id.length > 0))
        return;

      const deletedShapeProps = getDeletedShapeProps(selectedIds?._id, shapes);

      dispatch(deleteShapes(deletedShapeProps));

      deleteShapesAPI(selectedIds._id);
      setIsPressed(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [stageRef, isPressed, selectedIds, dispatch, shapes]);

  return (
    <Circle
      ref={eraserRef}
      radius={eraserProperties.radius}
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
