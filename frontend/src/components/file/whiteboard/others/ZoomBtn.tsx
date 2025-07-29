import {Minus, Plus} from "lucide-react";

const ZoomBtn = () => {
    return (
      <div
        className={
          "flex h-2/3 items-center justify-center rounded-md bg-secondary p-2 gap-x-2.5 text-xs"
        }
      >
        <div className={"hover:text-gray-400 transition-all"}>
          <Minus />
        </div>
        <div className={"text-xs"}>
          <span>100%</span>
        </div>
        <div className={"hover:text-gray-400 transition-all"}>
          <Plus />
        </div>
      </div>
    );
}
export default ZoomBtn
