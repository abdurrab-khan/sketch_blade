import {Redo2, Undo2} from "lucide-react";

const UndoBtn = () => {
    return (
        <div
            className={
                "flex h-2/3 items-center justify-center text-xs rounded-md bg-secondary p-2 gap-x-6"
            }
        >
            <div className={"hover:text-gray-400 transition-all"}>
                <Redo2/>
            </div>
            <div className={"hover:text-gray-400 transition-all"}>
                <Undo2/>
            </div>
        </div>
    )
}
export default UndoBtn
