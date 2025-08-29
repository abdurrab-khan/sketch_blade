import { useEffect } from "react";
import { IoMdLock } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { changeActiveTool, handleSelectedIds } from "../../../redux/slices/appSlice";
import { ToolIcons } from "./constants";
import { AnimatePresence, motion } from "motion/react";
import { ToolType } from "../../../types/tools/tool";
import { cn } from "../../../lib/utils";

const Tools = () => {
  const activeTool = useSelector((state: RootState) => state.app.activeTool);
  const selectedId = useSelector((state: RootState) => state.app.selectedShapesId);
  const dispatch = useDispatch();

  const handleToolLock = () => {
    dispatch(
      changeActiveTool({
        isLocked: !activeTool.isLocked,
      }),
    );
  };

  const handleToolBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Handle single click interaction.
    if (event.detail === 1) {
      if (selectedId && selectedId?._id.length > 0) {
        dispatch(handleSelectedIds(null));
      }

      const toolName = event.currentTarget.getAttribute("tool-name") as ToolType;
      if (!toolName) return;

      dispatch(
        changeActiveTool({
          type: toolName,
        }),
      );
    } else if (event.detail === 2) {
      // Handle double click interaction.
      handleToolLock();
    }
  };

  useEffect(() => {
    const clickNumericalBtn = (e: globalThis.KeyboardEvent) => {
      if (!e.code.startsWith("Digit") && !e.code.startsWith("Numpad")) return;

      const num = Number(e.key);
      if (num <= 0) return;

      const toolBar = Object.keys(ToolIcons)[num - 1] as ToolType;
      if (toolBar === activeTool.type) return;

      dispatch(
        changeActiveTool({
          type: toolBar,
        }),
      );

      if (selectedId && selectedId?._id.length > 0) {
        dispatch(handleSelectedIds(null));
      }
    };

    document.addEventListener("keypress", clickNumericalBtn);

    return () => {
      document.removeEventListener("keypress", clickNumericalBtn);
    };
  }, [dispatch, activeTool, selectedId]);

  return (
    <div
      className={
        "flex-center h-12 gap-2 rounded-md border border-tertiary bg-secondary p-1.5 shadow shadow-white/10"
      }
    >
      <div className={"tool__bar"}>
        <label
          htmlFor="lock"
          className={`flex-center relative rounded-md bg-blue-500 p-2.5 ${activeTool.isLocked ? "bg-teal-950/80" : "bg-secondary"}`}
        >
          <input
            type="checkbox"
            id="lock"
            className="absolute z-0 opacity-0"
            onChange={handleToolLock}
          />
          <div className="relative z-50 text-lg">
            <IoMdLock />
          </div>
        </label>
        <div className="tool__divider" />
        {Object.keys(ToolIcons).map((toolName, index) => (
          <div
            key={index}
            tool-name={toolName}
            className={
              "bg-teal-500/ relative flex items-center justify-center gap-1.5 rounded-md p-2.5 text-quaternary transition-all before:absolute before:bottom-0 before:right-1 before:z-50 before:flex before:items-center before:justify-center before:text-[9px] before:text-slate-400 before:content-[attr(data-index)] hover:bg-teal-950/30"
            }
            onClick={handleToolBarClick}
          >
            <span className={"relative z-10 text-base"}>
              {ToolIcons[toolName as keyof typeof ToolIcons]}
            </span>
            <AnimatePresence mode={"wait"}>
              {activeTool.type === toolName && (
                <motion.span
                  initial={false}
                  className={cn("absolute right-0 top-0 z-0 size-full rounded-md bg-teal-950/80")}
                  layoutId={"active"}
                ></motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Tools;
