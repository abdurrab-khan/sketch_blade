import { Minus, Plus } from "lucide-react";

const ZoomBtn = () => {
  return (
    <div
      className={
        "flex h-2/3 items-center justify-center gap-x-2.5 rounded-md bg-secondary p-2 text-xs"
      }
    >
      <div className={"transition-all hover:text-gray-400"}>
        <Minus />
      </div>
      <div className={"text-xs"}>
        <span>100%</span>
      </div>
      <div className={"transition-all hover:text-gray-400"}>
        <Plus />
      </div>
    </div>
  );
};
export default ZoomBtn;
