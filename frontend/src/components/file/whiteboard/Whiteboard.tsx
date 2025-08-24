import { useEffect, useRef } from "react";
import Konva from "konva";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Stage } from "./Stage";
import Eraser from "../shapes/Eraser";
import { setShapes } from "../../../redux/slices/appSlice";
import { getAllShapes } from "@/services/shape.api";
import TextHandler from "./TextHandler";

function Whiteboard() {
  const stageRef = useRef<Konva.Stage>(null)
  const transformerRef = useRef<Konva.Transformer>(null)

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
    <div className="fixed right-1/2 top-0 z-2 size-full translate-x-1/2">
      <Stage
        stageRef={stageRef}
        transformerRef={transformerRef}
      >
        {activeTool === "eraser" && <Eraser stageRef={stageRef} />}
      </Stage>
      <TextHandler stageRef={stageRef} trRef={transformerRef} />
    </div>
  );
}

export default Whiteboard;
