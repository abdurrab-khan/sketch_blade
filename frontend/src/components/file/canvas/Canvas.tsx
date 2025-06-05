import { useEffect, useRef } from "react";
import { Rect } from "react-konva";
import Konva from "konva";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getAllShapes } from "../../../lib/action/shape.action";
import { Stage } from "./Stage";
import Eraser from "../shapes/Eraser";
import { setShapes } from "../../../redux/slices/appSlice";

function Canvas() {
  const stageRef = useRef<Konva.Stage>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const selectionRectRef = useRef<Konva.Rect>(null);

  const dispatch = useDispatch();

  const activeTool = useSelector(
    (state: RootState) => state.app.activeTool.type,
  );

  useEffect(() => {
    const allShapes = getAllShapes();

    if (Array.isArray(allShapes) && allShapes.length > 0) {
      dispatch(setShapes(allShapes));
    }
  }, [dispatch]);

  // TODO : SO I WANT TO USE INDEX DB WHEN THE USE DOES NOT LOGGED IN AND WHEN USER FINALLY WANT TO LOGGED IN AND MAKE SOME FILE THEN WE CAN SHOW ALL THE ELEMENTS WHICH USER MAKE WHEN THEY DOES NOT LOGGED IN. WE SHOW POP UP AND SAY IT DO YOU WANT TO MERGE IT. IF YES CAN WE CAN MERGE PREVIOUS ONE DATA.

  return (
    <div className={"relative size-full flex-1"}>
      <div className="fixed right-1/2 top-0 z-20 size-full translate-x-1/2">
        <Stage
          stageRef={stageRef}
          selectionRectRef={selectionRectRef}
          transformerRef={transformerRef}
        >
          <Rect
            ref={selectionRectRef}
            fill={"rgba(147,146,146,0.22)"}
            stroke={"#bdbcf4"}
            strokeWidth={1}
            visible={false}
            listening={false}
          />
          {activeTool === "eraser" && <Eraser stageRef={stageRef} />}
        </Stage>
      </div>
    </div>
  );
}

export default Canvas;
