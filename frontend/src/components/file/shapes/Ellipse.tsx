import React, { useEffect, useRef } from "react";

// Types
import { Shape } from "../../../types/shapes";

// Redux
import { RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { updateExistingShapes } from "../../../redux/slices/appSlice";

// Canvas
import Konva from "konva";
import Transformer from "../canvas/Transformer";
import { Ellipse as KonvaEllipse } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

// Utils
import { updateAttachedArrowPosition } from "../../../utils/ShapeUtils";
import { getResizeShape } from "@/utils/Helper";
import ShapeGroup from "./ShapeGroup";
import { ToolType } from "@/types/tools/tool";

const Ellipse: React.FC<Shape> = ({ ...props }) => {
  const dispatch = useDispatch();
  const shapes = useSelector((state: RootState) => state.app.shapes)
  const selectedShapes = useSelector((state: RootState) => state.app.selectedShapesId)

  const trRef = useRef<Konva.Transformer>(null)

  // ------------------------------- TRANSFORMER EVENT HANDLER ----------------------------
  const handleTransformingEnd = (e: KonvaEventObject<MouseEvent>) => {
    if (!(e?.currentTarget?.attrs)) return;

    const node = (e.currentTarget as Konva.Transformer).nodes()

    const shapeUpdatedValue = getResizeShape(node);
    if (!shapeUpdatedValue) return;

    dispatch(
      updateExistingShapes(shapeUpdatedValue)
    )
  }

  const handleDragMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!(e.currentTarget instanceof Konva.Transformer)) return;

    const transformer = e.currentTarget;
    const shapeNode = transformer.nodes()[0];

    if (!shapeNode) return;

    const { arrowProps, id } = shapeNode.attrs;
    const { x, y } = transformer.attrs;

    if (!arrowProps || arrowProps?.length === 0) return;
    if (x === undefined || y === undefined) return;

    const updatedShapes = shapes.map(shape =>
      shape._id === id ? { ...shape, x, y } : shape
    );

    // Logic to change the position of the arrow based on movement.
    const updatedArrowPosition = updateAttachedArrowPosition(updatedShapes, arrowProps);

    if (updatedArrowPosition.length > 0) {
      dispatch(updateExistingShapes(updatedArrowPosition))
    }
  }

  const handleDragEnd = (e: KonvaEventObject<MouseEvent>) => {
    if (!e.currentTarget?.attrs) return;
    const { id, x, y } = e.currentTarget.attrs as Konva.RectConfig;

    dispatch(
      updateExistingShapes(
        {
          shapeId: id,
          shapeValue: {
            x, y
          }
        }
      )
    )
  }


  useEffect(() => {
    const tr = trRef?.current;
    if (!tr || trRef.current?.nodes().length === 0) return;

    if (Array.isArray(selectedShapes?._id) || selectedShapes?._id !== props._id) {
      tr.nodes([])
    }

    return () => {
      tr.nodes([])
    }
  }, [props._id, selectedShapes])

  return <>
    <ShapeGroup trRef={trRef} _id={props._id} type={ToolType.Ellipse}>
      <KonvaEllipse
        id={props._id}
        name={"shape"}
        lineCap={"square"}
        strokeScaleEnabled={false}
        {...props}
      />
    </ShapeGroup>
    <Transformer
      ref={trRef}
      handleTransformingEnd={handleTransformingEnd}
      handleDragMove={handleDragMove}
      handleDragEnd={handleDragEnd}
    />
  </>;
};
export default Ellipse;
