import React from "react";

// Types
import { KonvaEllipse as KonvaEllipseType } from "../../../types/shapes";

// Canvas
import { Ellipse as KonvaEllipse } from "react-konva";

// Utils
import ShapeGroup from "./ShapeGroup";
import ShapeText from "./ShapeText";

const Ellipse: React.FC<KonvaEllipseType> = ({ ...props }) => {
  // const dispatch = useDispatch();
  // const shapes = useSelector((state: RootState) => state.app.shapes);
  // const selectedShapeId = useSelector((state: RootState) => state.app.selectedShapesId);

  // ------------------------------- TRANSFORMER EVENT HANDLER ----------------------------
  // const handleTransformingEnd = (e: KonvaEventObject<MouseEvent>) => {
  //   if (!e?.currentTarget?.attrs) return;

  //   const node = (e.currentTarget as Konva.Transformer).nodes();

  //   const shapeUpdatedValue = getResizeShape(node);
  //   if (!shapeUpdatedValue) return;

  //   dispatch(updateExistingShapes(shapeUpdatedValue));
  // };

  // const handleDragMove = (e: KonvaEventObject<MouseEvent>) => {
  //   if (!(e.currentTarget instanceof Konva.Transformer)) return;

  //   const transformer = e.currentTarget;
  //   const shapeNode = transformer.nodes()[0];

  //   if (!shapeNode) return;

  //   const { arrowProps, id } = shapeNode.attrs;
  //   const { x, y } = transformer.attrs;

  //   if (!arrowProps || arrowProps?.length === 0) return;
  //   if (x === undefined || y === undefined) return;

  //   const updatedShapes = shapes.map((shape) => (shape._id === id ? { ...shape, x, y } : shape));

  //   // Logic to change the position of the arrow based on movement.
  //   const updatedArrowPosition = updateAttachedArrowPosition(updatedShapes, arrowProps);

  //   if (updatedArrowPosition.length > 0) {
  //     dispatch(updateExistingShapes(updatedArrowPosition));
  //   }
  // };

  // const handleDragEnd = (e: KonvaEventObject<MouseEvent>) => {
  //   if (!e.currentTarget?.attrs) return;
  //   const { id, x, y } = e.currentTarget.attrs as Konva.RectConfig;

  //   dispatch(
  //     updateExistingShapes({
  //       shapeId: id,
  //       shapeValue: {
  //         x,
  //         y,
  //       },
  //     }),
  //   );
  // };

  return (
    <ShapeGroup
      _id={props._id}
      x={props.styleProperties.x}
      y={props.styleProperties.y}
    >
      <KonvaEllipse
        id={props._id}
        name={"shape"}
        {...props.styleProperties}
        x={0}
        y={0}
        radiusX={0}
        radiusY={0}
        lineCap={"square"}
        strokeScaleEnabled={false}
      />

      {/* Render Text */}
      <ShapeText shape={props} shapeId={props._id} />

    </ShapeGroup>
  );
};
export default Ellipse;
