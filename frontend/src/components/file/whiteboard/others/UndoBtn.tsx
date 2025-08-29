import { Redo2, Undo2 } from "lucide-react";

const UndoBtn = () => {
  return (
    <div
      className={
        "flex h-2/3 items-center justify-center gap-x-6 rounded-md bg-secondary p-2 text-xs"
      }
    >
      <div className={"transition-all hover:text-gray-400"}>
        <Redo2 />
      </div>
      <div className={"transition-all hover:text-gray-400"}>
        <Undo2 />
      </div>
    </div>
  );
};
export default UndoBtn;
